// ═══════════════════════════════════════════════════════════════════════════
// NORO GURU — PRICING ENGINE
// types.ts — Definições centrais de tipos para precificação
// ═══════════════════════════════════════════════════════════════════════════

export type Currency = 'BRL' | 'USD' | 'EUR' | 'GBP' | 'ARS';

export type ProductCategory =
  | 'flight'
  | 'hotel'
  | 'transfer'
  | 'ticket'
  | 'insurance'
  | 'tour'
  | 'car_rental'
  | 'visa'
  | 'other';

export type PaymentMethod =
  | 'credit_visa'
  | 'credit_master'
  | 'credit_elo'
  | 'credit_amex'
  | 'debit'
  | 'pix'
  | 'boleto';

export type Acquirer = 'asaas' | 'rede' | 'stripe' | 'cielo';

export type MarginStatus = 'ok' | 'warning';

/** Limiar de warning de margem: abaixo disso o engine sinaliza atenção (não bloqueia) */
export const MARGIN_WARNING_THRESHOLD_PCT = 0.04; // 4%

// ─── Input ────────────────────────────────────────────────────────────────

export interface PricingInput {
  tenantId: string;
  /** Preço NET do fornecedor (custo real — nunca exposto ao cliente) */
  netPrice: number;
  /** Moeda em que o fornecedor cobra */
  netCurrency: Currency;
  /** Categoria do produto (define qual regra de markup aplicar) */
  category: ProductCategory;
  /** ID interno do fornecedor (suppliers.id) */
  supplierId?: string;
  /** ID interno do produto (products.id) */
  productId?: string;
  /** Número de parcelas (1–21) */
  installments?: number;
  /** Método de pagamento */
  paymentMethod?: PaymentMethod;
  /** Adquirente */
  acquirer?: Acquirer;
  /** Override manual de markup (ignora regra do banco) */
  overrideMarkupRate?: number;
  /** Override manual de câmbio (ignora taxa do banco) */
  overrideExchangeRate?: number;
  /** Canal de vendas */
  channel?: 'admin' | 'portal_traveler' | 'api';
  /** ID do usuário que gerou a cotação */
  createdById?: string;
}

// ─── Opções de pacote ─────────────────────────────────────────────────────

export interface PackageOptions {
  /**
   * Permite margem total negativa no pacote.
   * USO EXCLUSIVO: canal admin + override explícito confirmado pelo usuário.
   * Default: false — engine bloqueia com NegativeMarginError por padrão.
   */
  allowNegativeMarginOverride?: boolean;
  /**
   * Threshold de warning (default: MARGIN_WARNING_THRESHOLD_PCT = 4%).
   * Abaixo deste percentual o engine retorna marginStatus = 'warning'.
   */
  marginWarningThresholdPct?: number;
}

// ─── Dados intermediários ─────────────────────────────────────────────────

export interface ExchangeRate {
  id?: string;
  fromCurrency: string;
  toCurrency: string;
  /** Taxa de mercado pura */
  rate: number;
  /** Spread comercial (ex: 0.015 = 1.5%) */
  spreadPct: number;
  /** Taxa efetiva = rate × (1 + spreadPct) — o que de fato se usa */
  effectiveRate: number;
  source: string;
  validFrom: Date;
}

export interface MarkupRule {
  id?: string;
  scope: 'global' | 'category' | 'supplier' | 'product';
  scopeId?: string;
  category?: string;
  name: string;
  /** Percentual de markup (ex: 0.12 = 12%) */
  markupPercentage: number;
  /** Markup mínimo obrigatório (ex: 0.05 = 5%) */
  markupMinPercentage: number;
  /** Custo operacional fixo em BRL por item */
  operationalCostFixed: number;
  /** Custo operacional percentual sobre NET_BRL */
  operationalCostPercentage: number;
  priority: number;
}

export interface PaymentConfig {
  id?: string;
  acquirer: Acquirer;
  paymentMethod: PaymentMethod;
  installments: number;
  /** MDR real (ex: 0.10450 = 10.45%) */
  mdrRate: number;
  /** Até quantas parcelas a agência absorve o MDR */
  maxAbsorbedInstallments: number;
  /** Taxa mensal para juros repassados (ex: 0.0199 = 1.99% a.m.) */
  monthlyInterestRate: number;
}

// ─── Resultado completo (auditoria total) ────────────────────────────────

export interface PricingResult {
  // ── Input snapshot
  netPriceOriginal: number;
  netCurrency: Currency;

  // ── Câmbio
  exchangeRate: number;
  exchangeRateId?: string;
  spreadPct: number;
  netPriceBRL: number;

  // ── Markup
  markupRate: number;
  markupRuleId?: string;
  markupRuleName: string;
  markupAmount: number;

  // ── Custos operacionais
  operationalCostFixed: number;
  operationalCostPercentage: number;
  operationalCostTotal: number;

  // ── Preço pré-pagamento (Preço Bruto / de Custo + Markup)
  grossPrice: number;

  // ── Pagamento
  installments: number;
  paymentMethod: PaymentMethod;
  acquirer: Acquirer;
  mdrRate: number;
  /** true = agência absorveu o MDR; false = juros repassados ao cliente */
  isInterestAbsorbed: boolean;
  /** Taxa paga pelo tenant (cobrada pelo gateway/adquirente) */
  paymentFeeAmount: number;
  /** Juros pagos pelo cliente (repasse) */
  interestRepasse: number;

  // ── Resultado
  /** Preço cobrado (o que entra no orçamento/pedido - sem juros de repasse) */
  finalPrice: number;
  /** Total pago pelo cliente (finalPrice + juros repassados) */
  totalPaidByCustomer: number;
  /** Valor de cada parcela */
  installmentValue: number;

  // ── Análise de margem
  netMargin: number;
  marginPercentage: number;
  isMarginPositive: boolean;
  marginAboveMinimum: boolean;
  minimumRequiredMargin: number;
  /**
   * Status semafórico da margem.
   * 'ok'      → margem ≥ 4% (threshold configurável)
   * 'warning' → margem ≥ 0 mas < 4%
   */
  marginStatus: MarginStatus;
  /** true quando marginStatus = 'warning' — sinaliza atenção na UI */
  marginWarning: boolean;

  // ── Auditoria
  calculatedAt: Date;
}

// ─── Resultado de item individual (para pacotes multi-item) ──────────────

export interface PackageItemResult {
  label: string;
  category: ProductCategory;
  supplierId?: string;
  pricing: PricingResult;
}

export interface PackagePricingResult {
  items: PackageItemResult[];
  /** Somatório dos NETs já convertidos para BRL */
  totalNetBRL: number;
  /** Somatório dos grossPrices por item */
  totalGrossPrice: number;
  /** Preço final do pacote (com MDR absorvido no total) */
  totalFinalPrice: number;
  /** Margem líquida total do pacote */
  totalNetMargin: number;
  totalMarginPercentage: number;
  /** Recálculo do parcelamento sobre o total do pacote */
  installments: number;
  paymentMethod: PaymentMethod;
  acquirer: Acquirer;
  installmentValue: number;
  totalPaidByCustomer: number;
  /**
   * Status semafórico da margem total do pacote.
   * 'ok'      → margem total ≥ warningThreshold (4%)
   * 'warning' → margem total < warningThreshold OU negativa com override
   */
  marginStatus: MarginStatus;
  /** true quando marginStatus = 'warning' — acionar alerta na UI */
  marginWarning: boolean;
  /**
   * true apenas quando margem negativa foi autorizada via allowNegativeMarginOverride.
   * Usado para auditoria: registra que houve override admin explícito.
   */
  wasNegativeMarginOverridden: boolean;
  calculatedAt: Date;
}

// ─── Dependências injetáveis (permite mock em testes) ────────────────────

export interface PricingDependencies {
  getExchangeRate: (tenantId: string, from: Currency, to: Currency) => Promise<ExchangeRate>;
  getMarkupRule: (tenantId: string, params: MarkupLookupParams) => Promise<MarkupRule>;
  getPaymentConfig: (tenantId: string, params: PaymentLookupParams) => Promise<PaymentConfig>;
  logResult?: (input: PricingInput, result: PricingResult) => Promise<void>;
}

export interface MarkupLookupParams {
  productId?: string;
  supplierId?: string;
  category?: ProductCategory;
}

export interface PaymentLookupParams {
  acquirer: Acquirer;
  paymentMethod: PaymentMethod;
  installments: number;
}
