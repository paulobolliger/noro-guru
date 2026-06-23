import { handleSignIn } from '@logto/next/server-actions';
import { logtoConfig } from '@/lib/logto';
import { redirect } from 'next/navigation';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const callbackUrl = new URL(request.url);
  try {
    await handleSignIn(logtoConfig, callbackUrl);
  } catch (err) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'digest' in err &&
      typeof (err as { digest: unknown }).digest === 'string' &&
      (err as { digest: string }).digest.startsWith('NEXT_REDIRECT')
    ) {
      throw err;
    }
    console.error('[auth/callback] handleSignIn falhou:', err);
    const message = err instanceof Error ? err.message : String(err);
    return new Response(`Erro no callback Logto:\n\n${message}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
  redirect('/wizard');
}
