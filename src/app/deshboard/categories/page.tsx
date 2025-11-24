'use client';

import { useCategories, useCreateCategory } from '@/hooks';
import { ProtectedDashboardLayout } from '@/components/auth/ProtectedDashboardLayout';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();
  const { mutate: createCategory, isPending } = useCreateCategory();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCategory(formData, {
      onSuccess: () => {
        setFormData({ name: '', slug: '', description: '' });
        setShowForm(false);
      },
    });
  };

  return (
    <ProtectedDashboardLayout 
      title="Categories"
      description="Manage product categories"
      requireAdmin={false}
    >
      <div className="space-y-6">
        {/* Add New Button */}
        <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600">
          + Add New Category
        </Button>

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category Name</label>
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
                {isPending ? 'Creating...' : 'Create Category'}
              </Button>
              <Button type="button" onClick={() => setShowForm(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* Categories List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {isLoading ? (
            <div className="p-6 text-center">Loading categories...</div>
          ) : categories && categories.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Slug</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Description</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-6 py-4">{category.name}</td>
                    <td className="px-6 py-4">{category.slug}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{category.description}</td>
                    <td className="px-6 py-4">
                      <Button variant="outline" size="sm">Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-center text-gray-500">No categories found</div>
          )}
        </div>
      </div>
    </ProtectedDashboardLayout>
  );
}
