// lib/logger/index.ts
/**
 * Logger Centralizado
 *
 * Sistema de logging estruturado com diferentes níveis
 * Em produção pode ser integrado com serviços como Sentry, Logtail, etc.
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  SECURITY = 'security',
}

interface LogMetadata {
  [key: string]: any;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  metadata?: LogMetadata;
  tenantId?: string;
  userId?: string;
  requestId?: string;
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
}

/**
 * Formata log entry para output
 */
function formatLogEntry(entry: LogEntry): string {
  const { timestamp, level, message, metadata, tenantId, userId, requestId, error } = entry;

  // Em desenvolvimento: formato legível
  if (process.env.NODE_ENV === 'development') {
    const levelEmoji: Record<LogLevel, string> = {
      [LogLevel.DEBUG]: '🔍',
      [LogLevel.INFO]: 'ℹ️',
      [LogLevel.WARN]: '⚠️',
      [LogLevel.ERROR]: '❌',
      [LogLevel.SECURITY]: '🔒',
    };

    let output = `${levelEmoji[level]} [${level.toUpperCase()}] ${message}`;

    if (tenantId) output += ` | tenant=${tenantId}`;
    if (userId) output += ` | user=${userId}`;
    if (requestId) output += ` | req=${requestId}`;

    if (metadata && Object.keys(metadata).length > 0) {
      output += `\n  Metadata: ${JSON.stringify(metadata, null, 2)}`;
    }

    if (error) {
      output += `\n  Error: ${error.message}`;
      if (error.stack) {
        output += `\n  Stack: ${error.stack}`;
      }
    }

    return output;
  }

  // Em produção: JSON estruturado (para parsing por ferramentas)
  return JSON.stringify(entry);
}

/**
 * Envia log para destino apropriado
 */
function sendLog(entry: LogEntry): void {
  const formatted = formatLogEntry(entry);

  // Console output
  switch (entry.level) {
    case LogLevel.DEBUG:
      console.debug(formatted);
      break;
    case LogLevel.INFO:
      console.info(formatted);
      break;
    case LogLevel.WARN:
      console.warn(formatted);
      break;
    case LogLevel.ERROR:
    case LogLevel.SECURITY:
      console.error(formatted);
      break;
  }

  // TODO: Em produção, enviar para serviço externo
  // if (process.env.NODE_ENV === 'production') {
  //   // Enviar para Sentry, Logtail, CloudWatch, etc
  // }

  // TODO: Para logs de segurança, sempre salvar no banco
  // if (entry.level === LogLevel.SECURITY) {
  //   saveSecurityLogToDatabase(entry);
  // }
}

/**
 * Contexto global do logger (pode ser setado por middleware)
 */
let globalContext: {
  tenantId?: string;
  userId?: string;
  requestId?: string;
} = {};

/**
 * Define contexto global para todos os logs subsequentes
 */
export function setLogContext(context: {
  tenantId?: string;
  userId?: string;
  requestId?: string;
}): void {
  globalContext = { ...globalContext, ...context };
}

/**
 * Limpa contexto global
 */
export function clearLogContext(): void {
  globalContext = {};
}

/**
 * Logger principal
 */
export const logger = {
  /**
   * Log de debug (apenas em desenvolvimento)
   */
  debug(message: string, metadata?: LogMetadata): void {
    if (process.env.NODE_ENV !== 'development') return;

    sendLog({
      timestamp: new Date().toISOString(),
      level: LogLevel.DEBUG,
      message,
      metadata,
      ...globalContext,
    });
  },

  /**
   * Log informativo
   */
  info(message: string, metadata?: LogMetadata): void {
    sendLog({
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      message,
      metadata,
      ...globalContext,
    });
  },

  /**
   * Log de aviso
   */
  warn(message: string, metadata?: LogMetadata): void {
    sendLog({
      timestamp: new Date().toISOString(),
      level: LogLevel.WARN,
      message,
      metadata,
      ...globalContext,
    });
  },

  /**
   * Log de erro
   */
  error(message: string, error?: Error | unknown, metadata?: LogMetadata): void {
    const errorInfo = error instanceof Error
      ? {
          message: error.message,
          stack: error.stack,
          code: (error as any).code,
        }
      : undefined;

    sendLog({
      timestamp: new Date().toISOString(),
      level: LogLevel.ERROR,
      message,
      error: errorInfo,
      metadata,
      ...globalContext,
    });
  },

  /**
   * Log de evento de segurança (sempre gravado)
   */
  security(
    action: string,
    metadata: LogMetadata & {
      userId?: string;
      tenantId?: string;
      ip?: string;
      userAgent?: string;
      blocked?: boolean;
      reason?: string;
    }
  ): void {
    sendLog({
      timestamp: new Date().toISOString(),
      level: LogLevel.SECURITY,
      message: `Security Event: ${action}`,
      metadata,
      ...globalContext,
    });
  },

  /**
   * Log de performance (tempo de execução)
   */
  performance(
    operation: string,
    durationMs: number,
    metadata?: LogMetadata
  ): void {
    logger.info(`Performance: ${operation}`, {
      ...metadata,
      durationMs,
      duration: `${durationMs}ms`,
    });
  },

  /**
   * Helper para medir tempo de execução
   */
  async measureTime<T>(
    operation: string,
    fn: () => Promise<T>,
    metadata?: LogMetadata
  ): Promise<T> {
    const start = Date.now();
    try {
      const result = await fn();
      const duration = Date.now() - start;
      logger.performance(operation, duration, metadata);
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      logger.error(`${operation} failed after ${duration}ms`, error as Error, metadata);
      throw error;
    }
  },
};

/**
 * Cria um logger com contexto específico
 * Útil para ter um logger por módulo/feature
 */
export function createLogger(context: {
  module?: string;
  feature?: string;
  [key: string]: any;
}) {
  return {
    debug: (message: string, metadata?: LogMetadata) =>
      logger.debug(message, { ...context, ...metadata }),
    info: (message: string, metadata?: LogMetadata) =>
      logger.info(message, { ...context, ...metadata }),
    warn: (message: string, metadata?: LogMetadata) =>
      logger.warn(message, { ...context, ...metadata }),
    error: (message: string, error?: Error | unknown, metadata?: LogMetadata) =>
      logger.error(message, error, { ...context, ...metadata }),
    security: (action: string, metadata?: LogMetadata) =>
      logger.security(action, { ...context, ...metadata } as any),
    performance: (operation: string, durationMs: number, metadata?: LogMetadata) =>
      logger.performance(operation, durationMs, { ...context, ...metadata }),
    measureTime: <T>(operation: string, fn: () => Promise<T>, metadata?: LogMetadata) =>
      logger.measureTime(operation, fn, { ...context, ...metadata }),
  };
}

/**
 * Export default
 */
export default logger;
