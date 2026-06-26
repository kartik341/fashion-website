import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const protectedRoutes = ['/cart', '/checkout', '/orders'];
const adminRoutes = ['/admin'];
const authRoutes = ['/auth/login', '/auth/register'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('auth_token')?.value;
  const session = token ? await verifyToken(token) : null;

  // Redirect logged-in users away from auth pages
  if (authRoutes.some((r) => pathname.startsWith(r)) && session) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Protect customer routes
  if (protectedRoutes.some((r) => pathname.startsWith(r)) && !session) {
    const loginUrl = new URL('/auth/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Protect admin routes
  if (adminRoutes.some((r) => pathname.startsWith(r))) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    if (session.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/cart', '/checkout', '/checkout/:path*', '/orders', '/orders/:path*', '/admin/:path*', '/auth/:path*'],
};
