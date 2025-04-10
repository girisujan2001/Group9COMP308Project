import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import logger from '../logger.js';

// Load security configurations
const JWT_SECRET = process.env.JWT_SECRET || '3c7a2b4e5f6d8a9c1b2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4';
console.log('Using JWT_SECRET:', JWT_SECRET ? 'From environment' : 'Default value');
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
const TOKEN_REFRESH_THRESHOLD = process.env.TOKEN_REFRESH_THRESHOLD || '1h';
const MAX_LOGIN_ATTEMPTS = parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10);
const LOGIN_BLOCK_TIME = parseInt(process.env.LOGIN_BLOCK_TIME || '15', 10) * 60 * 1000;

// Token storage for refresh tokens
const refreshTokens = new Map();

// Authentication middleware
export const authMiddleware = async ({ req }) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return { user: null };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if token is about to expire
    const now = Date.now() / 1000;
    if (decoded.exp - now < (parseInt(TOKEN_REFRESH_THRESHOLD, 10) * 60)) {
      logger.info('Token nearing expiration, suggesting refresh');
      req.tokenNeedsRefresh = true;
    }

    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      logger.warn(`No user found for token with ID: ${decoded.id}`);
      return { user: null };
    }

    return { 
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    };
  } catch (error) {
    handleJWTError(error);
    return { user: null };
  }
};

// Generate access and refresh tokens
export const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { 
      id: user._id, 
      username: user.username, 
      email: user.email, 
      role: user.role 
    }, 
    JWT_SECRET, 
    { expiresIn: JWT_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );

  // Calculate expiration date for refresh token
  const refreshTokenExpiry = new Date();
  refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7); // 7 days from now
  
  // Store refresh token
  refreshTokens.set(refreshToken, user._id);

  return { accessToken, refreshToken };
};

// Validate refresh token
export const validateRefreshToken = (token) => {
  if (!refreshTokens.has(token)) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    refreshTokens.delete(token);
    handleJWTError(error);
    return null;
  }
};

// Revoke refresh token
export const revokeRefreshToken = (token) => {
  refreshTokens.delete(token);
};

// Handle JWT errors
const handleJWTError = (error) => {
  if (error.name === 'TokenExpiredError') {
    logger.warn('Token expired');
  } else if (error.name === 'JsonWebTokenError') {
    logger.warn('Invalid token');
  } else {
    logger.error('Unexpected authentication error:', error);
  }
};

// Track login attempts
export const trackLoginAttempt = async (userId, success) => {
  const user = await User.findById(userId);
  
  if (!user) return;

  if (success) {
    user.loginAttempts = 0;
    user.lastLogin = new Date();
  } else {
    user.loginAttempts += 1;
    if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      user.loginBlockedUntil = new Date(Date.now() + LOGIN_BLOCK_TIME);
    }
  }

  await user.save();
};