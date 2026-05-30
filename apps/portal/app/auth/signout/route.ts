import { type NextRequest, NextResponse } from 'next/server';
import { revokeSessionCookie } from '@/lib/magic-link';

const SESSION_COOKIE = 'portal_session_id';

export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get(SESSION_COOKIE)?.value;

  if (sessionId) {
    await revokeSessionCookie(sessionId);
  }

  const response = NextResponse.redirect(new URL('/login', request.url));
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
