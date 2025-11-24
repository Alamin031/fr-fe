import { apiClient } from './api-client';
import { Review, CreateReviewRequest, ApiResponse } from '@/types';

export const reviewsService = {
  // Create review (authenticated users)
  async create(data: CreateReviewRequest): Promise<Review> {
    const response = await apiClient.instance.post<Review>(
      '/reviews',
      data
    );
    return response.data;
  },

  // Get reviews by product
  async getByProduct(productId: string): Promise<Review[]> {
    const response = await apiClient.instance.get<Review[]>(
      `/reviews/${productId}`
    );
    return response.data;
  },

  // Delete review (admin only)
  async delete(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.instance.delete<ApiResponse<null>>(
      `/reviews/${id}`
    );
    return response.data;
  },
};
