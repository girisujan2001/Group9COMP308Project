import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { LOGIN_MUTATION } from '../graphql/mutations';

// Validation schema
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
});

const Login = ({ onLoginSuccess }) => {
  const [loginError, setLoginError] = useState('');
  
  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      const { token, user } = data.login;
      onLoginSuccess(user, token);
    },
    onError: (error) => {
      setLoginError(error.message);
    }
  });

  const handleSubmit = async (values) => {
    setLoginError('');
    try {
      await login({
        variables: {
          email: values.email,
          password: values.password
        }
      });
    } catch (error) {
      // Error is handled in onError callback
    }
  };

  return (
    <Card className="auth-container">
      <Card.Body>
        <Card.Title className="text-center mb-4">Login</Card.Title>
        
        {loginError && (
          <Alert variant="danger">{loginError}</Alert>
        )}
        
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={loginSchema}
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
              
              <Button 
                variant="primary" 
                type="submit" 
                className="w-100 mt-3"
                disabled={isSubmitting || loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
              
              <div className="text-center mt-3">
                <p>Don't have an account? <a href="/signup">Sign up</a></p>
              </div>
            </Form>
          )}
        </Formik>
      </Card.Body>
    </Card>
  );
};

export default Login;