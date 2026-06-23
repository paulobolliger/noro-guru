import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl.clone();
  const { pathname } = request.nextUrl;

  // Clean port if any (e.g. localhost:3001)
  const cleanHost = hostname.split(':')[0];

  // 1. Subdomain matching (e.g. myagency.sites.noro.guru)
  const isSitesSubdomain = cleanHost.endsWith('.sites.noro.guru');
  
  if (isSitesSubdomain) {
    const subdomain = cleanHost.replace('.sites.noro.guru', '');
    if (subdomain && subdomain !== 'www' && subdomain !== 'sites') {
      url.pathname = `/${subdomain}${pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // 2. Custom domain matching
  const isMainDomain = 
    cleanHost === 'sites.noro.guru' || 
    cleanHost === 'noro.guru' || 
    cleanHost === 'localhost' || 
    cleanHost === '127.0.0.1';

  if (!isMainDomain && !isSitesSubdomain) {
    try {
      // Fetch the resolved slug from the internal API route
      const resolveUrl = new URL(`/api/resolve-domain?domain=${encodeURIComponent(cleanHost)}`, request.url);
      const res = await fetch(resolveUrl.toString());
      if (res.ok) {
        const data = await res.json();
        if (data.slug) {
          url.pathname = `/${data.slug}${pathname}`;
          return NextResponse.rewrite(url);
        }
      }
    } catch (error) {
      console.error('[Middleware] Custom domain resolution failed:', error);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api/resolve-domain|favicon.ico).*)'],
};
