'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { brandsService } from '@/services';
import { Brand, ProductFilter } from '@/types';

const BRANDS_QUERY_KEY = ['brands'];

export function useBrands() {
  return useQuery({
    queryKey: BRANDS_QUERY_KEY,
    queryFn: () => brandsService.getAll(),
    staleTime: 15 * 60 * 1000,
  });
}

export function useFeaturedBrands() {
  return useQuery({
    queryKey: [...BRANDS_QUERY_KEY, 'featured'],
    queryFn: () => brandsService.getFeatured(),
    staleTime: 15 * 60 * 1000,
  });
}

export function useBrandBySlug(slug: string) {
  return useQuery({
    queryKey: [...BRANDS_QUERY_KEY, slug],
    queryFn: () => brandsService.getBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
}

export function useBrandProducts(slug: string, filters?: ProductFilter) {
  return useQuery({
    queryKey: [...BRANDS_QUERY_KEY, slug, 'products', filters],
    queryFn: () => brandsService.getProducts(slug, filters),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Brand>) => brandsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRANDS_QUERY_KEY });
    },
  });
}

export function useUpdateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Brand> }) =>
      brandsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRANDS_QUERY_KEY });
    },
  });
}

export function useDeleteBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => brandsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRANDS_QUERY_KEY });
    },
  });
}
