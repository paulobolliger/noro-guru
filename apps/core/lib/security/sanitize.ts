// lib/security/sanitize.ts
/**
 * Funções de sanitização para prevenir XSS e injeção de código
 */

/**
 * Sanitiza string removendo tags HTML e scripts
 * Útil para inputs de texto que não devem conter HTML
 */
export function sanitizeText(input: string): string {
  if (typeof input !== 'string') return '';

  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove <script>
    .replace(/<[^>]+>/g, '') // Remove todas as tags HTML
    .trim();
}

/**
 * Escapa caracteres HTML especiais
 * Útil quando precisamos exibir o conteúdo mas não executá-lo
 */
export function escapeHtml(input: string): string {
  if (typeof input !== 'string') return '';

  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return input.replace(/[&<>"'/]/g, (char) => map[char]);
}

/**
 * Sanitiza email removendo caracteres perigosos
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') return '';

  return email
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9@._+-]/g, '');
}

/**
 * Sanitiza URL removendo protocolos perigosos
 */
export function sanitizeUrl(url: string): string {
  if (typeof url !== 'string') return '';

  const trimmed = url.trim();

  // Bloquear protocolos perigosos
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];

  for (const protocol of dangerousProtocols) {
    if (trimmed.toLowerCase().startsWith(protocol)) {
      return '';
    }
  }

  return trimmed;
}

/**
 * Sanitiza filename removendo caracteres perigosos
 */
export function sanitizeFilename(filename: string): string {
  if (typeof filename !== 'string') return '';

  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Substituir caracteres especiais por _
    .replace(/\.{2,}/g, '.') // Prevenir ../ path traversal
    .replace(/^\./, '') // Remover ponto inicial
    .substring(0, 255); // Limitar tamanho
}

/**
 * Sanitiza JSON removendo propriedades perigosas
 */
export function sanitizeJson<T>(obj: T, allowedKeys: string[]): Partial<T> {
  if (typeof obj !== 'object' || obj === null) {
    return {};
  }

  const sanitized: any = {};

  for (const key of allowedKeys) {
    if (key in obj) {
      sanitized[key] = (obj as any)[key];
    }
  }

  return sanitized as Partial<T>;
}

/**
 * Remove propriedades sensíveis de objetos antes de logar/retornar
 */
export function removeSensitiveFields<T extends Record<string, any>>(
  obj: T,
  sensitiveFields: string[] = ['password', 'token', 'secret', 'apiKey', 'privateKey']
): T {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  const cleaned = { ...obj };

  for (const field of sensitiveFields) {
    if (field in cleaned) {
      cleaned[field] = '[REDACTED]';
    }
  }

  return cleaned;
}

/**
 * Valida e sanitiza número de telefone
 */
export function sanitizePhone(phone: string): string {
  if (typeof phone !== 'string') return '';

  // Remove tudo exceto números, +, (, ), espaço e -
  return phone.replace(/[^\d+() -]/g, '').trim();
}

/**
 * Valida SQL input básico (não substitui prepared statements!)
 */
export function sanitizeSqlString(input: string): string {
  if (typeof input !== 'string') return '';

  // Escapa aspas simples e remove caracteres perigosos
  return input
    .replace(/'/g, "''") // Escapa aspas simples
    .replace(/;/g, '') // Remove ponto e vírgula
    .replace(/--/g, '') // Remove comentários SQL
    .replace(/\/\*/g, '') // Remove comentários multiline
    .replace(/\*\//g, '');
}

/**
 * Limita tamanho de string
 */
export function truncateString(str: string, maxLength: number): string {
  if (typeof str !== 'string') return '';
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength);
}

/**
 * Sanitiza objeto recursivamente
 */
export function deepSanitize(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeText(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepSanitize(item));
  }

  if (typeof obj === 'object' && obj !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = deepSanitize(value);
    }
    return sanitized;
  }

  return obj;
}
