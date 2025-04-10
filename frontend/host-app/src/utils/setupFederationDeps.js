// Set up dependencies for module federation
import * as apollo from '@apollo/client';
import * as apolloContext from '@apollo/client/link/context';
import * as apolloError from '@apollo/client/link/error';


export const setupFederationDeps = () => {
  // Set up window.__deps if it doesn't exist
  if (!window.__deps) {
    window.__deps = {};
  }

  // Set up Apollo dependencies
  window.__deps.apollo = apollo;
  window.__deps.apolloContext = apolloContext;
  window.__deps.apolloError = apolloError;
};