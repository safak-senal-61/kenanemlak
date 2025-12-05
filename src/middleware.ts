import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
  locales: ['tr', 'en', 'ar'],
  defaultLocale: 'tr'
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If it's an admin path, just set the header and return (skip next-intl)
  if (pathname.startsWith('/admin')) {
    const response = NextResponse.next();
    response.headers.set('x-pathname', pathname);
    return response;
  }

  // Otherwise run next-intl
  const response = intlMiddleware(request);
  response.headers.set('x-pathname', pathname);
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
