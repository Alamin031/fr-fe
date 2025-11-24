import { apiClient } from './api-client';
import { FAQ, CreateFAQRequest, ApiResponse } from '@/types';

export const faqsService = {
  // Create FAQ (admin/management)
  async create(data: CreateFAQRequest): Promise<FAQ> {
    const response = await apiClient.instance.post<FAQ>(
      '/faqs',
      data
    );
    return response.data;
  },

  // Get all FAQs
  async getAll(productId?: string): Promise<FAQ[]> {
    const response = await apiClient.instance.get<FAQ[]>(
      '/faqs',
      {
        params: productId ? { productId } : {},
      }
    );
    return response.data;
  },

  // Get FAQ by ID
  async getById(id: string): Promise<FAQ> {
    const response = await apiClient.instance.get<FAQ>(
      `/faqs/${id}`
    );
    return response.data;
  },

  // Update FAQ (admin/management)
  async update(id: string, data: Partial<CreateFAQRequest>): Promise<FAQ> {
    const response = await apiClient.instance.patch<FAQ>(
      `/faqs/${id}`,
      data
    );
    return response.data;
  },

  // Delete FAQ (admin only)
  async delete(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.instance.delete<ApiResponse<null>>(
      `/faqs/${id}`
    );
    return response.data;
  },
};
