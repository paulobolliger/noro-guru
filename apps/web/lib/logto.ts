import type { LogtoNextConfig } from '@logto/next';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `[apps/web] Variável de ambiente obrigatória ausente: ${name}. ` +
        'Verifique .env.local antes de usar o fluxo Logto.',
    );
  }
  return value;
}

export const logtoConfig: LogtoNextConfig = {
  endpoint: requireEnv('LOGTO_ENDPOINT'),
  appId: requireEnv('LOGTO_APP_ID'),
  appSecret: requireEnv('LOGTO_APP_SECRET'),
  cookieSecret: requireEnv('LOGTO_COOKIE_SECRET'),
  baseUrl: process.env.LOGTO_BASE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  cookieSecure: process.env.NODE_ENV === 'production',
};
