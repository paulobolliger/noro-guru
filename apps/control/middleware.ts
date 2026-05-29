import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Caminhos que nunca devem ser interceptados por proteção de sessão.
 *
 * /auth/callback é CRÍTICO: se bloqueado, o fluxo Logto entra em loop de redirect.
 * /login é o login Supabase existente — deve permanecer acessível.
 */
const PUBLIC_PREFIXES = [
  '/auth/',        // /auth/sign-in, /auth/callback, /auth/sign-out (Logto)
  '/login',        // login Supabase (mantido intacto)
  '/public/',      // formulários públicos (ex: /public/leads/submit)
  '/api/contato',  // API pública de contato
  '/api/leads',    // API pública de captura de leads
  '/debug',        // página de debug (dev only)
  '/_next/',       // assets Next.js
  '/favicon.ico',
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Redirect legacy: /admin/* → /*
  // Mantém comportamento pré-existente para compatibilidade.
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

  // Caminhos públicos: passar sem interceptação.
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // TODO Sprint 1M+: quando identity_links e platform_role_assignments estiverem
  // disponíveis em banco dev/staging, ativar proteção Logto global aqui.
  // Estratégia planejada:
  //   const ctx = await getLogtoContext(logtoConfig);  // @logto/next/server-actions
  //   if (!ctx.isAuthenticated) {
  //     return NextResponse.redirect(new URL('/auth/sign-in', req.url));
  //   }
  //
  // ATENÇÃO: não ativar antes de confirmar:
  //   1. identity_links do platform_owner existe no banco dev/staging;
  //   2. platform_role_assignments do platform_owner existe no banco dev/staging;
  //   3. /auth/callback não é interceptado por este bloco;
  //   4. compatibilidade com edge runtime do Next.js 14 confirmada.
  //
  // Enquanto isso, a proteção real das rotas privadas permanece em
  // apps/control/app/(protected)/layout.tsx (guard Supabase).

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Intercepta todas as rotas EXCETO:
     * - arquivos estáticos do Next.js (_next/static, _next/image)
     * - favicon.ico
     * - arquivos com extensão (ex: .png, .svg, .css)
     *
     * Isso garante que assets nunca sejam bloqueados,
     * enquanto todas as rotas de página e API são processadas.
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|woff2?)$).*)',
  ],
};
