import { cookies } from 'next/headers';
import { unsealCookie, getKeycloakConfig } from '@/lib/keycloak';
import type { KeycloakSessionData } from '@noro/auth';

/**
 * Lê e descriptografa o cookie de sessão do Keycloak (`keycloak_session`).
 */
export async function getServerSession(): Promise<KeycloakSessionData | null> {
  const cookieStore = cookies();
  const raw = cookieStore.get('keycloak_session')?.value;
  if (!raw) return null;
  const config = getKeycloakConfig();
  return unsealCookie<KeycloakSessionData>(raw, config.cookieSecret);
}

/**
 * Retorna os claims OIDC da sessão atual ou null se não autenticado.
 */
export async function getSessionClaims() {
  const session = await getServerSession();
  return session?.claims ?? null;
}

/**
 * Helper de compatibilidade para obter informações básicas do usuário autenticado no Keycloak.
 */
export async function getSessionUser() {
  const claims = await getSessionClaims();
  if (!claims?.sub) return null;
  return {
    id: claims.sub as string,
    email: (claims.email as string) || '',
    name: ((claims.name as string) ?? (claims.preferred_username as string) ?? (claims.email as string)) || '',
    claims,
  };
}
