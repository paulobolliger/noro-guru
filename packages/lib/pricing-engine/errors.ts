// ═══════════════════════════════════════════════════════════════════════════
// errors.ts — Erros tipados do Pricing Engine
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Margem líquida abaixo do mínimo configurado — venda BLOQUEADA.
 *
 * Lançado por:
 *   - calculatePrice: quando netMargin < minimumRequiredMargin (regra de markup)
 *   - calculatePackagePrice: quando totalNetMargin < 0 sem allowNegativeMarginOverride
 *
 * Para desbloquear em calculatePackagePrice: passe options.allowNegativeMarginOverride = true
 * (uso exclusivo: canal admin com override explícito confirmado).
 */
export class NegativeMarginError extends Error {
  readonly code = 'NEGATIVE_MARGIN';
  constructor(
    public readonly details: {
      netMargin: number;
      minimumRequired: number;
      finalPrice: number;
      netPriceBRL: number;
      markupRate: number;
      /** 'item' = erro num produto individual; 'package' = margem total do pacote < 0 */
      context?: 'item' | 'package';
    }
  ) {
    const ctx = details.context === 'package' ? 'pacote' : 'produto';
    super(
      `[${ctx.toUpperCase()}] Margem líquida insuficiente: R$ ${details.netMargin.toFixed(2)} ` +
      `(mínimo exigido: R$ ${details.minimumRequired.toFixed(2)}). ` +
      `Aumente o markup ou revise o custo do fornecedor.`
    );
    this.name = 'NegativeMarginError';
  }
}

/** Taxa de câmbio não encontrada para o par de moedas solicitado */
export class ExchangeRateNotFoundError extends Error {
  readonly code = 'EXCHANGE_RATE_NOT_FOUND';
  constructor(fromCurrency: string, toCurrency: string) {
    super(
      `Taxa de câmbio não encontrada para ${fromCurrency} → ${toCurrency}. ` +
      `Cadastre uma taxa ativa no painel de câmbio.`
    );
    this.name = 'ExchangeRateNotFoundError';
  }
}

/** Nenhuma regra de markup encontrada (nem mesmo a global) */
export class MarkupRuleNotFoundError extends Error {
  readonly code = 'MARKUP_RULE_NOT_FOUND';
  constructor(params: { productId?: string; supplierId?: string; category?: string }) {
    super(
      `Nenhuma regra de markup encontrada para: ` +
      `produto=${params.productId ?? '-'}, ` +
      `fornecedor=${params.supplierId ?? '-'}, ` +
      `categoria=${params.category ?? '-'}. ` +
      `Cadastre ao menos uma regra global.`
    );
    this.name = 'MarkupRuleNotFoundError';
  }
}

/** Configuração de pagamento não encontrada para o método/parcelas solicitados */
export class PaymentConfigNotFoundError extends Error {
  readonly code = 'PAYMENT_CONFIG_NOT_FOUND';
  constructor(acquirer: string, method: string, installments: number) {
    super(
      `Configuração MDR não encontrada: ${acquirer}/${method}/${installments}x. ` +
      `Verifique a tabela payment_configs.`
    );
    this.name = 'PaymentConfigNotFoundError';
  }
}

/** Input inválido passado ao engine */
export class InvalidPricingInputError extends Error {
  readonly code = 'INVALID_INPUT';
  constructor(message: string) {
    super(`Input inválido: ${message}`);
    this.name = 'InvalidPricingInputError';
  }
}
