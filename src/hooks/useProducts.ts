'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService } from '@/services';
import { Product, ProductFilter } from '@/types';

const PRODUCTS_QUERY_KEY = ['products'];

export function useProducts(filters?: ProductFilter) {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, filters],
    queryFn: () => productsService.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, 'featured'],
    queryFn: () => productsService.getFeatured(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useNewProducts() {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, 'new'],
    queryFn: () => productsService.getNew(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useHotProducts() {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, 'hot'],
    queryFn: () => productsService.getHot(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, slug],
    queryFn: () => productsService.getBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
}

export function useSearchProducts(query: string) {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, 'search', query],
    queryFn: () => productsService.search(query),
    enabled: !!query && query.length > 2,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Product>) => productsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      productsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });
}

export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, productId, 'reviews'],
    queryFn: () => productsService.getReviews(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductFAQs(productId: string) {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, productId, 'faqs'],
    queryFn: () => productsService.getFAQs(productId),
    enabled: !!productId,
    staleTime: 10 * 60 * 1000,
  });
}
