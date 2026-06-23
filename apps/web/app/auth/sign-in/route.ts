import { signIn } from '@logto/next/server-actions';
import { logtoConfig } from '@/lib/logto';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const redirectUri = searchParams.get('redirect_uri') || '/wizard';

  await signIn(logtoConfig, {
    redirectUri: `${logtoConfig.baseUrl}/auth/callback`,
    postRedirectUri: `${logtoConfig.baseUrl}${redirectUri}`,
  });
}
