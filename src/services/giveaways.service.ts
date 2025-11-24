import { apiClient } from './api-client';
import {
  GiveawayEntry,
  CreateGiveawayEntryRequest,
  PaginatedResponse,
  ApiResponse,
} from '@/types';

export const giveawaysService = {
  // Create giveaway entry
  async create(data: CreateGiveawayEntryRequest): Promise<GiveawayEntry> {
    const response = await apiClient.instance.post<GiveawayEntry>(
      '/giveaways',
      data
    );
    return response.data;
  },

  // Get all entries (admin only)
  async getAll(page: number = 1, limit: number = 10): Promise<PaginatedResponse<GiveawayEntry>> {
    const response = await apiClient.instance.get<PaginatedResponse<GiveawayEntry>>(
      '/giveaways',
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  // Export entries (admin only)
  async export(): Promise<Blob> {
    const response = await apiClient.instance.get(
      '/giveaways/export',
      {
        responseType: 'blob',
      }
    );
    return response.data;
  },
};
