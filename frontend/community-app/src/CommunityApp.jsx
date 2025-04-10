import { useEffect, useState } from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { Container } from 'react-bootstrap';
import News from './components/News';
import Discussions from './components/Discussions';
import HelpRequests from './components/HelpRequests';

// Create a client
const createApolloClient = () => {
  // Create community service link
  const communityLink = createHttpLink({
    uri: '/graphql',
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
    console.log('Token from localStorage:', token);
    // Return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    };
  });

  return new ApolloClient({
    link: from([errorLink, authMiddleware, communityLink]),
    cache: new InMemoryCache()
  });
};

const CommunityApp = ({ page = 'news' }) => {
  // Create Apollo client
  const client = createApolloClient();

  // Render the appropriate component based on the page prop
  const renderComponent = () => {
    switch (page) {
      case 'news':
        return <News />;
      case 'discussions':
        return <Discussions />;
      case 'help-requests':
        return <HelpRequests />;
      default:
        return <News />;
    }
  };

  return (
    <ApolloProvider client={client}>
      <Container>
        {renderComponent()}
      </Container>
    </ApolloProvider>
  );
};

export default CommunityApp;