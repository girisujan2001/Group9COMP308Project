import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const FederationContextProvider = ({ children }) => {
  const auth = useAuth();

  useEffect(() => {
    // Set up context
    if (!window.__context) {
      window.__context = {};
    }

    // Set up auth context
    window.__context.auth = auth;
  }, [auth]);

  return children;
};

export default FederationContextProvider;