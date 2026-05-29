import { handleSignIn } from '@logto/next/server-actions';
import { logtoConfig } from '@/lib/logto';
import { redirect } from 'next/navigation';
import { type NextRequest } from 'next/server';

/**
 * GET /auth/callback
 *
 * Recebe o código de autorização do Logto e conclui o sign-in.
 * handleSignIn troca o código por tokens e persiste a sessão no cookie.
 * Após sucesso, redireciona para / (área principal do /control).
 *
 * CRÍTICO: esta rota deve estar na lista de caminhos públicos do middleware.
 * Se bloqueada, o fluxo de autenticação entra em loop de redirect.
 *
 * Não faz lookup no banco. Não chama requireUser().
 * Validação de identity_links e platform_role ficam para sprint posterior.
 */
export async function GET(request: NextRequest) {
  const callbackUrl = new URL(request.url);
  try {
    await handleSignIn(logtoConfig, callbackUrl);
  } catch (err) {
    // redirect() do Next.js lança NEXT_REDIRECT — deve ser re-lançado
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
  redirect('/');
}
