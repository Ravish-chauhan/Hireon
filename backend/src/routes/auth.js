const express = require('express');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const User = require('../../models/User');
const { generateAccessToken, generateRefreshToken, generateEmailVerificationToken, verifyToken } = require('../utils/jwt');
const { registerSchema, loginSchema, phoneVerifySchema, requestResetSchema, resetPasswordSchema, refreshTokenSchema } = require('../utils/validation');
const { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail } = require('../services/emailService');
const { sendEmailOTP, sendWelcomeEmailSES } = require('../services/sesEmailService');
const { generatePasswordResetToken, hashPasswordResetToken } = require('../utils/passwordReset');
const { generateOTP, sendOTP } = require('../services/smsService');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Rate limiting
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: { error: 'Too many registration attempts, try again later' }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts, try again later' }
});

// Direct registration without OTP
router.post('/register', registerLimiter, async (req, res) => {
  console.log('Registration attempt:', req.body);
  
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      console.log('Validation error:', error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password, fullName, phone } = value;
    console.log('Validated data:', { email, fullName, phone });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ error: 'Email already registered. Please login.' });
    }

    // Check if phone already exists
    const existingPhone = await User.findOne({ 'profile.phone': phone });
    if (existingPhone) {
      return res.status(400).json({ error: 'Phone number already registered.' });
    }

    // Hash password
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user directly
    const user = new User({
      email,
      password: hashedPassword,
      profile: { fullName, phone },
      isEmailVerified: true,
      isPhoneVerified: true
    });

    await user.save();
    console.log('User created successfully:', user._id);

    // Send welcome email
    try {
      await sendWelcomeEmailSES(user.email, user.profile.fullName);
    } catch (emailError) {
      console.error('Welcome email failed:', emailError.message);
    }

    // Generate tokens for automatic login
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, false);

    // Store refresh token
    user.refreshTokens = [{
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      rememberMe: false
    }];
    await user.save();

    res.status(201).json({
      message: 'Registration successful! Welcome to EduNiaa.',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.profile.fullName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Registration failed',
      details: error.message 
    });
  }
});



// Verify email (keeping for backward compatibility)
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;
    console.log('Email verification attempt with token:', token ? 'TOKEN_PROVIDED' : 'NO_TOKEN');
    
    if (!token) {
      console.log('No token provided');
      return res.status(400).json({ error: 'Verification token required' });
    }

    // Verify token and extract user data
    console.log('Verifying token...');
    const decoded = verifyToken(token);
    console.log('Token decoded successfully:', { purpose: decoded.purpose, hasUserData: !!decoded.userData });
    
    if (decoded.purpose !== 'email_verification' || !decoded.userData) {
      console.log('Invalid token purpose or missing user data');
      return res.status(400).json({ error: 'Invalid verification token' });
    }

    const { email, password, fullName, phone } = decoded.userData;
    console.log('Extracted user data:', { email, fullName, phone });

    // Check if user already exists and is verified
    const existingUser = await User.findOne({ email, isEmailVerified: true });
    if (existingUser) {
      console.log('User already exists and is verified:', email);
      return res.status(400).json({ error: 'Email already verified and registered' });
    }

    // Create user now that email is verified
    console.log('Creating verified user:', email);
    const user = new User({
      email,
      password,
      profile: { fullName, phone },
      isEmailVerified: true, // Set to true since email is now verified
      emailVerificationToken: undefined,
      emailVerificationExpires: undefined
    });

    await user.save();
    console.log('User created successfully:', user._id);

    // Send welcome email (don't let this fail the verification)
    try {
      await sendWelcomeEmail(user.email, user.profile.fullName);
      console.log('Welcome email sent successfully');
    } catch (emailError) {
      console.error('Welcome email failed (but verification succeeded):', emailError.message);
    }

    console.log('Email verification completed successfully for:', email);
    res.json({ message: 'Email verified successfully. Your account has been created!' });
  } catch (error) {
    console.error('Email verification error:', error);
    console.error('Error details:', error.message);
    res.status(400).json({ error: 'Invalid or expired verification token' });
  }
});

// Login
router.post('/login', loginLimiter, async (req, res) => {
  const ipAddress = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent');
  
  console.log('🔍 Login attempt:', { email: req.body?.email, ip: ipAddress });
  
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      console.log('❌ Validation error:', error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password, rememberMe = false } = value;
    console.log('✅ Validation passed for:', email);

    // Find user
    console.log('🔍 Finding user:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    console.log('✅ User found:', { id: user._id, email: user.email });

    // Check if account is locked
    if (user.isLocked) {
      // Log failed attempt
      user.loginLogs.push({
        ipAddress,
        userAgent,
        success: false,
        failureReason: 'Account locked'
      });
      await user.save();
      return res.status(423).json({ error: 'Account temporarily locked due to too many failed attempts' });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      user.loginLogs.push({
        ipAddress,
        userAgent,
        success: false,
        failureReason: 'Email not verified'
      });
      await user.save();
      return res.status(403).json({ error: 'Please verify your email before logging in' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      // Increment login attempts
      await user.incLoginAttempts();
      
      // Log failed attempt
      user.loginLogs.push({
        ipAddress,
        userAgent,
        success: false,
        failureReason: 'Invalid password'
      });
      await user.save();
      
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshTokenExpiry = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
    const refreshToken = generateRefreshToken(user._id, rememberMe);

    // Clean up old expired tokens and limit to 3 active tokens
    const now = new Date();
    const validTokens = user.refreshTokens
      .filter(tokenObj => tokenObj.expiresAt > now)
      .slice(-2); // Keep only last 2 tokens
    
    // Safely update user without triggering validation on existing invalid data
    try {
      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            refreshTokens: [
              ...validTokens,
              {
                token: refreshToken,
                expiresAt: new Date(Date.now() + refreshTokenExpiry),
                rememberMe: !!rememberMe
              }
            ],
            lastLogin: new Date()
          },
          $push: {
            loginLogs: {
              ipAddress,
              userAgent,
              success: true,
              timestamp: new Date()
            }
          },
          $unset: { loginAttempts: 1, lockUntil: 1 }
        }
      );
    } catch (updateError) {
      console.log('⚠️ User update failed, proceeding with login:', updateError.message);
    }

    // Set HTTP-only cookie for refresh token if remember me
    if (rememberMe) {
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: refreshTokenExpiry
      });
    }

    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken: rememberMe ? undefined : refreshToken, // Don't send in response if using cookie
      user: {
        id: user._id,
        email: user.email,
        fullName: user.profile.fullName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified
      }
    });
  } catch (error) {
    console.error('💥 Login error details:', {
      message: error.message,
      stack: error.stack,
      email: req.body?.email,
      timestamp: new Date().toISOString(),
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasUser: !!User
    });
    res.status(500).json({ 
      error: 'Login failed',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Verify phone OTP
router.post('/verify-phone', authenticateToken, async (req, res) => {
  try {
    const { error, value } = phoneVerifySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { phone, otp } = value;
    const user = req.user;

    // Check OTP attempts
    if (user.phoneOTPAttempts >= 3) {
      return res.status(429).json({ error: 'Too many OTP attempts. Please request a new OTP.' });
    }

    // Verify OTP
    if (user.phoneOTP !== otp || user.phoneOTPExpires < Date.now()) {
      user.phoneOTPAttempts += 1;
      await user.save();
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Update user
    user.profile.phone = phone;
    user.isPhoneVerified = true;
    user.phoneOTP = undefined;
    user.phoneOTPExpires = undefined;
    user.phoneOTPAttempts = 0;
    await user.save();

    res.json({ message: 'Phone number verified successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Phone verification failed' });
  }
});

// Send/Resend OTP
router.post('/send-otp', authenticateToken, async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone || !/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({ error: 'Valid 10-digit phone number required' });
    }

    const user = req.user;
    const otp = generateOTP();

    // Save OTP
    user.phoneOTP = otp;
    user.phoneOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    user.phoneOTPAttempts = 0;
    await user.save();

    // Send OTP
    await sendOTP(phone, otp);

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Request password reset
router.post('/request-reset', async (req, res) => {
  try {
    const { error, value } = requestResetSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email } = value;
    const user = await User.findOne({ email });
    
    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    // Generate reset token
    const resetToken = generatePasswordResetToken();
    const hashedToken = hashPasswordResetToken(resetToken);

    // Save hashed token to user
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await user.save();

    // Send reset email with unhashed token
    await sendPasswordResetEmail(email, resetToken);

    res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
  } catch (error) {
    res.status(500).json({ error: 'Password reset request failed' });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { error, value } = resetPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { token, password } = value;
    const hashedToken = hashPasswordResetToken(token);

    // Find user with valid reset token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshTokens = []; // Invalidate all refresh tokens
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: 'Password reset failed' });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken || req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Find user and validate refresh token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const tokenRecord = user.refreshTokens.find(t => t.token === refreshToken && t.expiresAt > Date.now());
    if (!tokenRecord) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    // Generate new access token
    const accessToken = generateAccessToken(user._id, user.role);

    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    console.log('\n=== /ME ENDPOINT ===');
    console.log('👤 Returning user data:', {
      id: user._id,
      email: user.email,
      fullName: user.profile?.fullName,
      role: user.role
    });
    
    const userData = {
      id: user._id,
      email: user.email,
      fullName: user.profile?.fullName || 'User',
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified
    };
    
    res.json(userData);
  } catch (error) {
    console.error('💥 /me endpoint error:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// Logout
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken || req.cookies.refreshToken;
    const user = req.user;

    if (refreshToken) {
      // Remove specific refresh token
      user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);
    } else {
      // Remove all refresh tokens
      user.refreshTokens = [];
    }
    
    await user.save();
    
    // Clear cookie
    res.clearCookie('refreshToken');
    
    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
});

module.exports = router;