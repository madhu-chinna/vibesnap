// src/components/PrivateRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // You'll need to create this context

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  // If user is not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // If user is authenticated, render the protected component
  return children;
};

export default PrivateRoute;