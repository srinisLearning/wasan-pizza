import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get token and role from cookies
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;

  const pathname = request.nextUrl.pathname;

  // Check if the user is trying to access protected routes
  const isProtectedRoute = 
    pathname.startsWith('/admin') || 
    pathname.startsWith('/customer');

  // Check if the user is trying to access public routes (like login or register)
  const isPublicRoute = 
    pathname === '/login' || 
    pathname === '/register' ||
    pathname === '/';

  // If the route is protected and the user is not authenticated
  if (isProtectedRoute && !token) {
    // Redirect them to the login page
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If the user is logged in and tries to access a public route
  if (isPublicRoute && token) {
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/customer/pizzas', request.url));
    }
  }

  // Continue to the requested route
  const response = NextResponse.next();
  
  // Optional: Add any custom headers if needed
  response.headers.set('x-middleware-executed', 'true');

  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
