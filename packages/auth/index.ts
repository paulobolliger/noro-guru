import { getEnv, NORO_INFRA } from '@noro/config';

import type { AuthProvider } from './types';

export interface AuthRuntimeConfig {
  provider: AuthProvider;
  endpoint: string;
  appId?: string;
  hasAppSecret: boolean;
  hasCookieSecret: boolean;
}

export function getAuthRuntimeConfig(): AuthRuntimeConfig {
  const provider = (getEnv('AUTH_PROVIDER') as AuthProvider) || 'keycloak';
  const isKeycloak = provider === 'keycloak';
  const endpoint = isKeycloak
    ? getEnv('KEYCLOAK_ISSUER') || 'https://keycloak.norotec.cloud/realms/noro'
    : getEnv('LOGTO_ENDPOINT') || NORO_INFRA.authUrl;
  const appId = isKeycloak ? getEnv('KEYCLOAK_CLIENT_ID') : getEnv('LOGTO_APP_ID');

  return {
    provider,
    endpoint,
    appId,
    hasAppSecret: Boolean(isKeycloak ? getEnv('KEYCLOAK_CLIENT_SECRET') : getEnv('LOGTO_APP_SECRET')),
    hasCookieSecret: Boolean(isKeycloak ? getEnv('KEYCLOAK_COOKIE_SECRET') : getEnv('LOGTO_COOKIE_SECRET')),
  };
}

export * from './types';
export * from './errors';
export * from './context/user-context';
export * from './context/tenant-context';
export * from './context/platform-context';
export * from './context/module-context';
export * from './context/site-tenant-context';
export * from './context/authorization';
export * from './adapters';
