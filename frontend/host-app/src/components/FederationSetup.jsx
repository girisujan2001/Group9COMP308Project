import { useEffect } from 'react';

const FederationSetup = ({ apolloClient, apolloContext, apolloError }) => {
  useEffect(() => {
    // Set up global dependencies for module federation
    window.__federation_shared_scope = {
      default: {
        get: (module) => ({
          '@apollo/client': { init: () => apolloClient },
          '@apollo/client/link/context': { init: () => apolloContext },
          '@apollo/client/link/error': { init: () => apolloError },
        }[module])
      }
    };
  }, [apolloClient, apolloContext, apolloError]);

  return null;
};

export default FederationSetup;