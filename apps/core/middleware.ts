import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

async function updateSession(request: NextRequest): Promise<NextResponse> {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — do not remove
  await supabase.auth.getUser();

  return supabaseResponse;
}

function createDomainLookupClient(request: NextRequest, response: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );
}

const SYSTEM_DOMAINS = [
  'localhost',
  'noro-guru.vercel.app',
  'noro.guru',
  'core.noro.guru',
  'control.noro.guru',
];

export async function middleware(request: NextRequest) {
  // 1. Auth & Session Management
  const response = await updateSession(request);

  const url = request.nextUrl;
  const hostname = request.headers.get('host') ?? '';

  // Skip rewrites for static files and API routes
  const isPublicFile = url.pathname.includes('.') || url.pathname.startsWith('/_next');
  const isApi = url.pathname.startsWith('/api');

  if (isPublicFile || isApi) {
    return response;
  }

  // 2. Custom Domain Routing
  const isCustomDomain = !SYSTEM_DOMAINS.some((d) => hostname.includes(d));

  if (isCustomDomain) {
    const supabase = createDomainLookupClient(request, response);

    const { data: domainRecord } = await supabase
      .from('noro_domains')
      .select('tenant_id, verified, tenants(slug)')
      .eq('domain', hostname)
      .eq('status', 'active')
      .single();

    if (domainRecord?.tenants) {
      const slug = (domainRecord.tenants as unknown as { slug: string }).slug;
      url.pathname = `/site/${slug}${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
