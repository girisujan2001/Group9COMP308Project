import User from '../models/User.js';
import logger from '../logger.js';
import { 
  generateTokens,
  validateRefreshToken,
  revokeRefreshToken,
  trackLoginAttempt
} from '../utils/auth.js';

const resolvers = {
  Query: {
    // Get current authenticated user
    async getCurrentUser(_, __, { user }) {
      if (!user) {
        throw new Error('Not authenticated');
      }
      return user;
    },

    // Get company information (placeholder)
    company: () => ({
      name: "SpaceX",
      founder: "Elon Musk",
      founded: 2002,
      employees: 9500,
      vehicles: 3
    }),

    // Get roadster information (placeholder)
    roadster: () => ({
      name: "Starman",
      launchDate: "2018-02-06",
      speed: 12345.67,
      earthDistance: 123456789,
      marsDistance: 987654321
    }),

    // Get user by ID (admin only)
    async getUserById(_, { id }, { user }) {
      if (!user || user.role !== 'admin') {
        throw new Error('Not authorized');
      }
      
      try {
        const foundUser = await User.findById(id).select('-password');
        if (!foundUser) {
          throw new Error('User not found');
        }
        return foundUser;
      } catch (error) {
        logger.error('Error fetching user:', error);
        throw new Error('Error fetching user');
      }
    }
  },

  Mutation: {
    // User registration
    async register(_, { username, email, password, role }) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ 
          $or: [{ email }, { username }] 
        });

        if (existingUser) {
          throw new Error('Username or email already exists');
        }

        // Create new user
        const newUser = new User({
          username,
          email,
          password,
          role: role || 'user'
        });

        await newUser.save();

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(newUser);
        
        // Calculate expiration date for refresh token (7 days from now)
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await newUser.addRefreshToken(refreshToken, expiresAt);

        logger.info(`User registered: ${username}`);

        return {
          accessToken,
          refreshToken,
          user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role
          }
        };
      } catch (error) {
        logger.error('Registration error:', error);
        throw new Error(error.message || 'Registration failed');
      }
    },

    // User login
    async login(_, { username, password }) {
      try {
        // Find user by username
        const user = await User.findOne({ username });

        if (!user) {
          throw new Error('Invalid credentials');
        }

        // Check if user is blocked
        if (user.isBlocked()) {
          throw new Error('Account temporarily locked');
        }

        // Check password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
          await trackLoginAttempt(user._id, false);
          throw new Error('Invalid credentials');
        }

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user);
        
        // Calculate expiration date for refresh token (7 days from now)
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await user.addRefreshToken(refreshToken, expiresAt);
        await trackLoginAttempt(user._id, true);

        logger.info(`User logged in: ${username}`);

        return {
          accessToken,
          refreshToken,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
          }
        };
      } catch (error) {
        logger.error('Login error:', error);
        throw new Error(error.message || 'Login failed');
      }
    },

    // Refresh token
    async refreshToken(_, { refreshToken }) {
      try {
        // Validate refresh token
        const decoded = validateRefreshToken(refreshToken);
        if (!decoded) {
          throw new Error('Invalid refresh token');
        }

        // Find user
        const user = await User.findById(decoded.id);
        if (!user) {
          throw new Error('User not found');
        }

        // Check if token exists for user
        const tokenExists = user.refreshTokens.some(t => t.token === refreshToken);
        if (!tokenExists) {
          throw new Error('Invalid refresh token');
        }

        // Generate new tokens
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
        
        // Replace old refresh token
        await user.removeRefreshToken(refreshToken);
        await user.addRefreshToken(newRefreshToken);

        return {
          accessToken,
          refreshToken: newRefreshToken
        };
      } catch (error) {
        logger.error('Token refresh error:', error);
        throw new Error(error.message || 'Token refresh failed');
      }
    },

    // Logout
    async logout(_, { refreshToken }, { user }) {
      try {
        if (!user) {
          throw new Error('Not authenticated');
        }

        // Revoke refresh token
        await revokeRefreshToken(refreshToken);
        await User.findByIdAndUpdate(user.id, {
          $pull: { refreshTokens: { token: refreshToken } }
        });

        return true;
      } catch (error) {
        logger.error('Logout error:', error);
        throw new Error(error.message || 'Logout failed');
      }
    },

    // Update user profile
    async updateUser(_, { id, username, email, role }, { user }) {
      // Ensure user is authenticated and authorized
      if (!user || (user.id !== id && user.role !== 'admin')) {
        throw new Error('Not authorized');
      }

      try {
        const updateData = { username, email, role };
        
        // Remove undefined values
        Object.keys(updateData).forEach(key => 
          updateData[key] === undefined && delete updateData[key]
        );

        const updatedUser = await User.findByIdAndUpdate(
          id, 
          updateData, 
          { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
          throw new Error('User not found');
        }

        logger.info(`User updated: ${updatedUser.username}`);

        return updatedUser;
      } catch (error) {
        logger.error('User update error:', error);
        throw new Error(error.message || 'User update failed');
      }
    },

    // Delete user account
    async deleteUser(_, { id }, { user }) {
      // Ensure user is authenticated and authorized
      if (!user || (user.id !== id && user.role !== 'admin')) {
        throw new Error('Not authorized');
      }

      try {
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
          throw new Error('User not found');
        }

        logger.info(`User deleted: ${deletedUser.username}`);

        return true;
      } catch (error) {
        logger.error('User deletion error:', error);
        throw new Error(error.message || 'User deletion failed');
      }
    }
  }
};

export default resolvers;