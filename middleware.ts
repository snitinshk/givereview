import type { NextRequest } from 'next/server'
import { updateSession } from './lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request)
  /*
  const access_token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  let isAuthenticated = false;

  if (access_token) {
    try {
      const jwtPayload = JSON.parse(atob(access_token.split(".")[1]));
      // Check if the token is expired
      if (jwtPayload.exp * 1000 > Date.now()) {
        isAuthenticated = true;
      }
    } catch (error) {
      console.error('Error parsing JWT:', error);
    }
  }
  
  // console.log('**********************')
  // console.log('isAuthenticated:', isAuthenticated);
  // console.log('pathname:', pathname);
  // console.log(request.nextUrl)
  // console.log('**********************')

  // Redirect based on authentication status
  if (pathname.startsWith('/auth') && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin/clients', request.url));
  } else if (pathname.startsWith('/admin') && !isAuthenticated) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
  */
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
