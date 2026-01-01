// Authentication types for RideFlex Dashboard
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  claims?: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  refreshToken?: string;
  user?: User;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredClaim?: string;
}
