'use client';

import { ProtectedDashboardLayout } from '@/components/auth/ProtectedDashboardLayout';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function PoliciesPage() {
  const [policies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', slug: '', content: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement policy creation
  };

  return (
    <ProtectedDashboardLayout 
      title="Policies"
      description="Manage policies, terms, and conditions"
      requireAdmin={true}
    >
      <div className="space-y-6">
        <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600">
          + Create New Policy
        </Button>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Policy Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., Privacy Policy, Terms of Service"
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
                placeholder="e.g., privacy-policy"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                rows={8}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="bg-green-600">Create Policy</Button>
              <Button type="button" onClick={() => setShowForm(false)} variant="outline">Cancel</Button>
            </div>
          </form>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {policies.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No policies found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Slug</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {/* Policies will be mapped here */}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </ProtectedDashboardLayout>
  );
}
