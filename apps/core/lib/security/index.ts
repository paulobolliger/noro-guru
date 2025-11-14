// lib/security/index.ts
/**
 * Módulo de Segurança
 *
 * Exporta funções de rate limiting, sanitização e segurança
 */

// Rate Limiting
export {
  rateLimit,
  withRateLimit,
  RateLimitPresets,
} from './rate-limit';

// Sanitização
export {
  sanitizeText,
  escapeHtml,
  sanitizeEmail,
  sanitizeUrl,
  sanitizeFilename,
  sanitizeJson,
  removeSensitiveFields,
  sanitizePhone,
  sanitizeSqlString,
  truncateString,
  deepSanitize,
} from './sanitize';
