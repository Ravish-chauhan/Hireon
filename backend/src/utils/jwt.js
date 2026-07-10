const jwt = require('jsonwebtoken');

const generateAccessToken = (userId, role = 'student') => {
  console.log('🔐 Generating access token for user:', userId, 'with role:', role);
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '2h' });
};

const generateRefreshToken = (userId, rememberMe = false) => {
  const expiresIn = rememberMe ? '30d' : '7d';
  console.log('🔐 Generating refresh token for user:', userId, 'expires in:', expiresIn);
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn });
};

const generateEmailVerificationToken = (userData) => {
  return jwt.sign({ purpose: 'email_verification', userData }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

const verifyToken = (token, secret = process.env.JWT_SECRET) => {
  return jwt.verify(token, secret);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateEmailVerificationToken,
  verifyToken
};