import { apiClient } from './api-client';
import {
  User,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  SocialLoginRequest,
} from '@/types';

export const authService = {
  // Register new user
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.instance.post<AuthResponse>(
      '/auth/register',
      data
    );
    return response.data;
  },

  // Login with email and password
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.instance.post<AuthResponse>(
      '/auth/login',
      data
    );
    return response.data;
  },

  // Social login (Google/Facebook)
  async socialLogin(data: SocialLoginRequest): Promise<AuthResponse> {
    const response = await apiClient.instance.post<AuthResponse>(
      '/auth/social-login',
      data
    );
    return response.data;
  },

  // Get current user
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.instance.get<User>(
      '/users/me'
    );
    return response.data;
  },

  // Logout (usually client-side with NextAuth)
  async logout(): Promise<void> {
    // This is typically handled by NextAuth
    // But if your backend needs a logout endpoint, uncomment:
    // await apiClient.instance.post('/auth/logout');
  },
};
