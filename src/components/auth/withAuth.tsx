'use client';

import { useRouter } from 'next/navigation';
import { useEffect, ComponentType } from 'react';
import { useAuth, type AuthUser } from '@/hooks/useAuth';
import { isAdmin as checkIsAdmin } from '@/lib/auth';

export interface WithAuthProps {
  user: AuthUser;
}

type WithAuthOptions = {
  requireAdmin?: boolean;
  requiredPermission?: string;
};

/**
 * Higher-order component to protect routes with authentication
 */
export function withAuth<P extends WithAuthProps>(
  Component: ComponentType<P>,
  options: WithAuthOptions = {}
) {
  return function WithAuthComponent(props: Omit<P, keyof WithAuthProps>) {
    const router = useRouter();
    const { user, isLoading, isAuthenticated } = useAuth();

    useEffect(() => {
      if (isLoading) return;

      // Check authentication
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      // Check admin requirement
      if (options.requireAdmin && !checkIsAdmin(user?.role)) {
        router.push('/');
        return;
      }
    }, [isLoading, isAuthenticated, user?.role, router]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!isAuthenticated || !user) {
      return null;
    }

    return <Component {...(props as P)} user={user} />;
  };
}

/**
 * Component wrapper for protecting routes
 */
export function ProtectedRoute({
  children,
  requireAdmin = false,
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
}) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (requireAdmin && !checkIsAdmin(user?.role)) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, user?.role, router, requireAdmin]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (requireAdmin && !checkIsAdmin(user.role)) {
    return null;
  }

  return <>{children}</>;
}
