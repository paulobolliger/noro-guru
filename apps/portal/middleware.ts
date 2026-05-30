import { type NextRequest, NextResponse } from 'next/server';

/**
 * Resolve o tenant pelo host da requisição e protege rotas de /cliente.
 *
 * Padrões de domínio suportados:
 *   xyz.agencia.noro.guru  → portalSlug = 'xyz'
 *   xyz.com.br             → portalDomain = 'xyz.com.br' (domínio customizado)
 *   localhost:3005          → modo dev (sem resolução de tenant)
 *
 * Headers injetados para uso em Server Components:
 *   x-portal-slug     → slug do tenant (ou vazio)
 *   x-portal-domain   → domínio customizado (ou vazio)
 *   x-portal-host     → host original
 *
 * Rotas /cliente/* exigem cookie de sessão portal_session_id.
 * Se ausente, redireciona para /login.
 */

const NORO_PORTAL_DOMAIN = 'agencia.noro.guru';
const SESSION_COOKIE = 'portal_session_id';

function resolvePortalTenant(host: string): { portalSlug: string; portalDomain: string } {
  // Remove porta (dev: localhost:3005)
  const cleanHost = host.split(':')[0];

  // xyz.agencia.noro.guru
  const subdomainMatch = cleanHost.match(new RegExp(`^([^.]+)\\.${NORO_PORTAL_DOMAIN.replace('.', '\\.')}$`));
  if (subdomainMatch) {
    return { portalSlug: subdomainMatch[1], portalDomain: '' };
  }

  // Domínio customizado — qualquer host que não seja noro.guru
  if (!cleanHost.endsWith('noro.guru') && cleanHost !== 'localhost') {
    return { portalSlug: '', portalDomain: cleanHost };
  }

  // Dev local / sem tenant
  return { portalSlug: '', portalDomain: '' };
}

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? '';
  const { portalSlug, portalDomain } = resolvePortalTenant(host);
  const pathname = request.nextUrl.pathname;

  const response = NextResponse.next();

  // Injeta contexto de tenant para Server Components
  response.headers.set('x-portal-slug', portalSlug);
  response.headers.set('x-portal-domain', portalDomain);
  response.headers.set('x-portal-host', host);

  // Protege /cliente — redireciona para /login se não há sessão
  if (pathname.startsWith('/cliente')) {
    const sessionId = request.cookies.get(SESSION_COOKIE)?.value;
    if (!sessionId) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|woff2?)$).*)',
  ],
};
