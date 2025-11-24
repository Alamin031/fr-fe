'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsService } from '@/services';
import { CreateReviewRequest } from '@/types';

const REVIEWS_QUERY_KEY = ['reviews'];

export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: [...REVIEWS_QUERY_KEY, productId],
    queryFn: () => reviewsService.getByProduct(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewRequest) => reviewsService.create(data),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({
        queryKey: [...REVIEWS_QUERY_KEY, productId],
      });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reviewsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEWS_QUERY_KEY });
    },
  });
}
