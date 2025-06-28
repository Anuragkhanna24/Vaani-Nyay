// PublicRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import apiService from '../apiService';

const PublicRoute = ({ children }) => {
  const isAuthenticated = apiService.isAuthenticated();

  if (isAuthenticated) {
    return <Navigate to="/forms" replace />;
  }

  return children;
};

export default PublicRoute;
