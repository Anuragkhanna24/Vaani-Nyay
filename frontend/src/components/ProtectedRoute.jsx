import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import apiService from '../apiService';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = apiService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;