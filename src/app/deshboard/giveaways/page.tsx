'use client';

import { ProtectedDashboardLayout } from '@/components/auth/ProtectedDashboardLayout';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function GiveawaysPage() {
  const [giveaways] = useState([]);
  const [showExport, setShowExport] = useState(false);

  return (
    <ProtectedDashboardLayout 
      title="Giveaway Management"
      description="Manage giveaway entries and contests"
      requireAdmin={false}
    >
      <div className="space-y-6">
        <div className="flex gap-4">
          <Button className="bg-blue-600">+ New Giveaway</Button>
          <Button variant="outline" onClick={() => setShowExport(!showExport)}>
            📥 Export Entries
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Entries</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-600 mb-2">This Month</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Active Contests</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {giveaways.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="mb-2">No giveaway entries yet</p>
              <p className="text-sm">Create a giveaway campaign to start collecting entries</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {/* Entries will be mapped here */}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </ProtectedDashboardLayout>
  );
}
