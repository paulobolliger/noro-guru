// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const { pathname } = req.nextUrl;

  // 🔹 LIBERAR PÁGINA DE TESTE SEM AUTENTICAÇÃO
  if (pathname.startsWith('/admin/test-auth')) return res;

  // 🔹 Rotas admin
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginRoute = pathname === '/admin/login';

  const supabase = createMiddlewareClient({ req, res });

  // Pegar sessão
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Se já está logado e acessa login, redireciona pro dashboard se admin
  if (isLoginRoute && session) {
    const { data: user } = await supabase
      .from('nomade_users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (user && ['admin', 'super_admin'].includes(user.role)) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return res;
  }

  // Se rota admin (exceto login)
  if (isAdminRoute && !isLoginRoute) {
    if (!session) {
      const redirectUrl = new URL('/admin/login', req.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    const { data: user, error } = await supabase
      .from('nomade_users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (error || !user || !['admin', 'super_admin'].includes(user.role)) {
      return NextResponse.redirect(new URL('/?error=unauthorized', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*'],
};
