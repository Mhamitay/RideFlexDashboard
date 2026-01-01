import { API_BASE } from '../api';
import { LoginRequest, LoginResponse, User } from '../types/auth';

class AuthService {
  private readonly API_URL = `${API_BASE}/api/auth`;

  // Store token in localStorage
  private getStoredToken(): string | null {
    return localStorage.getItem('rideflex_token');
  }

  private setStoredToken(token: string): void {
    localStorage.setItem('rideflex_token', token);
  }

  private removeStoredToken(): void {
    localStorage.removeItem('rideflex_token');
    localStorage.removeItem('rideflex_user');
  }

  private getStoredUser(): User | null {
    const userStr = localStorage.getItem('rideflex_user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  private setStoredUser(user: User): void {
    localStorage.setItem('rideflex_user', JSON.stringify(user));
  }

  // Login method
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.token) {
        this.setStoredToken(data.token);
        if (data.user) {
          this.setStoredUser(data.user);
        }
        return data;
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Login failed',
      };
    }
  }

  // Get current user info
  async getCurrentUser(): Promise<User | null> {
    const token = this.getStoredToken();
    if (!token) return null;

    try {
      const response = await fetch(`${this.API_URL}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const user = await response.json();
        this.setStoredUser(user);
        return user;
      } else if (response.status === 401) {
        // Token expired or invalid
        this.logout();
        return null;
      } else {
        throw new Error('Failed to get user info');
      }
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  // Logout method
  logout(): void {
    const token = this.getStoredToken();
    
    // Call logout endpoint if token exists
    if (token) {
      fetch(`${this.API_URL}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }).catch(() => {
        // Ignore errors on logout - we'll clear local storage anyway
      });
    }

    this.removeStoredToken();
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getStoredToken();
    const user = this.getStoredUser();
    return !!(token && user);
  }

  // Get current token
  getToken(): string | null {
    return this.getStoredToken();
  }

  // Get current user from storage
  getUser(): User | null {
    return this.getStoredUser();
  }

  // Make authenticated API calls
  async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getStoredToken();
    
    if (!token) {
      throw new Error('No authentication token available');
    }

    const authHeaders = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers: authHeaders,
    });

    if (response.status === 401) {
      // Token expired or invalid
      this.logout();
      window.location.href = '/login';
      throw new Error('Authentication expired');
    }

    return response;
  }

  // Check if user has required role
  hasRole(user: User | null, requiredRole: string): boolean {
    if (!user || !user.roles) return false;
    return user.roles.includes(requiredRole);
  }

  // Check if user has required claim
  hasClaim(user: User | null, requiredClaim: string): boolean {
    if (!user || !user.claims) return false;
    return user.claims.includes(requiredClaim);
  }
}

export const authService = new AuthService();
export default authService;
