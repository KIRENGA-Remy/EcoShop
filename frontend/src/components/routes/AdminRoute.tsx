import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import React from 'react';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user } = useAuthStore();

  return user && user.isAdmin ? <>{children}</> : <Navigate to="/login" replace />;
};

export default AdminRoute;