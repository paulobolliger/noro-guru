import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createClient } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // 1. Auth & Session Management
  let response = await updateSession(request);
  if (!response) {
      response = NextResponse.next();
  }

  // 2. Custom Domain & Subdomain Routing
  const url = request.nextUrl;
  const hostname = request.headers.get("host")!; // e.g. "app.cliente.com" or "localhost:3000"

  // Define allowed domains (system domains) that shouldn't be rewritten
  // Add your Vercel domains or production domains here
  const allowedDomains = ["localhost:3000", "noro-guru.vercel.app", "noro.guru"];
  
  // Check if it's a verification request or API or static file
  const isPublicFile = url.pathname.includes('.') || url.pathname.startsWith('/_next');
  const isApi = url.pathname.startsWith('/api');

  if (isPublicFile || isApi) {
      return response;
  }

  // If hostname is NOT a system domain, treat it as a potential Custom Domain
  const isCustomDomain = !allowedDomains.some(d => hostname.includes(d));

  if (isCustomDomain) {
      // Lookup tenant associated with this domain
      const supabase = createClient(request, response);
      
      const { data: domainRecord } = await supabase
          .from('noro_domains')
          .select('tenant_id, verified, tenants(slug)')
          .eq('domain', hostname)
          .eq('status', 'active')
          .single();

      if (domainRecord && domainRecord.tenants) {
          // It's a valid custom domain! Rewrite to the tenant's site
          // We rewrite to /site/[slug] so the app knows which tenant context to load
          const slug = (domainRecord.tenants as any).slug;
          
          // Rewrite the URL to the custom site dynamic route
          // Keep the original path (e.g. /login, /dashboard)
          url.pathname = `/site/${slug}${url.pathname}`;
          return NextResponse.rewrite(url);
      }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
