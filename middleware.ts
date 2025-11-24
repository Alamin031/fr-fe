import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/login') ||
                       req.nextUrl.pathname.startsWith('/signup');
    const isDashboard = req.nextUrl.pathname.startsWith('/deshboard');
    const isCheckout = req.nextUrl.pathname.startsWith('/checkout');

    // Redirect authenticated users away from auth pages
    if (isAuthPage && token) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Protect dashboard - only admins and authenticated users
    if (isDashboard && token) {
      // Allow admin and user roles to access dashboard
      if (token.role !== 'admin' && token.role !== 'user') {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    // Protect checkout - authenticated users only
    if (isCheckout && !token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAuthPage = req.nextUrl.pathname.startsWith('/login') ||
                          req.nextUrl.pathname.startsWith('/signup');
        const isDashboard = req.nextUrl.pathname.startsWith('/deshboard');
        const isCheckout = req.nextUrl.pathname.startsWith('/checkout');

        // Allow access to public pages and auth pages without token
        if (isAuthPage) return true;

        // Require authentication for protected routes
        if (isDashboard || isCheckout) {
          return !!token;
        }

        // Allow public pages
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/deshboard/:path*',
    '/checkout/:path*',
    '/login',
    '/signup',
  ],
};
