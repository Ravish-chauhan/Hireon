const express = require('express');
const passport = require('../config/passport');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');

const router = express.Router();

// Google OAuth routes
router.get('/google', (req, res, next) => {
  console.log('\n=== GOOGLE OAUTH INITIATION ===');
  console.log('🚀 Time:', new Date().toISOString());
  console.log('🚀 Full URL:', req.protocol + '://' + req.get('host') + req.originalUrl);
  
  // Store the origin in session or pass as state
  const origin = req.get('Referer') || req.headers.origin;
  console.log('🚀 OAuth initiation from:', origin);
  console.log('🔍 Request headers:', req.headers);
  
  // Pass origin as state parameter
  const authOptions = {
    scope: ['profile', 'email'],
    state: Buffer.from(origin || 'http://localhost:3000').toString('base64')
  };
  
  passport.authenticate('google', authOptions)(req, res, next);
});

router.get('/google/callback', 
  passport.authenticate('google', { 
    session: false,
    failureRedirect: '/auth/error?reason=registration_required'
  }),
  async (req, res) => {
    console.log('\n=== GOOGLE OAUTH CALLBACK ===');
    console.log('🔄 Query params:', req.query);
    console.log('🔄 Headers:', req.headers);
    
    try {
      const user = req.user;
      console.log('\n=== OAUTH CALLBACK SUCCESS ===');
      console.log('🎯 User from passport:', {
        id: user._id,
        email: user.email,
        fullName: user.profile?.fullName,
        googleId: user.socialLogin?.google?.id
      });
      
      // Generate tokens
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);
      console.log('🔑 Generated tokens for user:', user._id);

      // Clean up old expired tokens and limit to 3 active tokens
      const now = new Date();
      user.refreshTokens = user.refreshTokens
        .filter(tokenObj => tokenObj.expiresAt > now)
        .slice(-2); // Keep only last 2 tokens
      
      // Add new refresh token
      user.refreshTokens.push({
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });
      user.lastLogin = new Date();
      await user.save();
      console.log('💾 User updated with refresh token and last login');

      // Get origin from state parameter
      const state = req.query.state;
      console.log('🔄 Raw state parameter:', state);
      let frontendUrl = 'https://www.eduniaa.com'; // Default to production
      
      if (state) {
        try {
          const origin = Buffer.from(state, 'base64').toString();
          console.log('🔄 Decoded origin from state:', origin);
          
          if (origin.includes('eduniaa.com')) {
            frontendUrl = origin.includes('www.') ? 'https://www.eduniaa.com' : 'https://eduniaa.com';
            console.log('Redirecting to eduniaa.com');
          } else if (origin.includes('vercel.app')) {
            frontendUrl = 'https://edunia-nine.vercel.app';
            console.log('Redirecting to vercel.app');
          } else if (origin.includes('localhost:3000')) {
            frontendUrl = 'http://localhost:3000';
            console.log('Redirecting to localhost');
          }
        } catch (e) {
          console.log('Error decoding state, using production default');
        }
      } else {
        console.log('No state parameter, using production default');
      }

      // Redirect to frontend with tokens
      const redirectUrl = `${frontendUrl}/auth/success?token=${accessToken}&refresh=${refreshToken}`;
      console.log('🔄 Final redirect URL:', redirectUrl);
      console.log('🔄 Redirecting user:', {
        userId: user._id,
        email: user.email,
        frontendUrl
      });
      res.redirect(redirectUrl);
    } catch (error) {
      console.log('OAuth callback error:', error);
      const state = req.query.state;
      let frontendUrl = 'https://www.eduniaa.com';
      
      if (state) {
        try {
          const origin = Buffer.from(state, 'base64').toString();
          if (origin.includes('eduniaa.com')) {
            frontendUrl = origin.includes('www.') ? 'https://www.eduniaa.com' : 'https://eduniaa.com';
          } else if (origin.includes('vercel.app')) {
            frontendUrl = 'https://edunia-nine.vercel.app';
          } else if (origin.includes('localhost:3000')) {
            frontendUrl = 'http://localhost:3000';
          }
        } catch (e) {
          console.log('Error decoding state for error redirect');
        }
      }
      
      res.redirect(`${frontendUrl}/auth/error?reason=oauth_error`);
    }
  }
);

// Facebook OAuth routes
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email']
}));

router.get('/facebook/callback',
  passport.authenticate('facebook', { session: false }),
  async (req, res) => {
    try {
      const user = req.user;
      
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      user.refreshTokens.push({
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });
      user.lastLogin = new Date();
      await user.save();

      // Determine redirect URL based on referrer
      const referrer = req.get('Referer');
      let frontendUrl = 'http://localhost:3000';
      
      if (referrer) {
        if (referrer.includes('eduniaa.com')) {
          frontendUrl = 'https://eduniaa.com';
        } else if (referrer.includes('vercel.app')) {
          frontendUrl = 'https://edunia-nine.vercel.app';
        } else if (referrer.includes('localhost:3000')) {
          frontendUrl = 'http://localhost:3000';
        }
      }

      const redirectUrl = `${frontendUrl}/auth/success?token=${accessToken}&refresh=${refreshToken}`;
      res.redirect(redirectUrl);
    } catch (error) {
      const referrer = req.get('Referer');
      let frontendUrl = 'http://localhost:3000';
      
      if (referrer) {
        if (referrer.includes('eduniaa.com')) {
          frontendUrl = 'https://eduniaa.com';
        } else if (referrer.includes('vercel.app')) {
          frontendUrl = 'https://edunia-nine.vercel.app';
        }
      }
      
      res.redirect(`${frontendUrl}/auth/error`);
    }
  }
);

module.exports = router;