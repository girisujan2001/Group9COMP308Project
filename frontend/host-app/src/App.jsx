import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import * as apolloClient from '@apollo/client';
import * as apolloContext from '@apollo/client/link/context';
import * as apolloError from '@apollo/client/link/error';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppNavbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import FederationSetup from './components/FederationSetup';

// Lazy load micro frontends
const CommunityApp = lazy(() => import('communityApp/CommunityApp'));

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Home component
const Home = () => (
  <Container className="py-5">
    <h1>Welcome to the Community Engagement System</h1>
    <p className="lead">
      Connect with your community, stay informed with the latest news, 
      participate in discussions, and help others in need.
    </p>
    <hr />
    <div className="row mt-4">
      <div className="col-md-4 mb-4">
        <div className="card h-100">
          <div className="card-body">
            <h5 className="card-title">Community News</h5>
            <p className="card-text">Stay updated with the latest news and announcements from your community.</p>
            <a href="/news" className="btn btn-primary">View News</a>
          </div>
        </div>
      </div>
      <div className="col-md-4 mb-4">
        <div className="card h-100">
          <div className="card-body">
            <h5 className="card-title">Discussions</h5>
            <p className="card-text">Join conversations on topics that matter to your community.</p>
            <a href="/discussions" className="btn btn-primary">Join Discussions</a>
          </div>
        </div>
      </div>
      <div className="col-md-4 mb-4">
        <div className="card h-100">
          <div className="card-body">
            <h5 className="card-title">Help Requests</h5>
            <p className="card-text">Request help or volunteer to assist others in your community.</p>
            <a href="/help-requests" className="btn btn-primary">View Help Requests</a>
          </div>
        </div>
      </div>
    </div>
  </Container>
);

function App() {
  return (
    <>
      <FederationSetup 
        apolloClient={apolloClient}
        apolloContext={apolloContext}
        apolloError={apolloError}
      />
      <Router>
        <AuthProvider>
          <AppNavbar />
          <Suspense fallback={<div className="text-center mt-5">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              
              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Community routes - protected */}
              <Route 
                path="/news" 
                element={
                  <ProtectedRoute>
                    <CommunityApp page="news" />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/discussions" 
                element={
                  <ProtectedRoute>
                    <CommunityApp page="discussions" />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/help-requests" 
                element={
                  <ProtectedRoute>
                    <CommunityApp page="help-requests" />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;