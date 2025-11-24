'use client';

import { useRequireAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface ProtectedDashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  requireAdmin?: boolean;
}

export function ProtectedDashboardLayout({
  children,
  title,
  description,
  requireAdmin = false,
}: ProtectedDashboardLayoutProps) {
  const router = useRouter();
  const { user, isLoading } = useRequireAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check admin requirement
  if (requireAdmin && user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {title && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              {description && <p className="mt-1 text-gray-600">{description}</p>}
            </div>
            {user && (
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                <span>Welcome, <strong>{user.name || user.email}</strong></span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
