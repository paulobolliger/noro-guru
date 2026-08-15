// ═══════════════════════════════════════════════════════════════════════════
// in-memory-deps.ts — Implementação in-memory das dependências do engine
// ═══════════════════════════════════════════════════════════════════════════

import type {
  PricingDependencies,
  ExchangeRate,
  MarkupRule,
  PaymentConfig,
  Currency,
  MarkupLookupParams,
  PaymentLookupParams,
  PricingInput,
  PricingResult,
} from './types';
import { ExchangeRateNotFoundError, PaymentConfigNotFoundError, MarkupRuleNotFoundError } from './errors';
import {
  buildDefaultExchangeRate,
  resolveMarkupFromMemory,
  lookupPaymentConfig,
} from './defaults';

export interface InMemoryDepsOptions {
  /** Taxa de câmbio customizada (ex: USD → BRL: 5.92) */
  exchangeRates?: Partial<Record<string, number>>;
  /** Regras de markup adicionais ou substitutas */
  markupRules?: MarkupRule[];
  /** Configs de pagamento adicionais */
  paymentConfigs?: PaymentConfig[];
}

/**
 * Cria dependências in-memory para uso em testes e simulações.
 */
export function createInMemoryDeps(options: InMemoryDepsOptions = {}): PricingDependencies {
  return {
    getExchangeRate: async (tenantId: string, from: Currency, to: Currency): Promise<ExchangeRate> => {
      if (from === to) {
        return {
          fromCurrency: from,
          toCurrency: to,
          rate: 1.0,
          spreadPct: 0.0,
          effectiveRate: 1.0,
          source: 'identity',
          validFrom: new Date(),
        };
      }

      const overrideRate = options.exchangeRates?.[from];
      if (overrideRate !== undefined) {
        return {
          id: `custom-${from}-${to}`,
          fromCurrency: from,
          toCurrency: to,
          rate: overrideRate,
          spreadPct: 0.015,
          effectiveRate: overrideRate * 1.015,
          source: 'override',
          validFrom: new Date(),
        };
      }

      const rate = buildDefaultExchangeRate(from, to);
      if (!rate) throw new ExchangeRateNotFoundError(from, to);
      return rate;
    },

    getMarkupRule: async (tenantId: string, params: MarkupLookupParams): Promise<MarkupRule> => {
      try {
        return resolveMarkupFromMemory({
          ...params,
          rules: options.markupRules,
        });
      } catch {
        throw new MarkupRuleNotFoundError(params);
      }
    },

    getPaymentConfig: async (tenantId: string, params: PaymentLookupParams): Promise<PaymentConfig> => {
      if (options.paymentConfigs) {
        const custom = options.paymentConfigs.find(
          (c) =>
            c.acquirer === params.acquirer &&
            c.paymentMethod === params.paymentMethod &&
            c.installments === params.installments
        );
        if (custom) return custom;
      }

      const config = lookupPaymentConfig(params.acquirer, params.paymentMethod, params.installments);
      if (!config) throw new PaymentConfigNotFoundError(params.acquirer, params.paymentMethod, params.installments);
      return config;
    },

    logResult: async (input: PricingInput, result: PricingResult): Promise<void> => {
      // Apenas exibe no console para fins de debug e simulação in-memory
      console.log(`[pricing_in_memory_log] Log salvo com sucesso para o tenant: ${input.tenantId}`);
    },
  };
}
