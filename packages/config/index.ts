type RequiredRuntimeEnv =
  | 'DATABASE_URL'
  | 'LOGTO_ENDPOINT'
  | 'LOGTO_APP_ID'
  | 'LOGTO_APP_SECRET'
  | 'LOGTO_COOKIE_SECRET';

export const NORO_DATABASE = {
  host: '45.32.169.173',
  port: 5432,
  database: 'noro_guru_db',
  user: 'noro_master',
} as const;

export const NORO_INFRA = {
  domain: 'norotec.cloud',
  authUrl: 'https://auth.norotec.cloud',
  authAdminUrl: 'https://auth-admin.norotec.cloud',
} as const;

export function getEnv(name: string): string | undefined {
  return process.env[name];
}

export function requireEnv(name: RequiredRuntimeEnv): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required runtime environment variable: ${name}`);
  }

  return value;
}

export function getDatabaseUrl(): string {
  return requireEnv('DATABASE_URL');
}
