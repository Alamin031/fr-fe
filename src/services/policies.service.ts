import { apiClient } from './api-client';
import { PolicyPage, ApiResponse } from '@/types';

export const policiesService = {
  // Create policy (admin only)
  async create(data: Partial<PolicyPage>): Promise<PolicyPage> {
    const response = await apiClient.instance.post<PolicyPage>(
      '/policies',
      data
    );
    return response.data;
  },

  // Get all policies
  async getAll(): Promise<PolicyPage[]> {
    const response = await apiClient.instance.get<PolicyPage[]>(
      '/policies'
    );
    return response.data;
  },

  // Get policy by slug
  async getBySlug(slug: string): Promise<PolicyPage> {
    const response = await apiClient.instance.get<PolicyPage>(
      `/policies/${slug}`
    );
    return response.data;
  },

  // Update policy (admin only)
  async update(slug: string, data: Partial<PolicyPage>): Promise<PolicyPage> {
    const response = await apiClient.instance.patch<PolicyPage>(
      `/policies/${slug}`,
      data
    );
    return response.data;
  },

  // Delete policy (admin only)
  async delete(slug: string): Promise<ApiResponse<null>> {
    const response = await apiClient.instance.delete<ApiResponse<null>>(
      `/policies/${slug}`
    );
    return response.data;
  },
};
