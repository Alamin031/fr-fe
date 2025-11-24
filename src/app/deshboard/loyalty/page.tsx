'use client';

import { ProtectedDashboardLayout } from '@/components/auth/ProtectedDashboardLayout';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function LoyaltyPage() {
  const [users] = useState([]);

  return (
    <ProtectedDashboardLayout 
      title="Loyalty Points"
      description="Manage customer loyalty and rewards"
      requireAdmin={false}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Points Issued</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Points Redeemed</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Active Members</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {users.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No loyalty members yet</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">User</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Points</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Redeemed</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Member Since</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {/* Users will be mapped here */}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </ProtectedDashboardLayout>
  );
}
