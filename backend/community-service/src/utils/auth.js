import jwt from 'jsonwebtoken';

export const authMiddleware = async ({ req }) => {
  // Get the token from the headers
  const token = req.headers.authorization?.split('Bearer ')[1] || '';
  
  // If no token, return empty context
  if (!token) {
    return { user: null };
  }
  
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Return the user information from the token
    // In a real microservices architecture, we might make an API call to the auth service
    // to validate the token and get the full user details
    return { 
      user: {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      } 
    };
  } catch (error) {
    console.error('Error verifying token:', error.message);
    return { user: null };
  }
};