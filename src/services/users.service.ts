import { apiClient } from './api-client';
import { User, ApiResponse, PaginatedResponse } from '@/types';

export const usersService = {
  // Create user (admin only)
  async create(data: Partial<User>): Promise<User> {
    const response = await apiClient.instance.post<User>(
      '/users',
      data
    );
    return response.data;
  },

  // Get paginated users (admin only)
  async getAll(page: number = 1, limit: number = 10): Promise<PaginatedResponse<User>> {
    const response = await apiClient.instance.get<PaginatedResponse<User>>(
      '/users',
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  // Get all users (admin only)
  async getAllUsers(): Promise<User[]> {
    const response = await apiClient.instance.get<User[]>(
      '/users/all'
    );
    return response.data;
  },

  // Get current user
  async me(): Promise<User> {
    const response = await apiClient.instance.get<User>(
      '/users/me'
    );
    return response.data;
  },

  // Get user by ID
  async getById(id: string): Promise<User> {
    const response = await apiClient.instance.get<User>(
      `/users/${id}`
    );
    return response.data;
  },

  // Update user
  async update(id: string, data: Partial<User>): Promise<User> {
    const response = await apiClient.instance.patch<User>(
      `/users/${id}`,
      data
    );
    return response.data;
  },

  // Delete user
  async delete(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.instance.delete<ApiResponse<null>>(
      `/users/${id}`
    );
    return response.data;
  },

  // Wishlist operations
  async getWishlist(userId: string) {
    const response = await apiClient.instance.get(
      `/users/${userId}/wishlist`
    );
    return response.data;
  },

  async addToWishlist(userId: string, productId: string): Promise<ApiResponse<null>> {
    const response = await apiClient.instance.post<ApiResponse<null>>(
      `/users/${userId}/wishlist`,
      { productId }
    );
    return response.data;
  },

  async removeFromWishlist(userId: string, productId: string): Promise<ApiResponse<null>> {
    const response = await apiClient.instance.delete<ApiResponse<null>>(
      `/users/${userId}/wishlist/${productId}`
    );
    return response.data;
  },

  // Compare operations
  async getCompare(userId: string) {
    const response = await apiClient.instance.get(
      `/users/${userId}/compare`
    );
    return response.data;
  },

  async addToCompare(userId: string, productId: string): Promise<ApiResponse<null>> {
    const response = await apiClient.instance.post<ApiResponse<null>>(
      `/users/${userId}/compare`,
      { productId }
    );
    return response.data;
  },

  async removeFromCompare(userId: string, productId: string): Promise<ApiResponse<null>> {
    const response = await apiClient.instance.delete<ApiResponse<null>>(
      `/users/${userId}/compare/${productId}`
    );
    return response.data;
  },

  // Orders
  async getOrders(userId: string) {
    const response = await apiClient.instance.get(
      `/users/${userId}/orders`
    );
    return response.data;
  },
};
