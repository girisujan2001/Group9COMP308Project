import { useEffect } from 'react';
import { ApolloProvider } from '@apollo/client';
import { Container } from 'react-bootstrap';
import Login from './components/Login';
import Signup from './components/Signup';

// Create a client
const createApolloClient = () => {
  // Import from host app
  const { ApolloClient, InMemoryCache, createHttpLink, from } = window.__deps.apollo;
  const { setContext } = window.__deps.apolloContext;
  const { onError } = window.__deps.apolloError;

  // Create auth service link
  const authLink = createHttpLink({
    uri: 'http://localhost:4001/graphql',
  });

  // Error handling link
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    if (networkError) console.error(`[Network error]: ${networkError}`);
  });

  // Auth middleware
  const authMiddleware = setContext((_, { headers }) => {
    // Get the authentication token from local storage if it exists
    const token = localStorage.getItem('token');
    // Return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    };
  });

  return new ApolloClient({
    link: from([errorLink, authMiddleware, authLink]),
    cache: new InMemoryCache()
  });
};

const AuthApp = ({ page = 'login' }) => {
  // Get the auth context from the host app
  const hostAuthContext = window.__context?.auth;
  
  useEffect(() => {
    // Set up dependencies if they don't exist
    if (!window.__deps) {
      window.__deps = {};
    }
    
    // Import dependencies from host app
    try {
      const hostApp = window.__federation_shared_scope.default;
      
      // Set up Apollo dependencies
      if (!window.__deps.apollo) {
        window.__deps.apollo = hostApp.get('@apollo/client').init();
      }
      
      if (!window.__deps.apolloContext) {
        window.__deps.apolloContext = hostApp.get('@apollo/client/link/context').init();
      }
      
      if (!window.__deps.apolloError) {
        window.__deps.apolloError = hostApp.get('@apollo/client/link/error').init();
      }
    } catch (error) {
      console.error('Error setting up dependencies:', error);
    }
  }, []);

  // Handle successful login
  const handleLoginSuccess = (user, token) => {
    if (hostAuthContext && hostAuthContext.login) {
      hostAuthContext.login(user, token);
      window.location.href = '/';
    }
  };

  // Handle successful signup
  const handleSignupSuccess = (user, token) => {
    if (hostAuthContext && hostAuthContext.login) {
      hostAuthContext.login(user, token);
      window.location.href = '/';
    }
  };

  // Create Apollo client
  const client = createApolloClient();

  return (
    <ApolloProvider client={client}>
      <Container>
        {page === 'login' ? (
          <Login onLoginSuccess={handleLoginSuccess} />
        ) : (
          <Signup onSignupSuccess={handleSignupSuccess} />
        )}
      </Container>
    </ApolloProvider>
  );
};

export default AuthApp;