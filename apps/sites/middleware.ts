import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  
  // Custom domain handling (future)
  // if (hostname !== 'localhost:3001' && hostname !== 'yourdomain.com') {
  //   const customDomain = hostname;
  //   // Query Supabase for custom_domains table
  //   // Redirect to /[slug] based on domain
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
};
