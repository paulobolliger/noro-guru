import { and, eq, or, isNull, desc, gt } from 'drizzle-orm';
import type { NoroDatabase } from '@noro/db';
import {
  exchangeRates,
  paymentConfigs,
  pricingRules,
  pricingLogs,
  integrationLogs,
} from '@noro/db';
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
  ProductCategory,
} from './types';
import {
  ExchangeRateNotFoundError,
  MarkupRuleNotFoundError,
  PaymentConfigNotFoundError,
} from './errors';

/**
 * Cria as dependências do Pricing Engine conectadas ao banco PostgreSQL via Drizzle.
 * 
 * @param db - Instância do banco Drizzle (NoroDatabase)
 */
export function createDrizzlePricingDeps(db: NoroDatabase): PricingDependencies {
  return {
    // ── CÂMBIO ─────────────────────────────────────────────────────────
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

      // Consulta no Drizzle: busca taxa ativa ordenada por tenant_id desc (específica do tenant primeiro) e data desc
      const rates = await db
        .select()
        .from(exchangeRates)
        .where(
          and(
            eq(exchangeRates.fromCurrency, from),
            eq(exchangeRates.toCurrency, to),
            eq(exchangeRates.isActive, true),
            or(eq(exchangeRates.tenantId, tenantId), isNull(exchangeRates.tenantId)),
            or(
              isNull(exchangeRates.validUntil),
              gt(exchangeRates.validUntil, new Date())
            )
          )
        )
        .orderBy(desc(exchangeRates.tenantId), desc(exchangeRates.validFrom))
        .limit(1);

      const data = rates[0];
      if (!data) {
        throw new ExchangeRateNotFoundError(from, to);
      }

      return {
        id: data.id,
        fromCurrency: data.fromCurrency,
        toCurrency: data.toCurrency,
        rate: Number(data.rate),
        spreadPct: Number(data.spreadPct),
        effectiveRate: Number(data.effectiveRate),
        source: data.source,
        validFrom: data.validFrom,
      };
    },

    // ── MARKUP & REGRAS COMERCIAIS ──────────────────────────────────────
    // Resolve regras a partir do modelo multi-row do Noro Guru
    getMarkupRule: async (tenantId: string, params: MarkupLookupParams): Promise<MarkupRule> => {
      // Busca todas as regras ativas que podem se aplicar a este tenant e categoria
      const rules = await db
        .select()
        .from(pricingRules)
        .where(
          and(
            eq(pricingRules.ativo, true),
            or(eq(pricingRules.tenantId, tenantId), isNull(pricingRules.tenantId)),
            or(eq(pricingRules.categoria, params.category ?? ''), isNull(pricingRules.categoria))
          )
        );

      if (!rules || rules.length === 0) {
        throw new MarkupRuleNotFoundError(params);
      }

      // Função auxiliar para resolver a melhor regra para um tipoRegra específico
      // Prioridade: Tenant com Categoria > Tenant Global > Plataforma com Categoria > Plataforma Global
      const resolveBestRuleValue = (
        tipo: 'markup_percentual' | 'markup_minimo_percentual' | 'taxa_cartao_percentual' | 'taxa_remessa_percentual' | 'taxa_fixa_cents'
      ): { val: number; ruleId?: string; name: string } | null => {
        const candidates = rules.filter((r) => r.tipoRegra === tipo);
        if (candidates.length === 0) return null;

        const scored = candidates.map((r) => {
          let score = 0;
          if (r.tenantId) score += 10; // Tenant rule
          if (r.categoria) score += 5; // Specific category rule
          return { rule: r, score };
        });

        // Ordena por maior pontuação (mais específica) e prioridade cadastrada
        scored.sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return (b.rule.prioridade ?? 0) - (a.rule.prioridade ?? 0);
        });

        const best = scored[0].rule;
        return {
          val: Number(best.valor),
          ruleId: best.id,
          name: best.nome,
        };
      };

      // Resoluções específicas
      const markupRes = resolveBestRuleValue('markup_percentual');
      const markupMinRes = resolveBestRuleValue('markup_minimo_percentual');
      const cardFeeRes = resolveBestRuleValue('taxa_cartao_percentual');
      const remessaRes = resolveBestRuleValue('taxa_remessa_percentual');
      const fixedFeeRes = resolveBestRuleValue('taxa_fixa_cents');

      // Valores padrões se as regras não forem encontradas
      const markupPercentage = markupRes?.val ?? 0.12; // 12% padrão
      const markupMinPercentage = markupMinRes?.val ?? 0.05; // 5% padrão
      const operationalCostFixed = fixedFeeRes ? fixedFeeRes.val / 100 : 0.0; // Converte centavos para reais BRL
      
      // Custos operacionais percentuais somam taxas de cartão e remessa se houver
      const cardFee = cardFeeRes?.val ?? 0;
      const remessaFee = remessaRes?.val ?? 0;
      const operationalCostPercentage = cardFee + remessaFee;

      return {
        id: markupRes?.ruleId ?? markupMinRes?.ruleId ?? undefined,
        scope: markupRes?.ruleId ? 'category' : 'global', // Atribuição genérica de escopo
        name: markupRes?.name ?? 'Regras de Precificação Resolvidas',
        markupPercentage,
        markupMinPercentage,
        operationalCostFixed,
        operationalCostPercentage,
        priority: 0,
      };
    },

    // ── PAGAMENTO ──────────────────────────────────────────────────────
    getPaymentConfig: async (tenantId: string, params: PaymentLookupParams): Promise<PaymentConfig> => {
      const configs = await db
        .select()
        .from(paymentConfigs)
        .where(
          and(
            eq(paymentConfigs.acquirer, params.acquirer),
            eq(paymentConfigs.paymentMethod, params.paymentMethod),
            eq(paymentConfigs.installments, params.installments),
            eq(paymentConfigs.isActive, true),
            or(eq(paymentConfigs.tenantId, tenantId), isNull(paymentConfigs.tenantId)),
            or(
              isNull(paymentConfigs.validUntil),
              gt(paymentConfigs.validUntil, new Date())
            )
          )
        )
        .orderBy(desc(paymentConfigs.tenantId), desc(paymentConfigs.validFrom))
        .limit(1);

      const data = configs[0];
      if (!data) {
        throw new PaymentConfigNotFoundError(params.acquirer, params.paymentMethod, params.installments);
      }

      return {
        id: data.id,
        acquirer: data.acquirer as any,
        paymentMethod: data.paymentMethod as any,
        installments: data.installments,
        mdrRate: Number(data.mdrRate),
        maxAbsorbedInstallments: data.maxAbsorbedInstallments,
        monthlyInterestRate: Number(data.monthlyInterestRate),
      };
    },

    // ── LOG (AUDITORIA) ────────────────────────────────────────────────
    logResult: async (input: PricingInput, result: PricingResult): Promise<void> => {
      try {
        await db.insert(pricingLogs).values({
          tenantId: input.tenantId,
          productId: input.productId ?? null,
          supplierId: input.supplierId ?? null,
          channel: input.channel ?? 'admin',
          createdById: input.createdById ?? null,
          
          netPriceOriginal: String(result.netPriceOriginal),
          netCurrency: result.netCurrency,
          exchangeRateId: result.exchangeRateId ?? null,
          exchangeRate: String(result.exchangeRate),
          netPriceBRL: String(result.netPriceBRL),
          
          markupRuleId: result.markupRuleId ?? null,
          markupPercentage: String(result.markupRate),
          markupAmount: String(result.markupAmount),
          operationalCost: String(result.operationalCostTotal),
          
          paymentInstallments: result.installments,
          paymentMethod: result.paymentMethod,
          acquirer: result.acquirer,
          mdrRate: String(result.mdrRate),
          paymentFeeAmount: String(result.paymentFeeAmount),
          interestRepasse: String(result.interestRepasse),
          
          grossPrice: String(result.grossPrice),
          finalPrice: String(result.finalPrice),
          installmentValue: String(result.installmentValue),
          
          netMargin: String(result.netMargin),
          marginPercentage: String(result.marginPercentage),
          isMarginPositive: result.isMarginPositive,
        });
      } catch (err: any) {
        // Silencia erro de log para não quebrar a transação principal
        console.error('[pricing_log_error] Falha ao registrar auditoria:', err?.message || err);
      }
    },
  };
}
