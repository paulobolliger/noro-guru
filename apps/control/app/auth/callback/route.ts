import { getKeycloakConfig, sealCookie } from '@/lib/keycloak';
import { NextResponse, type NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing_code', request.url));
  }

  try {
    const config = getKeycloakConfig();
    const tokenResponse = await fetch(config.tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        redirect_uri: `${config.baseUrl}/auth/callback`,
      }),
      cache: 'no-store',
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('[Keycloak Callback] Token exchange failed:', errorText);
      return NextResponse.redirect(new URL('/login?error=exchange_failed', request.url));
    }

    const tokens = (await tokenResponse.json()) as {
      id_token?: string;
      access_token?: string;
      refresh_token?: string;
      expires_in?: number;
    };

    if (!tokens.id_token && !tokens.access_token) {
      return NextResponse.redirect(new URL('/login?error=no_token', request.url));
    }

    // Parse payload from id_token or access_token
    const jwtToken = tokens.id_token || tokens.access_token || '';
    const base64Url = jwtToken.split('.')[1] || '';
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(Buffer.from(base64, 'base64').toString('utf8')) as Record<string, unknown>;

    const expiresAt = Math.floor(Date.now() / 1000) + (tokens.expires_in ?? 28800);
    const sessionData = {
      claims: payload,
      idToken: tokens.id_token,
      refreshToken: tokens.refresh_token,
      expiresAt,
    };

    const sealedCookie = sealCookie(sessionData, config.cookieSecret);
    const response = NextResponse.redirect(new URL('/', config.baseUrl));

    response.cookies.set('keycloak_session', sealedCookie, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: tokens.expires_in ?? 28800,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('[Keycloak Callback] Erro inesperado:', err);
    return NextResponse.redirect(new URL('/login?error=server_error', request.url));
  }
}
