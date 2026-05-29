import { getEnv, NORO_INFRA } from '@noro/config';

export type AuthProvider = 'logto';

export interface AuthRuntimeConfig {
  provider: AuthProvider;
  endpoint: string;
  appId?: string;
  hasAppSecret: boolean;
  hasCookieSecret: boolean;
}

export function getAuthRuntimeConfig(): AuthRuntimeConfig {
  return {
    provider: 'logto',
    endpoint: getEnv('LOGTO_ENDPOINT') || NORO_INFRA.authUrl,
    appId: getEnv('LOGTO_APP_ID'),
    hasAppSecret: Boolean(getEnv('LOGTO_APP_SECRET')),
    hasCookieSecret: Boolean(getEnv('LOGTO_COOKIE_SECRET')),
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
