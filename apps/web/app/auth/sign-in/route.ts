import { NextResponse } from 'next/server';
import { signIn } from '@logto/next/server-actions';
import { logtoConfig } from '@/lib/logto';
import { getKeycloakConfig } from '@/lib/keycloak';

export const dynamic = 'force-dynamic';

export async function GET() {
  const provider = process.env.AUTH_PROVIDER || 'keycloak';

  if (provider === 'keycloak') {
    const config = getKeycloakConfig();
    const authUrl = new URL(config.authorizationEndpoint);
    authUrl.search = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: `${config.baseUrl}/auth/callback`,
      response_type: 'code',
      scope: 'openid profile email',
    }).toString();
    return NextResponse.redirect(authUrl);
  }

  await signIn(logtoConfig, {
    redirectUri: `${logtoConfig.baseUrl}/auth/callback`,
    postRedirectUri: `${logtoConfig.baseUrl}/`,
  });
}
