// ═══════════════════════════════════════════════════════════════════════════
// math.ts — Funções matemáticas puras do Pricing Engine
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Arredondamento inteligente para valores monetários.
 * Sempre para CIMA na 2ª casa decimal.
 * Garante que a empresa nunca perde margem por arredondamento.
 *
 * @example
 * smartCeil(1234.561) → 1234.57
 * smartCeil(1234.560) → 1234.56
 * smartCeil(1234.001) → 1234.01
 */
export function smartCeil(value: number): number {
  return Math.ceil(value * 100) / 100;
}

/**
 * Arredondamento normal (para exibição, não para cálculo interno).
 */
export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

// ─── PASSO 1: Câmbio ──────────────────────────────────────────────────────

/**
 * Converte um valor de moeda estrangeira para BRL usando a taxa efetiva.
 * (taxa efetiva = taxa de mercado × (1 + spread))
 *
 * @example
 * convertCurrency(450, 5.8425) → 2629.13
 */
export function convertCurrency(netPrice: number, effectiveRate: number): number {
  return smartCeil(netPrice * effectiveRate);
}

/**
 * Calcula a taxa efetiva dado mercado + spread.
 */
export function buildEffectiveRate(marketRate: number, spreadPct: number): number {
  return marketRate * (1 + spreadPct);
}

// ─── PASSO 2: Markup ──────────────────────────────────────────────────────

/**
 * Aplica markup sobre o NET em BRL.
 * Retorna o valor DO markup (não o preço final).
 *
 * @example
 * calcMarkupAmount(2629.13, 0.12) → 315.50
 */
export function calcMarkupAmount(netPriceBRL: number, markupRate: number): number {
  return smartCeil(netPriceBRL * markupRate);
}

/**
 * Calcula o custo operacional total.
 * = custo fixo em BRL + percentual sobre NET_BRL
 *
 * @example
 * calcOperationalCost(2629.13, 0, 0) → 0
 * calcOperationalCost(2629.13, 50, 0.01) → 76.30
 */
export function calcOperationalCost(
  netPriceBRL: number,
  fixedCost: number,
  percentageCost: number
): number {
  return smartCeil(fixedCost + netPriceBRL * percentageCost);
}

/**
 * Preço bruto = NET_BRL + markup + custo operacional
 */
export function calcGrossPrice(
  netPriceBRL: number,
  markupAmount: number,
  operationalCost: number
): number {
  return smartCeil(netPriceBRL + markupAmount + operationalCost);
}

// ─── PASSO 3: Margem mínima ───────────────────────────────────────────────

/**
 * Margem mínima em BRL exigida pela regra configurada.
 *
 * @example
 * calcMinimumMargin(2629.13, 0.05) → 131.46
 */
export function calcMinimumMargin(netPriceBRL: number, markupMinPercentage: number): number {
  return smartCeil(netPriceBRL * markupMinPercentage);
}

// ─── PASSO 4: Pagamento — MDR absorvido ───────────────────────────────────

/**
 * Preço com MDR absorvido pela empresa.
 *
 * Lógica: A empresa quer receber `grossPrice` líquido.
 * O adquirente vai descontar `mdrRate` do total cobrado.
 * Portanto: finalPrice = grossPrice / (1 - mdrRate)
 *
 * @example
 * calcAbsorbedMDR(2944.63, 0.0660) → { finalPrice: 3152.71, feeAmount: 208.08 }
 */
export function calcAbsorbedMDR(
  grossPrice: number,
  mdrRate: number
): { finalPrice: number; feeAmount: number } {
  if (mdrRate <= 0) return { finalPrice: grossPrice, feeAmount: 0 };
  const finalPrice = smartCeil(grossPrice / (1 - mdrRate));
  const feeAmount = round2(finalPrice - grossPrice);
  return { finalPrice, feeAmount };
}

/**
 * Valor de cada parcela quando a empresa absorve o MDR.
 * Cliente paga finalPrice dividido em n parcelas iguais.
 *
 * @example
 * calcAbsorbedInstallment(3152.71, 5) → 630.55
 */
export function calcAbsorbedInstallment(finalPrice: number, installments: number): number {
  return smartCeil(finalPrice / installments);
}

// ─── PASSO 4 (alt): Pagamento — juros repassados ao cliente ──────────────

/**
 * Parcela com juros compostos repassados ao cliente.
 * Fórmula PMT (Prestação com amortização Price):
 *
 *   PMT = PV × [i × (1+i)^n] / [(1+i)^n - 1]
 *
 * Onde:
 *   PV = valor presente (grossPrice)
 *   i  = taxa mensal (ex: 0.0199 = 1,99%)
 *   n  = número de parcelas
 *
 * @example
 * calcPassThroughInstallment(9520, 12, 0.0199) → { installment: 894.95, total: 10739.40, interest: 1219.40 }
 */
export function calcPassThroughInstallment(
  grossPrice: number,
  installments: number,
  monthlyRate: number
): { installmentValue: number; totalPaid: number; interestAmount: number } {
  if (monthlyRate <= 0 || installments <= 1) {
    return {
      installmentValue: grossPrice,
      totalPaid: grossPrice,
      interestAmount: 0,
    };
  }

  const i = monthlyRate;
  const n = installments;
  const factor = (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
  const installmentValue = smartCeil(grossPrice * factor);
  const totalPaid = round2(installmentValue * n);
  const interestAmount = round2(totalPaid - grossPrice);

  return { installmentValue, totalPaid, interestAmount };
}

// ─── PASSO 5: Margens ────────────────────────────────────────────────────

/**
 * Margem líquida real da venda.
 *
 * MARGEM = finalPrice - NET_BRL - custoOp - taxaPagamento
 *
 * Nota: para parcelamento com repasse, a empresa recebe apenas
 * finalPrice (grossPrice), não o totalPaidByCustomer.
 *
 * @example
 * calcNetMargin(3152.71, 2629.13, 0, 208.08) → 315.50
 */
export function calcNetMargin(
  finalPrice: number,
  netPriceBRL: number,
  operationalCost: number,
  paymentFeeAmount: number
): number {
  return round2(finalPrice - netPriceBRL - operationalCost - paymentFeeAmount);
}

/**
 * Percentual de margem sobre o preço final.
 *
 * @example
 * calcMarginPercentage(315.50, 3152.71) → 0.1001 (10.01%)
 */
export function calcMarginPercentage(netMargin: number, finalPrice: number): number {
  if (finalPrice <= 0) return 0;
  return round2(netMargin / finalPrice);
}

// ─── Utilitários ─────────────────────────────────────────────────────────

/**
 * Formata um valor monetário em BRL para exibição.
 */
export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata um percentual para exibição.
 */
export function formatPct(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}
