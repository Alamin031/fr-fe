import { apiClient } from './api-client';
import { SEOMetadata, SitemapItem } from '@/types';

export const seoService = {
  // Get product SEO metadata
  async getProductSEO(id: string): Promise<SEOMetadata> {
    const response = await apiClient.instance.get<SEOMetadata>(
      `/seo/products/${id}`
    );
    return response.data;
  },

  // Get category SEO metadata
  async getCategorySEO(id: string): Promise<SEOMetadata> {
    const response = await apiClient.instance.get<SEOMetadata>(
      `/seo/categories/${id}`
    );
    return response.data;
  },

  // Get brand SEO metadata
  async getBrandSEO(id: string): Promise<SEOMetadata> {
    const response = await apiClient.instance.get<SEOMetadata>(
      `/seo/brands/${id}`
    );
    return response.data;
  },

  // Generate sitemap
  async getSitemap(): Promise<SitemapItem[]> {
    const response = await apiClient.instance.get<SitemapItem[]>(
      '/seo/sitemap'
    );
    return response.data;
  },
};
