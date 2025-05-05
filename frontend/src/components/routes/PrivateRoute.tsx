import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import React from 'react';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user } = useAuthStore();

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;