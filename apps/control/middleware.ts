import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Reescreve qualquer rota /admin/... para a raiz equivalente (/...),
// pois o grupo de rotas é (protected) e não faz parte do path público.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === '/admin') {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
  if (pathname.startsWith('/admin/')) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.replace('/admin', '');
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

