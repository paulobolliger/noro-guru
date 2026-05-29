import { signIn } from '@logto/next/server-actions';
import { logtoConfig } from '@/lib/logto';

/**
 * GET /auth/sign-in
 *
 * Inicia o fluxo de login Logto.
 * Redireciona para o servidor Logto (https://auth.norotec.cloud).
 * Após autenticação, Logto redireciona para /auth/callback.
 *
 * Rota pública — não deve ser protegida pelo middleware.
 * Não faz lookup no banco. Não chama requireUser().
 *
 * Fluxo Logto paralelo ao login Supabase (/login).
 * O login Supabase permanece intacto nesta sprint.
 */
export async function GET() {
  await signIn(logtoConfig, {
    redirectUri: `${logtoConfig.baseUrl}/auth/callback`,
    postRedirectUri: `${logtoConfig.baseUrl}/`,
  });
}
