import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';

function requireEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(
      `[apps/core] Variável de ambiente obrigatória ausente: ${name}. ` +
        'Verifique .env.local antes de usar o fluxo Keycloak OIDC.',
    );
  }
  return value;
}

const DEFAULT_BASE_URL = 'http://localhost:3004';
const COOKIE_VERSION = 'v1';

export function getKeycloakConfig() {
  const issuer = requireEnv(
    'KEYCLOAK_ISSUER',
    'https://keycloak.norotec.cloud/realms/noro',
  ).replace(/\/$/, '');

  const baseUrl =
    process.env.KEYCLOAK_BASE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    DEFAULT_BASE_URL;

  return {
    issuer,
    baseUrl,
    clientId: requireEnv('KEYCLOAK_CLIENT_ID', 'noro-guru-core'),
    clientSecret: requireEnv('KEYCLOAK_CLIENT_SECRET', 'noro-guru-core-secret'),
    cookieSecret: requireEnv(
      'KEYCLOAK_COOKIE_SECRET',
      'noro-guru-core-keycloak-cookie-secret-32bytes!',
    ),
    authorizationEndpoint: `${issuer}/protocol/openid-connect/auth`,
    tokenEndpoint: `${issuer}/protocol/openid-connect/token`,
    endSessionEndpoint: `${issuer}/protocol/openid-connect/logout`,
    jwksUri: `${issuer}/protocol/openid-connect/certs`,
  };
}

function keyFromSecret(secret: string): Buffer {
  if (secret.length < 32) {
    throw new Error('KEYCLOAK_COOKIE_SECRET deve conter pelo menos 32 caracteres');
  }
  return createHash('sha256').update(secret).digest();
}

export function sealCookie(value: object, secret: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', keyFromSecret(secret), iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(value), 'utf8'),
    cipher.final(),
  ]);

  return [COOKIE_VERSION, iv, cipher.getAuthTag(), encrypted]
    .map((part) => (typeof part === 'string' ? part : part.toString('base64url')))
    .join('.');
}

export function unsealCookie<T>(value: string, secret: string): T | null {
  try {
    const [version, encodedIv, encodedTag, encodedPayload] = value.split('.');
    if (version !== COOKIE_VERSION || !encodedIv || !encodedTag || !encodedPayload) {
      return null;
    }
    const decipher = createDecipheriv(
      'aes-256-gcm',
      keyFromSecret(secret),
      Buffer.from(encodedIv, 'base64url'),
    );
    decipher.setAuthTag(Buffer.from(encodedTag, 'base64url'));
    return JSON.parse(
      Buffer.concat([
        decipher.update(Buffer.from(encodedPayload, 'base64url')),
        decipher.final(),
      ]).toString('utf8'),
    ) as T;
  } catch {
    return null;
  }
}
