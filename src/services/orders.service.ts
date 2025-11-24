import { apiClient } from './api-client';
import {
  Order,
  CreateOrderRequest,
  PaginatedResponse,
  ApiResponse,
  EMICalculation,
} from '@/types';

export const ordersService = {
  // Create order
  async create(data: CreateOrderRequest): Promise<Order> {
    const response = await apiClient.instance.post<Order>(
      '/orders',
      data
    );
    return response.data;
  },

  // Get all orders (admin/management)
  async getAll(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Order>> {
    const response = await apiClient.instance.get<PaginatedResponse<Order>>(
      '/orders',
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  // Get order by ID
  async getById(id: string): Promise<Order> {
    const response = await apiClient.instance.get<Order>(
      `/orders/${id}`
    );
    return response.data;
  },

  // Update order status (admin/management)
  async updateStatus(
    id: string,
    status: Order['status']
  ): Promise<Order> {
    const response = await apiClient.instance.patch<Order>(
      `/orders/${id}/status`,
      { status }
    );
    return response.data;
  },

  // Generate invoice
  async getInvoice(id: string): Promise<Blob> {
    const response = await apiClient.instance.get(
      `/orders/${id}/invoice`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  },

  // Calculate EMI
  async calculateEMI(amount: number, months: number): Promise<EMICalculation> {
    const response = await apiClient.instance.post<EMICalculation>(
      '/orders/calculate-emi',
      { amount, months }
    );
    return response.data;
  },
};
