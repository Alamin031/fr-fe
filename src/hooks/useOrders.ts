'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersService } from '@/services';
import { Order, CreateOrderRequest } from '@/types';

const ORDERS_QUERY_KEY = ['orders'];

export function useOrders(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, page, limit],
    queryFn: () => ordersService.getAll(page, limit),
    staleTime: 2 * 60 * 1000,
  });
}

export function useOrderById(id: string) {
  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, id],
    queryFn: () => ordersService.getById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => ordersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Order['status'] }) =>
      ordersService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
    },
  });
}

export function useGetInvoice(orderId: string) {
  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, orderId, 'invoice'],
    queryFn: () => ordersService.getInvoice(orderId),
    enabled: !!orderId,
  });
}

export function useCalculateEMI() {
  return useMutation({
    mutationFn: ({ amount, months }: { amount: number; months: number }) =>
      ordersService.calculateEMI(amount, months),
  });
}
