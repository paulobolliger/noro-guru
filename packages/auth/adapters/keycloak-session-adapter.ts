/**
 * Adapter de sessão Keycloak OIDC para Next.js (App Router / Server Actions).
 *
 * Suporta o fluxo OIDC PKCE e leitura de sessão selada via cookie AES-256-GCM,
 * compatível com o padrão de autenticação do ecossistema Norotec.
 *
 * Uso em Server Components ou Server Actions:
 *   import { keycloakSessionAdapter } from '@noro/auth/adapters';
 *   const userCtx = await requireUser({ db, sessionAdapter: keycloakSessionAdapter(sessionGetter) });
 */

export type KeycloakSessionClaims = {
  /** Discriminador do provedor — sempre "keycloak" neste adapter. */
  provider: 'keycloak';
  /** Subject do Keycloak (`sub` do token JWT). Mapeado para `identity_links.provider_subject` no banco. */
  providerSubject: string;
  /** Alias de providerSubject — satisfaz AuthClaims.subject exigido por requireUser(). */
  subject: string;
  /** E-mail primário do usuário. */
  email?: string | null;
  /** Nome de exibição do usuário. */
  name?: string | null;
  /** URL do avatar/foto. */
  picture?: string | null;
  /** Payload completo dos claims retornados pelo token OIDC. */
  rawClaims?: Record<string, unknown>;
};

export interface KeycloakSessionData {
  claims?: {
    sub?: string;
    email?: string;
    name?: string;
    preferred_username?: string;
    picture?: string;
    [key: string]: unknown;
  };
  expiresAt?: number;
  [key: string]: unknown;
}

export type KeycloakSessionGetter = () => Promise<KeycloakSessionData | null> | KeycloakSessionData | null;

export class KeycloakSessionUnauthenticatedError extends Error {
  constructor() {
    super('KeycloakSessionAdapter: sessão Keycloak não encontrada ou expirada.');
    this.name = 'KeycloakSessionUnauthenticatedError';
  }
}

/**
 * Lê os claims da sessão Keycloak.
 */
export async function readKeycloakSession(
  sessionGetter: KeycloakSessionGetter,
): Promise<KeycloakSessionClaims | null> {
  const session = await sessionGetter();

  if (!session || !session.claims || !session.claims.sub) {
    return null;
  }

  // Verificar expiração se declarada em segundos Unix
  if (session.expiresAt && session.expiresAt <= Math.floor(Date.now() / 1000)) {
    return null;
  }

  const sub = session.claims.sub;
  const email = session.claims.email ?? null;
  const name = session.claims.name ?? session.claims.preferred_username ?? null;
  const picture = session.claims.picture ?? null;

  return {
    provider: 'keycloak',
    providerSubject: sub,
    subject: sub,
    email,
    name,
    picture,
    rawClaims: session.claims,
  };
}

/**
 * Cria um `AuthSessionAdapter` para ser passado a `requireUser()` ou `getCurrentUser()`.
 */
export function keycloakSessionAdapter(sessionGetter: KeycloakSessionGetter) {
  return (): Promise<KeycloakSessionClaims | null> => readKeycloakSession(sessionGetter);
}
