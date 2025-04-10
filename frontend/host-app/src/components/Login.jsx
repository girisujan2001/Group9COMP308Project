import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLogIn, FiUser, FiLock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

// GraphQL mutation for login
const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      accessToken
      refreshToken
      user {
        id
        username
        email
      }
    }
  }
`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      login(data.login.user, data.login.accessToken);
      navigate('/');
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Please enter your username and password');
      return;
    }
    
    try {
      await loginMutation({ variables: { username, password } });
    } catch (err) {
      // Error is handled in onError callback
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "calc(100vh - 76px)" }}>
      <motion.div 
        className="auth-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-center mb-4 fw-bold">Welcome Back</h2>
          <p className="text-center text-muted mb-4">Sign in to access your account</p>
          
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <Alert variant="danger">{error}</Alert>
            </motion.div>
          )}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4" controlId="formUsername">
              <Form.Label className="fw-medium">
                Username
              </Form.Label>
              <div className="position-relative">
                <Form.Control 
                  className="py-2 ps-4"
                  type="text" 
                  placeholder="Enter your username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  style={{ borderRadius: "8px", transition: "all 0.2s ease-in-out" }}
                />
                <FiUser style={{ position: 'absolute', left: '12px', top: '12px', color: '#6c757d' }} />
              </div>
            </Form.Group>

            <Form.Group className="mb-4" controlId="formPassword">
              <div className="d-flex justify-content-between align-items-center">
                <Form.Label className="fw-medium">Password</Form.Label>
                <a href="#" className="text-decoration-none small">Forgot password?</a>
              </div>
              <div className="position-relative">
                <Form.Control 
                  className="py-2 ps-4"
                  type="password" 
                  placeholder="Enter your password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  style={{ borderRadius: "8px", transition: "all 0.2s ease-in-out" }}
                />
                <FiLock style={{ position: 'absolute', left: '12px', top: '12px', color: '#6c757d' }} />
              </div>
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              disabled={loading} 
              className="w-100 py-2 mt-2 mb-3 d-flex align-items-center justify-content-center" 
              style={{ borderRadius: "8px", transition: "all 0.2s ease" }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Signing in...
                </>
              ) : (
                <>
                  <FiLogIn className="me-2" /> Sign In
                </>
              )}
            </Button>
          </Form>
      
    
          <div className="text-center mt-4">
            <p className="mb-0">Don't have an account? <a href="/signup" className="text-decoration-none fw-medium">Sign up</a></p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;