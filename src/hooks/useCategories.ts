'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesService } from '@/services';
import { Category, ProductFilter } from '@/types';

const CATEGORIES_QUERY_KEY = ['categories'];

export function useCategories() {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: () => categoriesService.getAll(),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

export function useFeaturedCategories() {
  return useQuery({
    queryKey: [...CATEGORIES_QUERY_KEY, 'featured'],
    queryFn: () => categoriesService.getFeatured(),
    staleTime: 15 * 60 * 1000,
  });
}

export function useCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: [...CATEGORIES_QUERY_KEY, slug],
    queryFn: () => categoriesService.getBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
}

export function useCategoryProducts(slug: string, filters?: ProductFilter) {
  return useQuery({
    queryKey: [...CATEGORIES_QUERY_KEY, slug, 'products', filters],
    queryFn: () => categoriesService.getProducts(slug, filters),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Category>) => categoriesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
      categoriesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
}
