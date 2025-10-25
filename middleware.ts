// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;
  const host = request.headers.get('host') || '';
  const baseDomain = (process.env.MULTITENANT_BASE_DOMAIN || '').toLowerCase();

  const headers = new Headers(request.headers);
  headers.set('x-pathname', pathname);

  let tenantSlug: string | null = null;
  let rewriteTo: URL | null = null;

  // Path-based tenancy: /t/:slug/(...)
  const tMatch = pathname.match(/^\/t\/([a-z0-9-]+)(\/.*)?$/);
  if (tMatch) {
    tenantSlug = tMatch[1];
    const rest = tMatch[2] || '';
    rewriteTo = new URL(`/core${rest || ''}`, url);
  }

  // Subdomain-based tenancy: {slug}.baseDomain
  if (!tenantSlug && baseDomain && host.toLowerCase().endsWith(baseDomain)) {
    const sub = host.slice(0, -baseDomain.length).replace(/\.$/, '');
    if (sub && !['www', 'admin', 'app'].includes(sub)) {
      tenantSlug = sub.toLowerCase();
      if (!pathname.startsWith('/core')) {
        rewriteTo = new URL(`/core${pathname === '/' ? '' : pathname}`, url);
      }
    }
  }

  if (tenantSlug) {
    headers.set('x-tenant-slug', tenantSlug);
  }

  if (rewriteTo) {
    return NextResponse.rewrite(rewriteTo, { request: { headers } });
  }

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

