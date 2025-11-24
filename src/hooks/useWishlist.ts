'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '@/services';

const WISHLIST_QUERY_KEY = ['wishlist'];

export function useWishlist(userId: string) {
  return useQuery({
    queryKey: [...WISHLIST_QUERY_KEY, userId],
    queryFn: () => usersService.getWishlist(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, productId }: { userId: string; productId: string }) =>
      usersService.addToWishlist(userId, productId),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: [...WISHLIST_QUERY_KEY, userId],
      });
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, productId }: { userId: string; productId: string }) =>
      usersService.removeFromWishlist(userId, productId),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: [...WISHLIST_QUERY_KEY, userId],
      });
    },
  });
}
