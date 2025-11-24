import { apiClient } from './api-client';
import { LoyaltyPoints, RedeemLoyaltyRequest, ApiResponse } from '@/types';

export const loyaltyService = {
  // Get user loyalty points
  async getPoints(userId: string): Promise<LoyaltyPoints> {
    const response = await apiClient.instance.get<LoyaltyPoints>(
      `/loyalty/${userId}/points`
    );
    return response.data;
  },

  // Redeem loyalty points
  async redeem(userId: string, data: RedeemLoyaltyRequest): Promise<ApiResponse<null>> {
    const response = await apiClient.instance.post<ApiResponse<null>>(
      `/loyalty/${userId}/redeem`,
      data
    );
    return response.data;
  },
};
