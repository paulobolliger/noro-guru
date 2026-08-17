import { getSessionClaims } from '@/lib/session';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const claims = await getSessionClaims();

  if (!claims?.sub) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    sub: claims.sub,
    email: claims.email,
    name: claims.name ?? claims.preferred_username,
  });
}
