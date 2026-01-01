import React from 'react';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { ProtectedRouteProps } from '../types/auth';
import authService from '../services/authService';

const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
`;

const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  margin-top: 16px;
  color: #6b7280;
  font-size: 16px;
`;

const UnauthorizedContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  padding: 20px;
`;

const UnauthorizedCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 48px 40px;
  text-align: center;
  max-width: 400px;
`;

const UnauthorizedTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #dc2626;
  margin: 0 0 16px 0;
`;

const UnauthorizedMessage = styled.p`
  color: #6b7280;
  font-size: 16px;
  margin: 0 0 24px 0;
  line-height: 1.5;
`;

const BackButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #2563eb;
  }
`;

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole, 
  requiredClaim 
}) => {
  const { isAuthenticated, isLoading, user, logout } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <LoadingContainer>
        <div>
          <LoadingSpinner />
          <LoadingText>Loading...</LoadingText>
        </div>
      </LoadingContainer>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based authorization
  if (requiredRole && !authService.hasRole(user, requiredRole)) {
    return (
      <UnauthorizedContainer>
        <UnauthorizedCard>
          <UnauthorizedTitle>Access Denied</UnauthorizedTitle>
          <UnauthorizedMessage>
            You don't have the required permissions to access this page.
            {requiredRole && ` Required role: ${requiredRole}`}
          </UnauthorizedMessage>
          <BackButton onClick={() => window.history.back()}>
            Go Back
          </BackButton>
        </UnauthorizedCard>
      </UnauthorizedContainer>
    );
  }

  // Check claim-based authorization
  if (requiredClaim && !authService.hasClaim(user, requiredClaim)) {
    return (
      <UnauthorizedContainer>
        <UnauthorizedCard>
          <UnauthorizedTitle>Access Denied</UnauthorizedTitle>
          <UnauthorizedMessage>
            You don't have the required permissions to access this page.
            {requiredClaim && ` Required permission: ${requiredClaim}`}
          </UnauthorizedMessage>
          <BackButton onClick={() => window.history.back()}>
            Go Back
          </BackButton>
        </UnauthorizedCard>
      </UnauthorizedContainer>
    );
  }

  // User is authenticated and authorized
  return <>{children}</>;
};

export default ProtectedRoute;
