
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginScreen from './LoginScreen';
import LoadingSpinner from './LoadingSpinner';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <LoginScreen />;
  }

  return <>{children}</>;
};

export default AuthWrapper;
