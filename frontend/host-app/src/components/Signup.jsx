import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUserPlus, FiUser, FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

// GraphQL mutation for signup
const SIGNUP_MUTATION = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
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

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const [signupMutation, { loading }] = useMutation(SIGNUP_MUTATION, {
    onCompleted: (data) => {
      login(data.register.user, data.register.accessToken);
      navigate('/');
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      await signupMutation({ variables: { username, email, password } });
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
          <h2 className="text-center mb-4 fw-bold">Create Account</h2>
          <p className="text-center text-muted mb-4">Join our community today</p>
          
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
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label className="fw-medium">
                Username
              </Form.Label>
              <div className="position-relative">
                <Form.Control 
                  className="py-2 ps-4"
                  type="text" 
                  placeholder="Choose a username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  style={{ borderRadius: "8px", transition: "all 0.2s ease-in-out" }}
                />
                <FiUser style={{ position: 'absolute', left: '12px', top: '12px', color: '#6c757d' }} />
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label className="fw-medium">
                Email address
              </Form.Label>
              <div className="position-relative">
                <Form.Control 
                  className="py-2 ps-4"
                  type="email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  style={{ borderRadius: "8px", transition: "all 0.2s ease-in-out" }}
                />
                <FiMail style={{ position: 'absolute', left: '12px', top: '12px', color: '#6c757d' }} />
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label className="fw-medium">
                Password
              </Form.Label>
              <div className="position-relative">
                <Form.Control 
                  className="py-2 ps-4"
                  type="password" 
                  placeholder="Create a password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  style={{ borderRadius: "8px", transition: "all 0.2s ease-in-out" }}
                />
                <FiLock style={{ position: 'absolute', left: '12px', top: '12px', color: '#6c757d' }} />
              </div>
            </Form.Group>

            <Form.Group className="mb-4" controlId="formConfirmPassword">
              <Form.Label className="fw-medium">
                Confirm Password
              </Form.Label>
              <div className="position-relative">
                <Form.Control 
                  className="py-2 ps-4"
                  type="password" 
                  placeholder="Confirm your password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
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
                  Creating account...
                </>
              ) : (
                <>
                  <FiUserPlus className="me-2" /> Create Account
                </>
              )}
            </Button>
          </Form>
      
    
          <div className="text-center mt-4">
            <p className="mb-0">Already have an account? <a href="/login" className="text-decoration-none fw-medium">Sign in</a></p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;