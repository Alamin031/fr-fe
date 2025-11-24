import { apiClient } from './api-client';
import {
  WarrantyRecord,
  WarrantyLog,
  ActivateWarrantyRequest,
  WarrantyLookupRequest,
  ApiResponse,
} from '@/types';

export const warrantyService = {
  // Activate warranty (admin/management)
  async activate(data: ActivateWarrantyRequest): Promise<WarrantyRecord> {
    const response = await apiClient.instance.post<WarrantyRecord>(
      '/warranty/activate',
      data
    );
    return response.data;
  },

  // Lookup warranty by IMEI
  async lookup(data: WarrantyLookupRequest): Promise<WarrantyRecord> {
    const response = await apiClient.instance.post<WarrantyRecord>(
      '/warranty/lookup',
      data
    );
    return response.data;
  },

  // Get warranty logs (admin/management)
  async getLogs(id: string): Promise<WarrantyLog[]> {
    const response = await apiClient.instance.get<WarrantyLog[]>(
      `/warranty/${id}/logs`
    );
    return response.data;
  },
};
