import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

// This component checks if the user is an admin.
// If yes, it renders the child components (using <Outlet />).
// If no, it redirects them to the dashboard.
const ProtectedRoute = ({ isAdminRoute = false }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Check if user is logged in
  if (!isAuthenticated || !user) {
    // Redirect to login page if not logged in
    return <Navigate to="/" replace />;
  }

  // Check if this route requires admin and if the user is an admin
  if (isAdminRoute && user?.role !== 'admin') {
    // Redirect to dashboard if logged in but not an admin
    return <Navigate to="/dashboard" replace />;
  }

  // If logged in AND has the required role (or if it's not an admin route), render the content
  return <Outlet />;
};

export default ProtectedRoute;