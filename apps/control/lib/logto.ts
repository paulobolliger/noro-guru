import type { LogtoNextConfig } from '@logto/next';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `[apps/control] Variável de ambiente obrigatória ausente: ${name}. ` +
        'Verifique .env.local antes de usar o fluxo Logto.',
    );
  }
  return value;
}

/**
 * Configuração do SDK Logto para apps/control.
 *
 * baseUrl: URL raiz do apps/control (não a URL do servidor Logto).
 *   - Produção: NEXT_PUBLIC_APP_URL (https://admin.noro.guru)
 *   - Dev local: http://localhost:3001 (fallback seguro)
 *
 * Variáveis obrigatórias em .env.local:
 *   LOGTO_ENDPOINT, LOGTO_APP_ID, LOGTO_APP_SECRET, LOGTO_COOKIE_SECRET
 *
 * LOGTO_APP_SECRET nunca deve ser exposto em variável NEXT_PUBLIC_*.
 */
export const logtoConfig: LogtoNextConfig = {
  endpoint: requireEnv('LOGTO_ENDPOINT'),
  appId: requireEnv('LOGTO_APP_ID'),
  appSecret: requireEnv('LOGTO_APP_SECRET'),
  cookieSecret: requireEnv('LOGTO_COOKIE_SECRET'),
  baseUrl: process.env.LOGTO_BASE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001',
  cookieSecure: process.env.NODE_ENV === 'production',
};
