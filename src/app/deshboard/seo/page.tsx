'use client';

import { ProtectedDashboardLayout } from '@/components/auth/ProtectedDashboardLayout';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function SEOPage() {
  const [selectedType, setSelectedType] = useState<'product' | 'category' | 'brand'>('product');

  return (
    <ProtectedDashboardLayout 
      title="SEO Management"
      description="Manage SEO metadata and optimize for search engines"
      requireAdmin={false}
    >
      <div className="space-y-6">
        {/* Type Selector */}
        <div className="flex gap-2 bg-white p-4 rounded-lg shadow-md">
          <Button
            variant={selectedType === 'product' ? 'default' : 'outline'}
            onClick={() => setSelectedType('product')}
          >
            Products
          </Button>
          <Button
            variant={selectedType === 'category' ? 'default' : 'outline'}
            onClick={() => setSelectedType('category')}
          >
            Categories
          </Button>
          <Button
            variant={selectedType === 'brand' ? 'default' : 'outline'}
            onClick={() => setSelectedType('brand')}
          >
            Brands
          </Button>
        </div>

        {/* Tools Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h3 className="font-semibold">Sitemap Generator</h3>
            <p className="text-sm text-gray-600">Generate XML sitemap for search engines</p>
            <Button className="w-full bg-blue-600">Generate Sitemap</Button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h3 className="font-semibold">Meta Tags Checker</h3>
            <p className="text-sm text-gray-600">Verify SEO meta tags are properly set</p>
            <Button className="w-full bg-blue-600">Check Meta Tags</Button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h3 className="font-semibold">Schema Markup</h3>
            <p className="text-sm text-gray-600">Add structured data for better SEO</p>
            <Button className="w-full bg-blue-600">Configure Schema</Button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h3 className="font-semibold">Robots.txt</h3>
            <p className="text-sm text-gray-600">Configure crawling permissions</p>
            <Button className="w-full bg-blue-600">Edit Robots.txt</Button>
          </div>
        </div>

        {/* SEO Items List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 text-center text-gray-500">
            <p>No {selectedType}s to optimize yet</p>
          </div>
        </div>
      </div>
    </ProtectedDashboardLayout>
  );
}
