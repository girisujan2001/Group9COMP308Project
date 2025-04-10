import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import net from 'net';
import logger from './logger.js';

// Import GraphQL schema and resolvers
import typeDefs from './graphql/schema.js';
import resolvers from './graphql/resolvers.js';
import { authMiddleware } from './utils/auth.js';

// Load environment variables
dotenv.config({ path: new URL('../.env', import.meta.url).pathname });

// Log environment variables for debugging
console.log('Environment variables loaded, JWT_SECRET exists:', !!process.env.JWT_SECRET);

// Create Express app
const app = express();

// Apply middleware
app.use(cors({
  origin: [
    'http://localhost:5000',
    'http://localhost:5001',
    'http://localhost:5002'
  ],
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/community-auth';

mongoose.connect(MONGODB_URI)
  .then(() => logger.info('Connected to MongoDB'))
  .catch(err => logger.error('MongoDB connection error:', err));

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
  formatError: (error) => {
    logger.error('GraphQL Error:', error);
    return {
      message: error.message,
      path: error.path
    };
  }
});

// Check if port is available
function isPortAvailable(port) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    
    server.listen(port, () => {
      server.close(() => {
        logger.info(`Port ${port} is available`);
        resolve(true);
      });
    });
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        logger.warn(`Port ${port} is already in use`);
        resolve(false);
      } else {
        logger.error(`Unexpected error checking port ${port}:`, err);
        reject(err);
      }
    });
  });
}

// Find next available port
async function findAvailablePort(startPort, maxAttempts = 10) {
  logger.info(`Attempting to find available port starting from ${startPort}, max attempts: ${maxAttempts}`);
  
  let currentPort = startPort;
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const available = await isPortAvailable(currentPort);
      if (available) {
        return currentPort;
      }
      currentPort++;
    } catch (err) {
      logger.error(`Error finding available port: ${err.message}`);
      throw err;
    }
  }
  
  throw new Error(`Could not find available port starting from ${startPort}`);
}

// Start Apollo Server
async function startServer() {
  try {
    await server.start();
    
    // Apply Apollo middleware to Express
    server.applyMiddleware({ app });
    
    // Define port with fallback and dynamic port selection
    const BASE_PORT = parseInt(process.env.BASE_PORT || process.env.PORT || '4001', 10);
    const MAX_PORT_ATTEMPTS = parseInt(process.env.MAX_PORT_ATTEMPTS || '10', 10);
    
    const PORT = await findAvailablePort(BASE_PORT, MAX_PORT_ATTEMPTS);
    
    // Create HTTP server for more control
    const httpServer = http.createServer(app);
    
    // Start server with graceful shutdown
    const serverInstance = httpServer.listen(PORT, () => {
      logger.info(`Auth Service running at http://localhost:${PORT}${server.graphqlPath}`);
    });
    
    // Graceful shutdown handling
    const shutdownGracefully = (signal) => {
      logger.info(`${signal} received. Shutting down gracefully`);
      serverInstance.close(() => {
        logger.info('Server closed');
        mongoose.connection.close(false, () => {
          logger.info('MongoDB connection closed');
          process.exit(0);
        });
      });
    };
    
    process.on('SIGTERM', () => shutdownGracefully('SIGTERM'));
    process.on('SIGINT', () => shutdownGracefully('SIGINT'));
    
    return serverInstance;
  } catch (err) {
    logger.error('Fatal error starting server:', err);
    process.exit(1);
  }
}

// Start the server
startServer().catch(err => {
  logger.error('Unhandled error during server startup:', err);
  process.exit(1);
});

export default app; // For potential testing or module usage