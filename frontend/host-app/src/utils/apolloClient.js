import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// Create auth service link
const authLink = createHttpLink({
  uri: 'http://localhost:4001/graphql',
});

// Create community service link
const communityLink = createHttpLink({
  uri: 'http://localhost:4002/graphql',
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

// Create Apollo Client for auth service
export const authClient = new ApolloClient({
  link: from([errorLink, authMiddleware, authLink]),
  cache: new InMemoryCache()
});

// Create Apollo Client for community service
export const communityClient = new ApolloClient({
  link: from([errorLink, authMiddleware, communityLink]),
  cache: new InMemoryCache()
});