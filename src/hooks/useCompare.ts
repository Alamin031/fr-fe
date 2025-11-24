'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '@/services';

const COMPARE_QUERY_KEY = ['compare'];

export function useCompare(userId: string) {
  return useQuery({
    queryKey: [...COMPARE_QUERY_KEY, userId],
    queryFn: () => usersService.getCompare(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddToCompare() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, productId }: { userId: string; productId: string }) =>
      usersService.addToCompare(userId, productId),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: [...COMPARE_QUERY_KEY, userId],
      });
    },
  });
}

export function useRemoveFromCompare() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, productId }: { userId: string; productId: string }) =>
      usersService.removeFromCompare(userId, productId),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: [...COMPARE_QUERY_KEY, userId],
      });
    },
  });
}
