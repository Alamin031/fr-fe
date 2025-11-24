import { apiClient } from './api-client';
import {
  Brand,
  Product,
  PaginatedResponse,
  ApiResponse,
  ProductFilter,
} from '@/types';

export const brandsService = {
  // Create brand (admin only)
  async create(data: Partial<Brand>): Promise<Brand> {
    const response = await apiClient.instance.post<Brand>(
      '/brands',
      data
    );
    return response.data;
  },

  // Get all brands
  async getAll(): Promise<Brand[]> {
    const response = await apiClient.instance.get<Brand[]>(
      '/brands'
    );
    return response.data;
  },

  // Get featured brands
  async getFeatured(): Promise<Brand[]> {
    const response = await apiClient.instance.get<Brand[]>(
      '/brands/featured'
    );
    return response.data;
  },

  // Get brand by slug
  async getBySlug(slug: string): Promise<Brand> {
    const response = await apiClient.instance.get<Brand>(
      `/brands/${slug}`
    );
    return response.data;
  },

  // Get products by brand
  async getProducts(
    slug: string,
    filters?: ProductFilter
  ): Promise<PaginatedResponse<Product>> {
    const response = await apiClient.instance.get<PaginatedResponse<Product>>(
      `/brands/${slug}/products`,
      {
        params: filters,
      }
    );
    return response.data;
  },

  // Update brand (admin only)
  async update(id: string, data: Partial<Brand>): Promise<Brand> {
    const response = await apiClient.instance.patch<Brand>(
      `/brands/${id}`,
      data
    );
    return response.data;
  },

  // Delete brand (admin only)
  async delete(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.instance.delete<ApiResponse<null>>(
      `/brands/${id}`
    );
    return response.data;
  },
};
