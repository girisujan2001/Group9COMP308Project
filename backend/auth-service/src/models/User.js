import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import logger from '../logger.js';

// Configure mongoose strict query
mongoose.set('strictQuery', false);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // New fields for security tracking
  loginAttempts: {
    type: Number,
    default: 0
  },
  lastLogin: {
    type: Date
  },
  loginBlockedUntil: {
    type: Date
  },
  refreshTokens: [{
    token: String,
    issuedAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: Date
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    logger.error('Password hashing error:', error);
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    logger.error('Password comparison error:', error);
    return false;
  }
};

// Check if user is currently blocked
userSchema.methods.isBlocked = function() {
  return this.loginBlockedUntil && this.loginBlockedUntil > new Date();
};

// Add refresh token to user
userSchema.methods.addRefreshToken = function(token, expiresAt) {
  this.refreshTokens.push({ token, expiresAt });
  return this.save();
};

// Remove refresh token from user
userSchema.methods.removeRefreshToken = function(token) {
  this.refreshTokens = this.refreshTokens.filter(t => t.token !== token);
  return this.save();
};

// Clear expired refresh tokens
userSchema.methods.clearExpiredRefreshTokens = function() {
  const now = new Date();
  this.refreshTokens = this.refreshTokens.filter(t => t.expiresAt > now);
  return this.save();
};

// Create indexes for faster queries
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ 'refreshTokens.token': 1 });

const User = mongoose.model('User', userSchema);

export default User;