'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ROLES, hasPermission, isAdmin, type UserRole } from '@/lib/auth';

export interface AuthUser {
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
  role: UserRole;
}

/**
 * Hook to get current user and auth status
 */
export function useAuth() {
  const { data: session, status } = useSession();

  const user: AuthUser | null = session?.user
    ? {
        id: (session.user as any).id || '',
        email: session.user.email || null,
        name: session.user.name || null,
        image: session.user.image || null,
        role: (session.user as any).role || ROLES.USER,
      }
    : null;

  return {
    user,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    isUnauthenticated: status === 'unauthenticated',
  };
}

/**
 * Hook that requires authentication - redirects to login if not authenticated
 */
export function useRequireAuth() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  return { user, isLoading };
}

/**
 * Hook that requires admin role
 */
export function useRequireAdmin() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (!isAdmin(user?.role)) {
        router.push('/');
      }
    }
  }, [isLoading, isAuthenticated, user?.role, router]);

  return { user, isLoading, isAdmin: isAdmin(user?.role) };
}

/**
 * Hook to check if user has specific permission
 */
export function useHasPermission(permission: string) {
  const { user } = useAuth();
  return hasPermission(user?.role, permission);
}

/**
 * Hook to check if user is admin
 */
export function useIsAdmin() {
  const { user } = useAuth();
  return isAdmin(user?.role);
}
