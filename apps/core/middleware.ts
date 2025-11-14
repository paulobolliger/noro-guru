/**
 * Multi-Tenant Middleware
 *
 * Responsabilidades:
 * 1. Resolver tenant_id a partir do domínio/subdomínio
 * 2. Verificar autenticação do usuário
 * 3. Validar que usuário tem acesso ao tenant
 * 4. Passar tenant_id e role via headers para a aplicação
 *
 * IMPORTANTE: Esta é a primeira linha de defesa do isolamento multi-tenant
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get('host') || ''

  // Log para debug
  console.log('[Middleware] Request:', { hostname, pathname })

  // Criar response que pode ser modificado
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Criar cliente Supabase com cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // 1. Resolver tenant_id pelo domínio
  const { data: domain, error: domainError } = await supabase
    .schema('cp')
    .from('domains')
    .select('tenant_id')
    .eq('domain', hostname)
    .maybeSingle()

  if (domainError) {
    console.error('[Middleware] Error fetching domain:', domainError)
  }

  if (!domain) {
    console.warn('[Middleware] Domain not found:', hostname)
    // Em desenvolvimento, permitir acesso sem domínio configurado
    if (process.env.NODE_ENV === 'development') {
      console.log('[Middleware] Development mode: allowing access without domain')
      // Usar tenant 'noro' como padrão em dev
      const { data: defaultTenant } = await supabase
        .schema('cp')
        .from('tenants')
        .select('id')
        .eq('slug', 'noro')
        .single()

      if (defaultTenant) {
        response.headers.set('x-tenant-id', defaultTenant.id)
      }
      return response
    }

    // Em produção, bloquear acesso
    return NextResponse.redirect(new URL('/404', request.url))
  }

  const tenantId = domain.tenant_id

  // 2. Verificar autenticação
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    // Se não autenticado, redirecionar para login
    // Exceto para rotas públicas
    const publicRoutes = ['/login', '/signup', '/forgot-password', '/reset-password']
    if (!publicRoutes.includes(pathname)) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      console.log('[Middleware] User not authenticated, redirecting to login')
      return NextResponse.redirect(loginUrl)
    }
    return response
  }

  // 3. Verificar se usuário tem acesso ao tenant
  const { data: access, error: accessError } = await supabase
    .schema('cp')
    .from('user_tenant_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('tenant_id', tenantId)
    .maybeSingle()

  if (accessError) {
    console.error('[Middleware] Error checking tenant access:', accessError)
  }

  if (!access) {
    console.warn('[Middleware] User does not have access to tenant:', {
      userId: user.id,
      tenantId,
    })

    // Log evento de segurança
    await supabase.rpc('cp.log_security_event', {
      p_action: 'ACCESS_DENIED',
      p_table_name: 'middleware',
      p_blocked: true,
      p_reason: 'User does not belong to tenant',
    }).catch(err => console.error('[Middleware] Error logging security event:', err))

    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  // 4. Passar tenant_id e role via headers para a aplicação
  response.headers.set('x-tenant-id', tenantId)
  response.headers.set('x-tenant-role', access.role)
  response.headers.set('x-user-id', user.id)

  console.log('[Middleware] Access granted:', {
    userId: user.id,
    tenantId,
    role: access.role,
  })

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - login/signup pages
     * - api/auth routes
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|login|signup|api/auth).*)',
  ],
}
