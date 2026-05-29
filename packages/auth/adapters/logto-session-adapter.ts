/**
 * Adapter de sessão Logto para Next.js (App Router).
 *
 * Depende de: @logto/next (instalado em packages/auth)
 *
 * Uso em Server Components ou Server Actions:
 *
 *   import { logtoSessionAdapter } from '@noro/auth/adapters';
 *   const userCtx = await requireUser({ db, sessionAdapter: logtoSessionAdapter(logtoConfig) });
 *
 * Para testes unitários sem banco real, passe `claims` explicitamente:
 *
 *   const userCtx = await requireUser({
 *     db: mockDb,
 *     claims: { provider: 'logto', subject: 'test-sub', email: 'a@b.com' },
 *   });
 *
 * Variáveis de ambiente necessárias (declaradas em turbo.json):
 *   LOGTO_ENDPOINT, LOGTO_APP_ID, LOGTO_APP_SECRET, LOGTO_COOKIE_SECRET
 *
 * Integração completa exige também que o app configure:
 *   - rota de callback: /auth/callback (handleSignIn)
 *   - rota de sign-in: /auth/sign-in (signIn)
 *   - rota de sign-out: /auth/sign-out (signOut)
 *
 * A migração das rotas de autenticação dos apps é responsabilidade de sprint própria (Sprint 1K+).
 * Este adapter é seguro para uso em packages/auth sem acoplamento com apps específicos.
 */

import { getLogtoContext } from '@logto/next/server-actions';
import type { LogtoNextConfig } from '@logto/next';

export type LogtoSessionClaims = {
  /**
   * Discriminador do provedor — sempre "logto" neste adapter.
   */
  provider: 'logto';
  /**
   * Subject do Logto (equivalente ao `sub` do JWT / `IdTokenClaims.sub`).
   * Mapeado para `identity_links.provider_subject` no banco.
   */
  providerSubject: string;
  /** E-mail primário do usuário conforme claim Logto. */
  email?: string | null;
  /** Nome de exibição conforme claim Logto (campo `name` do IdTokenClaims). */
  name?: string | null;
  /** URL do avatar conforme claim Logto (campo `picture` do IdTokenClaims). */
  picture?: string | null;
  /**
   * Payload bruto do IdTokenClaims retornado pelo SDK.
   * Não utilizar diretamente em lógica de domínio.
   */
  rawClaims?: unknown;
};

export class LogtoSessionUnauthenticatedError extends Error {
  constructor() {
    super('LogtoSessionAdapter: sessão Logto não encontrada ou expirada.');
    this.name = 'LogtoSessionUnauthenticatedError';
  }
}

/**
 * Lê a sessão Logto a partir do contexto Next.js App Router.
 *
 * Chama `getLogtoContext()` do `@logto/next/server-actions`.
 * Deve ser chamado apenas em Server Components ou Server Actions (não em Client Components).
 *
 * Retorna `LogtoSessionClaims` se autenticado, ou `null` se anônimo.
 * Não lança erro se o usuário não estiver autenticado — retorna `null`.
 */
async function readLogtoSession(config: LogtoNextConfig): Promise<LogtoSessionClaims | null> {
  const ctx = await getLogtoContext(config);

  if (!ctx.isAuthenticated || !ctx.claims?.sub) {
    return null;
  }

  return {
    provider: 'logto',
    providerSubject: ctx.claims.sub,
    email: ctx.claims.email ?? null,
    name: ctx.claims.name ?? null,
    picture: ctx.claims.picture ?? null,
    rawClaims: ctx.claims,
  };
}

/**
 * Cria um `AuthSessionAdapter` para ser passado a `requireUser()` ou `getCurrentUser()`.
 *
 * Recebe a `LogtoNextConfig` do app que o instancia (evita acoplamento entre packages/auth
 * e a configuração específica de cada app Next.js).
 *
 * Uso típico em um Server Action de app:
 *
 *   // apps/control/lib/logto.ts (criado na sprint de migração do /control)
 *   import type { LogtoNextConfig } from '@logto/next';
 *   export const logtoConfig: LogtoNextConfig = {
 *     endpoint: process.env.LOGTO_ENDPOINT!,
 *     appId: process.env.LOGTO_APP_ID!,
 *     appSecret: process.env.LOGTO_APP_SECRET!,
 *     baseUrl: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001',
 *     cookieSecret: process.env.LOGTO_COOKIE_SECRET!,
 *     cookieSecure: process.env.NODE_ENV === 'production',
 *   };
 *
 *   // Em um Server Action:
 *   import { requireUser } from '@noro/auth';
 *   import { logtoSessionAdapter } from '@noro/auth/adapters';
 *   import { logtoConfig } from '@/lib/logto';
 *   const userCtx = await requireUser({ db, sessionAdapter: logtoSessionAdapter(logtoConfig) });
 */
export function logtoSessionAdapter(config: LogtoNextConfig) {
  return (): Promise<LogtoSessionClaims | null> => readLogtoSession(config);
}

export type { LogtoNextConfig };
