import { type NextRequest, NextResponse } from 'next/server';

const SYSTEM_DOMAINS = [
  'localhost',
  'noro-guru.vercel.app',
  'noro.guru',
  'core.noro.guru',
  'control.noro.guru',
];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });
  const url = request.nextUrl;
  const hostname = request.headers.get('host') ?? '';
  const isPublicFile = url.pathname.includes('.') || url.pathname.startsWith('/_next');
  const isApi = url.pathname.startsWith('/api');

  if (isPublicFile || isApi) {
    return response;
  }

  const isCustomDomain = !SYSTEM_DOMAINS.some((domain) => hostname.includes(domain));
  if (isCustomDomain) {
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
