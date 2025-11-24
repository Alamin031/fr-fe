import { apiClient } from './api-client';
import {
  Product,
  ProductFilter,
  PaginatedResponse,
  ApiResponse,
  Review,
  FAQ,
} from '@/types';

export const productsService = {
  // Create product (admin/management only)
  async create(data: Partial<Product>): Promise<Product> {
    const response = await apiClient.instance.post<Product>(
      '/products',
      data
    );
    return response.data;
  },

  // Get all products with optional filters
  async getAll(filters?: ProductFilter): Promise<PaginatedResponse<Product>> {
    const response = await apiClient.instance.get<PaginatedResponse<Product>>(
      '/products',
      {
        params: filters,
      }
    );
    return response.data;
  },

  // Get featured products
  async getFeatured(): Promise<Product[]> {
    const response = await apiClient.instance.get<Product[]>(
      '/products/featured'
    );
    return response.data;
  },

  // Get new products
  async getNew(): Promise<Product[]> {
    const response = await apiClient.instance.get<Product[]>(
      '/products/new'
    );
    return response.data;
  },

  // Get hot products
  async getHot(): Promise<Product[]> {
    const response = await apiClient.instance.get<Product[]>(
      '/products/hot'
    );
    return response.data;
  },

  // Search products
  async search(query: string): Promise<Product[]> {
    const response = await apiClient.instance.get<Product[]>(
      '/products/search',
      {
        params: { q: query },
      }
    );
    return response.data;
  },

  // Get product by slug
  async getBySlug(slug: string): Promise<Product> {
    const response = await apiClient.instance.get<Product>(
      `/products/${slug}`
    );
    return response.data;
  },

  // Update product (admin/management only)
  async update(id: string, data: Partial<Product>): Promise<Product> {
    const response = await apiClient.instance.patch<Product>(
      `/products/${id}`,
      data
    );
    return response.data;
  },

  // Delete product (admin only)
  async delete(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.instance.delete<ApiResponse<null>>(
      `/products/${id}`
    );
    return response.data;
  },

  // Get product reviews
  async getReviews(productId: string): Promise<Review[]> {
    const response = await apiClient.instance.get<Review[]>(
      `/reviews/${productId}`
    );
    return response.data;
  },

  // Get product FAQs
  async getFAQs(productId: string): Promise<FAQ[]> {
    const response = await apiClient.instance.get<FAQ[]>(
      `/faqs`,
      {
        params: { productId },
      }
    );
    return response.data;
  },
};
