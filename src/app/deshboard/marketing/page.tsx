'use client';

import { ProtectedDashboardLayout } from '@/components/auth/ProtectedDashboardLayout';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function MarketingPage() {
  const [campaigns] = useState([]);
  const [showForm, setShowForm] = useState(false);

  return (
    <ProtectedDashboardLayout 
      title="Marketing"
      description="Create and manage marketing campaigns and promotions"
      requireAdmin={false}
    >
      <div className="space-y-6">
        <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600">
          + Create Campaign
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Active Campaigns</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Clicks</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Conversions</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-600 mb-2">ROI</h3>
            <p className="text-3xl font-bold">0%</p>
          </div>
        </div>

        {/* Campaign Types */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h3 className="font-semibold">Email Campaigns</h3>
            <p className="text-sm text-gray-600">Send promotional emails to customers</p>
            <Button variant="outline" className="w-full">Create Email</Button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h3 className="font-semibold">Discounts & Coupons</h3>
            <p className="text-sm text-gray-600">Create promotional codes</p>
            <Button variant="outline" className="w-full">New Coupon</Button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h3 className="font-semibold">Featured Products</h3>
            <p className="text-sm text-gray-600">Highlight products on homepage</p>
            <Button variant="outline" className="w-full">Feature Products</Button>
          </div>
        </div>

        {/* Campaigns List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {campaigns.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No campaigns yet</p>
              <p className="text-sm">Create your first marketing campaign to get started</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Performance</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {/* Campaigns will be mapped here */}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </ProtectedDashboardLayout>
  );
}
