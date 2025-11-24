import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * User roles and their permissions
 */
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

/**
 * Permission matrix for roles
 */
export const PERMISSIONS = {
  [ROLES.ADMIN]: [
    'view_dashboard',
    'manage_products',
    'manage_orders',
    'manage_users',
    'manage_settings',
    'view_analytics',
  ],
  [ROLES.USER]: [
    'view_products',
    'create_order',
    'view_own_orders',
    'edit_profile',
  ],
  [ROLES.GUEST]: [
    'view_products',
  ],
} as const;

/**
 * Check if user has permission
 */
export function hasPermission(role: UserRole | undefined, permission: string): boolean {
  if (!role || !(role in PERMISSIONS)) {
    return false;
  }
  return PERMISSIONS[role as keyof typeof PERMISSIONS].includes(permission);
}

/**
 * Check if user is admin
 */
export function isAdmin(role: UserRole | undefined): boolean {
  return role === ROLES.ADMIN;
}

/**
 * Get current session with error handling
 */
export async function getCurrentSession() {
  try {
    const session = await getServerSession(authOptions);
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Get current user with validation
 */
export async function getCurrentUser() {
  const session = await getCurrentSession();
  
  if (!session?.user) {
    return null;
  }

  return {
    id: (session.user as any).id,
    email: session.user.email,
    name: session.user.name,
    image: session.user.image,
    role: (session.user as any).role || ROLES.USER,
  };
}

/**
 * Require authentication - use in Server Components
 */
export async function requireAuth() {
  const session = await getCurrentSession();
  
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  return session;
}

/**
 * Require admin role - use in Server Components
 */
export async function requireAdmin() {
  const user = await getCurrentUser();
  
  if (!user || user.role !== ROLES.ADMIN) {
    throw new Error('Unauthorized - Admin access required');
  }

  return user;
}

/**
 * Require specific permission
 */
export async function requirePermission(permission: string) {
  const user = await getCurrentUser();
  
  if (!user || !hasPermission(user.role as UserRole, permission)) {
    throw new Error(`Unauthorized - ${permission} required`);
  }

  return user;
}
