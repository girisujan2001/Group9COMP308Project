import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import net from 'net';

// Import GraphQL schema and resolvers
import typeDefs from './graphql/schema.js';
import resolvers from './graphql/resolvers.js';
import { authMiddleware } from './utils/auth.js';

// Load environment variables
dotenv.config();

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
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/community-engagement';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
  formatError: (error) => {
    console.error('GraphQL Error:', error);
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
        console.log(`Port ${port} is available`);
        resolve(true);
      });
    });
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`Port ${port} is already in use`);
        resolve(false);
      } else {
        console.error(`Unexpected error checking port ${port}:`, err);
        reject(err);
      }
    });
  });
}

// Find next available port
async function findAvailablePort(startPort, maxAttempts = 10) {
  console.log(`Attempting to find available port starting from ${startPort}, max attempts: ${maxAttempts}`);
  
  let currentPort = startPort;
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const available = await isPortAvailable(currentPort);
      if (available) {
        return currentPort;
      }
      currentPort++;
    } catch (err) {
      console.error(`Error finding available port: ${err.message}`);
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
    const BASE_PORT = parseInt(process.env.BASE_PORT || process.env.PORT || '4002', 10);
    const MAX_PORT_ATTEMPTS = parseInt(process.env.MAX_PORT_ATTEMPTS || '10', 10);
    
    const PORT = await findAvailablePort(BASE_PORT, MAX_PORT_ATTEMPTS);
    
    // Create HTTP server for more control
    const httpServer = http.createServer(app);
    
    // Start server with graceful shutdown
    const serverInstance = httpServer.listen(PORT, () => {
      console.log(`Community Service running at http://localhost:${PORT}${server.graphqlPath}`);
    });
    
    // Graceful shutdown handling
    const shutdownGracefully = (signal) => {
      console.log(`${signal} received. Shutting down gracefully`);
      serverInstance.close(() => {
        console.log('Server closed');
        mongoose.connection.close(false, () => {
          console.log('MongoDB connection closed');
          process.exit(0);
        });
      });
    };
    
    process.on('SIGTERM', () => shutdownGracefully('SIGTERM'));
    process.on('SIGINT', () => shutdownGracefully('SIGINT'));
    
    return serverInstance;
  } catch (err) {
    console.error('Fatal error starting server:', err);
    process.exit(1);
  }
}

startServer().catch(err => {
  console.error('Unhandled error during server startup:', err);
  process.exit(1);
});

export default app; // For potential testing or module usage