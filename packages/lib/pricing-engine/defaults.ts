// ═══════════════════════════════════════════════════════════════════════════
// defaults.ts — Configurações padrão em memória (para testes e bootstrap)
// ═══════════════════════════════════════════════════════════════════════════

import type {
  ExchangeRate,
  MarkupRule,
  PaymentConfig,
  Currency,
  PaymentMethod,
  Acquirer,
} from './types';
import { buildEffectiveRate } from './math';

// ─── Câmbio padrão (atualizar via admin) ─────────────────────────────────

const MARKET_RATES: Record<string, number> = {
  USD: 5.85,
  EUR: 6.40,
  GBP: 7.45,
  ARS: 0.0062,
  BRL: 1.0,
};

const DEFAULT_SPREAD = 0.015; // 1.5% de spread comercial

export function buildDefaultExchangeRate(from: Currency, to: Currency = 'BRL'): ExchangeRate {
  const rate = MARKET_RATES[from] ?? 1.0;
  const spreadPct = from === 'BRL' ? 0.0 : DEFAULT_SPREAD;
  return {
    id: `default-${from}-${to}`,
    fromCurrency: from,
    toCurrency: to,
    rate,
    spreadPct,
    effectiveRate: buildEffectiveRate(rate, spreadPct),
    source: 'default',
    validFrom: new Date(),
  };
}

// ─── Markup rules padrão ──────────────────────────────────────────────────

export const DEFAULT_MARKUP_RULES: MarkupRule[] = [
  {
    id: 'global-default',
    scope: 'global',
    name: 'Markup Global Padrão',
    markupPercentage: 0.12,         // 12%
    markupMinPercentage: 0.05,      // mínimo 5%
    operationalCostFixed: 0,
    operationalCostPercentage: 0,
    priority: 0,
  },
  {
    id: 'category-insurance',
    scope: 'category',
    category: 'insurance',
    name: 'Markup Seguros',
    markupPercentage: 0.20,         // 20%
    markupMinPercentage: 0.10,
    operationalCostFixed: 0,
    operationalCostPercentage: 0,
    priority: 2,
  },
  {
    id: 'category-flight',
    scope: 'category',
    category: 'flight',
    name: 'Markup Aéreo',
    markupPercentage: 0.06,         // 6%
    markupMinPercentage: 0.03,
    operationalCostFixed: 0,
    operationalCostPercentage: 0,
    priority: 2,
  },
];

// ─── MDR Rede & Asaas (espelho para simulações) ───────────────────────────

export const DEFAULT_PAYMENT_CONFIGS: PaymentConfig[] = [
  // REDE VISA CREDIT
  { id: 'rede-visa-1x',  acquirer: 'rede', paymentMethod: 'credit_visa',  installments: 1,  mdrRate: 0.03470, maxAbsorbedInstallments: 10, monthlyInterestRate: 0.0199 },
  { id: 'rede-visa-2x',  acquirer: 'rede', paymentMethod: 'credit_visa',  installments: 2,  mdrRate: 0.04470, maxAbsorbedInstallments: 10, monthlyInterestRate: 0.0199 },
  { id: 'rede-visa-3x',  acquirer: 'rede', paymentMethod: 'credit_visa',  installments: 3,  mdrRate: 0.05180, maxAbsorbedInstallments: 10, monthlyInterestRate: 0.0199 },
  { id: 'rede-visa-4x',  acquirer: 'rede', paymentMethod: 'credit_visa',  installments: 4,  mdrRate: 0.05890, maxAbsorbedInstallments: 10, monthlyInterestRate: 0.0199 },
  { id: 'rede-visa-5x',  acquirer: 'rede', paymentMethod: 'credit_visa',  installments: 5,  mdrRate: 0.06600, maxAbsorbedInstallments: 10, monthlyInterestRate: 0.0199 },
  { id: 'rede-visa-6x',  acquirer: 'rede', paymentMethod: 'credit_visa',  installments: 6,  mdrRate: 0.07310, maxAbsorbedInstallments: 10, monthlyInterestRate: 0.0199 },
  { id: 'rede-visa-7x',  acquirer: 'rede', paymentMethod: 'credit_visa',  installments: 7,  mdrRate: 0.08320, maxAbsorbedInstallments: 10, monthlyInterestRate: 0.0199 },
  { id: 'rede-visa-8x',  acquirer: 'rede', paymentMethod: 'credit_visa',  installments: 8,  mdrRate: 0.09030, maxAbsorbedInstallments: 10, monthlyInterestRate: 0.0199 },
  { id: 'rede-visa-9x',  acquirer: 'rede', paymentMethod: 'credit_visa',  installments: 9,  mdrRate: 0.09740, maxAbsorbedInstallments: 10, monthlyInterestRate: 0.0199 },
  { id: 'rede-visa-10x', acquirer: 'rede', paymentMethod: 'credit_visa',  installments: 10, mdrRate: 0.10450, maxAbsorbedInstallments: 10, monthlyInterestRate: 0.0199 },
  { id: 'rede-visa-11x', acquirer: 'rede', paymentMethod: 'credit_visa',  installments: 11, mdrRate: 0.0,     maxAbsorbedInstallments: 10, monthlyInterestRate: 0.0199 },
  { id: 'rede-visa-12x', acquirer: 'rede', paymentMethod: 'credit_visa',  installments: 12, mdrRate: 0.0,     maxAbsorbedInstallments: 10, monthlyInterestRate: 0.0199 },
  { id: 'rede-visa-21x', acquirer: 'rede', paymentMethod: 'credit_visa',  installments: 21, mdrRate: 0.0,     maxAbsorbedInstallments: 10, monthlyInterestRate: 0.0199 },
  
  // ASAAS CREDIT
  { id: 'asaas-master-1x', acquirer: 'asaas', paymentMethod: 'credit_master', installments: 1, mdrRate: 0.02990, maxAbsorbedInstallments: 12, monthlyInterestRate: 0.0189 },
  { id: 'asaas-master-2x', acquirer: 'asaas', paymentMethod: 'credit_master', installments: 2, mdrRate: 0.03490, maxAbsorbedInstallments: 12, monthlyInterestRate: 0.0189 },
  { id: 'asaas-master-3x', acquirer: 'asaas', paymentMethod: 'credit_master', installments: 3, mdrRate: 0.03990, maxAbsorbedInstallments: 12, monthlyInterestRate: 0.0189 },
  { id: 'asaas-master-6x', acquirer: 'asaas', paymentMethod: 'credit_master', installments: 6, mdrRate: 0.05490, maxAbsorbedInstallments: 12, monthlyInterestRate: 0.0189 },
  { id: 'asaas-master-12x', acquirer: 'asaas', paymentMethod: 'credit_master', installments: 12, mdrRate: 0.07990, maxAbsorbedInstallments: 12, monthlyInterestRate: 0.0189 },
  
  { id: 'asaas-visa-1x', acquirer: 'asaas', paymentMethod: 'credit_visa', installments: 1, mdrRate: 0.02990, maxAbsorbedInstallments: 12, monthlyInterestRate: 0.0189 },
  { id: 'asaas-visa-2x', acquirer: 'asaas', paymentMethod: 'credit_visa', installments: 2, mdrRate: 0.03490, maxAbsorbedInstallments: 12, monthlyInterestRate: 0.0189 },
  { id: 'asaas-visa-3x', acquirer: 'asaas', paymentMethod: 'credit_visa', installments: 3, mdrRate: 0.03990, maxAbsorbedInstallments: 12, monthlyInterestRate: 0.0189 },
  { id: 'asaas-visa-6x', acquirer: 'asaas', paymentMethod: 'credit_visa', installments: 6, mdrRate: 0.05490, maxAbsorbedInstallments: 12, monthlyInterestRate: 0.0189 },
  { id: 'asaas-visa-12x', acquirer: 'asaas', paymentMethod: 'credit_visa', installments: 12, mdrRate: 0.07990, maxAbsorbedInstallments: 12, monthlyInterestRate: 0.0189 },

  // PIX & BOLETO (MDR de 1x)
  { id: 'asaas-pix',      acquirer: 'asaas', paymentMethod: 'pix',          installments: 1,  mdrRate: 0.00990, maxAbsorbedInstallments: 1,  monthlyInterestRate: 0 },
  { id: 'asaas-boleto',   acquirer: 'asaas', paymentMethod: 'boleto',       installments: 1,  mdrRate: 0.01490, maxAbsorbedInstallments: 1,  monthlyInterestRate: 0 },
];

/**
 * Lookup de MDR em memória (replica lógica do banco).
 */
export function lookupPaymentConfig(
  acquirer: Acquirer,
  paymentMethod: PaymentMethod,
  installments: number
): PaymentConfig | undefined {
  return DEFAULT_PAYMENT_CONFIGS.find(
    (c) =>
      c.acquirer === acquirer &&
      c.paymentMethod === paymentMethod &&
      c.installments === installments
  );
}

/**
 * Resolve markup seguindo a hierarquia: product > supplier > category > global.
 */
export function resolveMarkupFromMemory(params: {
  productId?: string;
  supplierId?: string;
  category?: string;
  rules?: MarkupRule[];
}): MarkupRule {
  const rules = params.rules ?? DEFAULT_MARKUP_RULES;
  const priority = { product: 4, supplier: 3, category: 2, global: 1 };

  const applicable = rules
    .filter((r) => {
      if (r.scope === 'global') return true;
      if (r.scope === 'product' && params.productId && r.scopeId === params.productId) return true;
      if (r.scope === 'supplier' && params.supplierId && r.scopeId === params.supplierId) return true;
      if (r.scope === 'category' && params.category && r.category === params.category) return true;
      return false;
    })
    .sort((a, b) => {
      const scopeDiff = (priority[b.scope] ?? 0) - (priority[a.scope] ?? 0);
      if (scopeDiff !== 0) return scopeDiff;
      return b.priority - a.priority;
    });

  if (!applicable.length) {
    throw new Error('Nenhuma regra de markup encontrada. Cadastre ao menos uma regra global.');
  }

  return applicable[0];
}
