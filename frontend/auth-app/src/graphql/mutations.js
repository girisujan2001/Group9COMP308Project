import { gql } from '@apollo/client';

// Signup mutation
export const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $email: String!, $password: String!, $role: String!) {
    signup(username: $username, email: $email, password: $password, role: $role) {
      token
      user {
        id
        username
        email
        role
        createdAt
      }
    }
  }
`;

// Login mutation
export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        email
        role
        createdAt
      }
    }
  }
`;

// Logout mutation
export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;