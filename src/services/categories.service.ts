import { apiClient } from './api-client';
import { Category, ProductFilter, PaginatedResponse, Product, ApiResponse } from '@/types';

export const categoriesService = {
  // Create category (admin only)
  async create(data: Partial<Category>): Promise<Category> {
    const response = await apiClient.instance.post<Category>(
      '/categories',
      data
    );
    return response.data;
  },

  // Get all categories
  async getAll(): Promise<Category[]> {
    const response = await apiClient.instance.get<Category[]>(
      '/categories'
    );
    return response.data;
  },

  // Get featured categories
  async getFeatured(): Promise<Category[]> {
    const response = await apiClient.instance.get<Category[]>(
      '/categories/featured'
    );
    return response.data;
  },

  // Get category by slug
  async getBySlug(slug: string): Promise<Category> {
    const response = await apiClient.instance.get<Category>(
      `/categories/${slug}`
    );
    return response.data;
  },

  // Get products in category with filters
  async getProducts(
    slug: string,
    filters?: ProductFilter
  ): Promise<PaginatedResponse<Product>> {
    const response = await apiClient.instance.get<PaginatedResponse<Product>>(
      `/categories/${slug}/products`,
      {
        params: filters,
      }
    );
    return response.data;
  },

  // Update category (admin only)
  async update(id: string, data: Partial<Category>): Promise<Category> {
    const response = await apiClient.instance.patch<Category>(
      `/categories/${id}`,
      data
    );
    return response.data;
  },

  // Delete category (admin only)
  async delete(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.instance.delete<ApiResponse<null>>(
      `/categories/${id}`
    );
    return response.data;
  },
};
