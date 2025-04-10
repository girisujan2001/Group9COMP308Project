import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { SIGNUP_MUTATION } from '../graphql/mutations';

// Validation schema
const signupSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  role: Yup.string()
    .required('Role is required')
    .oneOf(['resident', 'business_owner', 'community_organizer'], 'Invalid role')
});

const Signup = ({ onSignupSuccess }) => {
  const [signupError, setSignupError] = useState('');
  
  const [signup, { loading }] = useMutation(SIGNUP_MUTATION, {
    onCompleted: (data) => {
      const { token, user } = data.signup;
      onSignupSuccess(user, token);
    },
    onError: (error) => {
      setSignupError(error.message);
    }
  });

  const handleSubmit = async (values) => {
    setSignupError('');
    try {
      await signup({
        variables: {
          username: values.username,
          email: values.email,
          password: values.password,
          role: values.role
        }
      });
    } catch (error) {
      // Error is handled in onError callback
    }
  };

  return (
    <Card className="auth-container">
      <Card.Body>
        <Card.Title className="text-center mb-4">Sign Up</Card.Title>
        
        {signupError && (
          <Alert variant="danger">{signupError}</Alert>
        )}
        
        <Formik
          initialValues={{ 
            username: '', 
            email: '', 
            password: '', 
            confirmPassword: '',
            role: 'resident'
          }}
          validationSchema={signupSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting
          }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.username && errors.username}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.email && errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.password && errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.confirmPassword && errors.confirmPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  name="role"
                  value={values.role}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.role && errors.role}
                >
                  <option value="resident">Resident</option>
                  <option value="business_owner">Business Owner</option>
                  <option value="community_organizer">Community Organizer</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.role}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Button 
                variant="primary" 
                type="submit" 
                className="w-100 mt-3"
                disabled={isSubmitting || loading}
              >
                {loading ? 'Signing up...' : 'Sign Up'}
              </Button>
              
              <div className="text-center mt-3">
                <p>Already have an account? <a href="/login">Login</a></p>
              </div>
            </Form>
          )}
        </Formik>
      </Card.Body>
    </Card>
  );
};

export default Signup;