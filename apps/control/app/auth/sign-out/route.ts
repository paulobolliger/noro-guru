import { signOut } from '@logto/next/server-actions';
import { logtoConfig } from '@/lib/logto';

/**
 * GET /auth/sign-out
 *
 * Encerra a sessão Logto e redireciona para /login.
 * Apenas limpa o cookie de sessão Logto — não afeta sessão Supabase.
 *
 * Rota pública — não deve ser protegida pelo middleware.
 *
 * /login (Supabase) permanece como fallback de acesso.
 */
export async function GET() {
  await signOut(logtoConfig, `${logtoConfig.baseUrl}/login`);
}
