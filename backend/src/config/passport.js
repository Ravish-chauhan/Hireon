const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../../models/User');

// Google OAuth Strategy - only if credentials exist
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  const getCallbackURL = () => {
    // Use EC2 URL for production
    return 'https://api.eduniaa.com/api/auth/google/callback';
  };

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: getCallbackURL()
  }, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('\n=== GOOGLE OAUTH STRATEGY ===');
    console.log('🔍 Profile ID:', profile.id);
    console.log('🔍 Profile Email:', profile.emails[0].value);
    console.log('🔍 Profile Name:', profile.displayName);
    
    // Check if user exists with this Google ID
    let user = await User.findOne({ 'socialLogin.google.id': profile.id });
    
    if (user) {
      console.log('✅ Found existing user by Google ID:', user.email);
      user.lastLogin = new Date();
      await user.save();
      return done(null, user);
    }

    // Check if user exists with this email
    user = await User.findOne({ email: profile.emails[0].value });
    
    if (user) {
      console.log('✅ Found existing user by email, linking Google account:', user.email);
      // Link Google account to existing user
      user.socialLogin.isEnabled = true;
      user.socialLogin.google.id = profile.id;
      user.socialLogin.google.email = profile.emails[0].value;
      user.isEmailVerified = true; // Google emails are pre-verified
      user.lastLogin = new Date();
      await user.save();
      return done(null, user);
    }

    // Create new user with Google account
    console.log('🆕 Creating new user with Google account:', profile.emails[0].value);
    user = new User({
      email: profile.emails[0].value,
      profile: {
        fullName: profile.displayName
      },
      socialLogin: {
        isEnabled: true,
        google: {
          id: profile.id,
          email: profile.emails[0].value
        }
      },
      isEmailVerified: true,
      isPhoneVerified: false,
      lastLogin: new Date()
    });
    
    await user.save();
    console.log('✅ New user created with Google OAuth:', user._id);
    return done(null, user);
  } catch (error) {
    done(error, null);
  }
  }));
}

// Facebook OAuth Strategy - only if credentials exist
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  const getFacebookCallbackURL = () => {
    // Use EC2 URL for production
    return 'https://api.eduniaa.com/api/auth/facebook/callback';
  };

  passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: getFacebookCallbackURL(),
  profileFields: ['id', 'emails', 'name']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ 'socialLogin.facebook.id': profile.id });
    
    if (user) {
      return done(null, user);
    }

    user = await User.findOne({ email: profile.emails[0].value });
    
    if (user) {
      user.socialLogin.isEnabled = true;
      user.socialLogin.facebook.id = profile.id;
      user.socialLogin.facebook.email = profile.emails[0].value;
      user.isEmailVerified = true;
      await user.save();
      return done(null, user);
    }

    // Create new user with Facebook account
    user = new User({
      email: profile.emails[0].value,
      profile: {
        fullName: `${profile.name.givenName} ${profile.name.familyName}`
      },
      socialLogin: {
        isEnabled: true,
        facebook: {
          id: profile.id,
          email: profile.emails[0].value
        }
      },
      isEmailVerified: true,
      isPhoneVerified: false
    });
    
    await user.save();
    return done(null, user);
  } catch (error) {
    done(error, null);
  }
  }));
}

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;