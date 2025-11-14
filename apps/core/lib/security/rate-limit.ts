// lib/security/rate-limit.ts
/**
 * Rate Limiting Middleware
 *
 * Implementa rate limiting para proteger APIs contra abuse
 * Em desenvolvimento usa memória, em produção deve usar Redis
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Configuração de rate limit
 */
interface RateLimitConfig {
  /** Número máximo de requisições */
  maxRequests: number;
  /** Janela de tempo em segundos */
  windowSeconds: number;
  /** Mensagem de erro customizada */
  message?: string;
}

/**
 * Storage em memória para rate limiting
 * NOTA: Em produção, substituir por Redis
 */
class MemoryStore {
  private store: Map<string, { count: number; resetAt: number }> = new Map();

  get(key: string): { count: number; resetAt: number } | undefined {
    const data = this.store.get(key);

    // Limpar se expirado
    if (data && Date.now() > data.resetAt) {
      this.store.delete(key);
      return undefined;
    }

    return data;
  }

  set(key: string, count: number, resetAt: number): void {
    this.store.set(key, { count, resetAt });
  }

  // Limpar entradas expiradas periodicamente
  cleanup(): void {
    const now = Date.now();
    for (const [key, data] of this.store.entries()) {
      if (now > data.resetAt) {
        this.store.delete(key);
      }
    }
  }
}

// Instância global do store
const store = new MemoryStore();

// Cleanup a cada 5 minutos
setInterval(() => store.cleanup(), 5 * 60 * 1000);

/**
 * Extrai identificador único da requisição
 * Usa IP ou tenant_id + user_id
 */
function getIdentifier(request: NextRequest): string {
  // Tentar obter tenant_id e user_id dos headers
  const tenantId = request.headers.get('x-tenant-id');
  const userId = request.headers.get('x-user-id');

  if (tenantId && userId) {
    return `${tenantId}:${userId}`;
  }

  // Fallback para IP
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown';

  return `ip:${ip}`;
}

/**
 * Middleware de rate limiting
 *
 * @example
 * // Em uma API route:
 * export async function POST(request: NextRequest) {
 *   const rateLimitResult = await rateLimit(request, {
 *     maxRequests: 10,
 *     windowSeconds: 60
 *   });
 *
 *   if (!rateLimitResult.success) {
 *     return rateLimitResult.response;
 *   }
 *
 *   // Continuar processamento...
 * }
 */
export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig
): Promise<{
  success: boolean;
  response?: NextResponse;
  remaining?: number;
  resetAt?: Date;
}> {
  const { maxRequests, windowSeconds, message } = config;

  // Gerar chave única para este endpoint + usuário
  const endpoint = new URL(request.url).pathname;
  const identifier = getIdentifier(request);
  const key = `${endpoint}:${identifier}`;

  // Obter dados atuais
  const now = Date.now();
  const data = store.get(key);

  if (!data) {
    // Primeira requisição nesta janela
    const resetAt = now + windowSeconds * 1000;
    store.set(key, 1, resetAt);

    return {
      success: true,
      remaining: maxRequests - 1,
      resetAt: new Date(resetAt),
    };
  }

  // Verificar se excedeu o limite
  if (data.count >= maxRequests) {
    const resetAt = new Date(data.resetAt);
    const retryAfter = Math.ceil((data.resetAt - now) / 1000);

    return {
      success: false,
      response: NextResponse.json(
        {
          error: message || 'Muitas requisições. Tente novamente mais tarde.',
          retryAfter,
          resetAt: resetAt.toISOString(),
        },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': resetAt.toISOString(),
          },
        }
      ),
    };
  }

  // Incrementar contador
  store.set(key, data.count + 1, data.resetAt);

  return {
    success: true,
    remaining: maxRequests - (data.count + 1),
    resetAt: new Date(data.resetAt),
  };
}

/**
 * Presets de rate limit para diferentes casos de uso
 */
export const RateLimitPresets = {
  /** Rate limit estrito para autenticação e operações sensíveis */
  STRICT: {
    maxRequests: 5,
    windowSeconds: 60, // 5 req/min
    message: 'Muitas tentativas. Aguarde 1 minuto.',
  },

  /** Rate limit moderado para APIs gerais */
  MODERATE: {
    maxRequests: 30,
    windowSeconds: 60, // 30 req/min
    message: 'Limite de requisições atingido. Tente novamente em breve.',
  },

  /** Rate limit leve para operações de leitura */
  RELAXED: {
    maxRequests: 100,
    windowSeconds: 60, // 100 req/min
    message: 'Limite de requisições atingido.',
  },

  /** Rate limit para uploads */
  UPLOAD: {
    maxRequests: 10,
    windowSeconds: 300, // 10 req/5min
    message: 'Muitos uploads. Aguarde alguns minutos.',
  },

  /** Rate limit para geração de conteúdo com IA */
  AI_GENERATION: {
    maxRequests: 20,
    windowSeconds: 3600, // 20 req/hora
    message: 'Limite de gerações com IA atingido. Aguarde 1 hora.',
  },
};

/**
 * Decorator/Helper para aplicar rate limit facilmente
 *
 * @example
 * export async function POST(request: NextRequest) {
 *   return withRateLimit(request, RateLimitPresets.STRICT, async () => {
 *     // Sua lógica aqui
 *     return NextResponse.json({ success: true });
 *   });
 * }
 */
export async function withRateLimit(
  request: NextRequest,
  config: RateLimitConfig,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  const result = await rateLimit(request, config);

  if (!result.success && result.response) {
    return result.response;
  }

  // Adicionar headers de rate limit na resposta
  const response = await handler();

  if (result.remaining !== undefined && result.resetAt) {
    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', result.resetAt.toISOString());
  }

  return response;
}
