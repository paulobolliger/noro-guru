import { type NextRequest, NextResponse } from 'next/server';

const PUBLIC_PREFIXES = [
  '/auth/',
  '/login',
  '/public/',
  '/api/contato',
  '/api/leads',
  '/_next/',
  '/favicon.ico',
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Proteção real em (protected)/layout.tsx via requireUser() + keycloakSessionAdapter.
  // Middleware apenas garante que /auth/* nunca seja bloqueado.
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|woff2?)$).*)',
  ],
};
