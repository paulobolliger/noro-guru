import { getKeycloakConfig, unsealCookie } from '@/lib/keycloak';
import { NextResponse, type NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const config = getKeycloakConfig();
  const cookieValue = request.cookies.get('keycloak_session')?.value;
  const session = cookieValue ? unsealCookie<{ refreshToken?: string }>(cookieValue, config.cookieSecret) : null;

  if (session?.refreshToken) {
    await fetch(config.endSessionEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        refresh_token: session.refreshToken,
      }),
      cache: 'no-store',
    }).catch(() => null);
  }

  const response = NextResponse.redirect(new URL('/login', config.baseUrl));
  response.cookies.delete('keycloak_session');
  return response;
}
