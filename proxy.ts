import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './routing';

// Create the i18n middleware
const middleware = createMiddleware(routing);

// Export as named 'proxy' export (required for Next.js 16)
export function proxy(request: NextRequest) {
  console.log('[proxy] Request URL:', request.url);
  const response = middleware(request);
  console.log('[proxy] Middleware returned');
  return response;
}

// Configure which routes should run the proxy
export const config = {
  matcher: [
    // Match all paths except internal Next.js paths and static files
    '/((?!_next|favicon.ico|.*\\..*).*)',
  ],
};