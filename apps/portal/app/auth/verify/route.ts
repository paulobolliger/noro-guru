import { type NextRequest, NextResponse } from 'next/server';
import { verifyMagicLinkAndCreateSession } from '@/lib/magic-link';

const SESSION_COOKIE = 'portal_session_id';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 dias

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/login?error=invalid_token', request.url));
  }

  const session = await verifyMagicLinkAndCreateSession(token);

  if (!session) {
    return NextResponse.redirect(new URL('/login?error=expired_token', request.url));
  }

  const response = NextResponse.redirect(new URL('/cliente', request.url));

  response.cookies.set(SESSION_COOKIE, session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });

  return response;
}
