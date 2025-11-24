'use client';

import { useBrands, useCreateBrand } from '@/hooks';
import { ProtectedDashboardLayout } from '@/components/auth/ProtectedDashboardLayout';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function BrandsPage() {
  const { data: brands, isLoading } = useBrands();
  const { mutate: createBrand, isPending } = useCreateBrand();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', slug: '', logo: '', description: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBrand(formData, {
      onSuccess: () => {
        setFormData({ name: '', slug: '', logo: '', description: '' });
        setShowForm(false);
      },
    });
  };

  return (
    <ProtectedDashboardLayout 
      title="Brands"
      description="Manage product brands"
      requireAdmin={false}
    >
      <div className="space-y-6">
        <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600">
          + Add New Brand
        </Button>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Brand Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Logo URL</label>
              <input
                type="text"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isPending} className="bg-green-600">
                {isPending ? 'Creating...' : 'Create Brand'}
              </Button>
              <Button type="button" onClick={() => setShowForm(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </form>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {isLoading ? (
            <div className="p-6 text-center">Loading brands...</div>
          ) : brands && brands.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Slug</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {brands.map((brand) => (
                  <tr key={brand.id}>
                    <td className="px-6 py-4">{brand.name}</td>
                    <td className="px-6 py-4">{brand.slug}</td>
                    <td className="px-6 py-4">
                      <Button variant="outline" size="sm">Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-center text-gray-500">No brands found</div>
          )}
        </div>
      </div>
    </ProtectedDashboardLayout>
  );
}
