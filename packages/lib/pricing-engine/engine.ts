// ═══════════════════════════════════════════════════════════════════════════
// engine.ts — Orquestrador principal do Pricing Engine
// ═══════════════════════════════════════════════════════════════════════════

import type {
  PricingInput,
  PricingResult,
  PricingDependencies,
  PackageItemResult,
  PackagePricingResult,
  PackageOptions,
  PaymentMethod,
  Acquirer,
  MarginStatus,
} from './types';
import { MARGIN_WARNING_THRESHOLD_PCT } from './types';
import {
  convertCurrency,
  calcMarkupAmount,
  calcOperationalCost,
  calcGrossPrice,
  calcMinimumMargin,
  calcAbsorbedMDR,
  calcAbsorbedInstallment,
  calcPassThroughInstallment,
  calcNetMargin,
  calcMarginPercentage,
  round2,
} from './math';
import { NegativeMarginError, InvalidPricingInputError } from './errors';

// ─── Validação de input ───────────────────────────────────────────────────

function validateInput(input: PricingInput): void {
  if (!input.tenantId) {
    throw new InvalidPricingInputError('tenantId é obrigatório');
  }
  if (input.netPrice <= 0) {
    throw new InvalidPricingInputError(`netPrice deve ser positivo (recebido: ${input.netPrice})`);
  }
  if (input.installments !== undefined && (input.installments < 1 || input.installments > 21)) {
    throw new InvalidPricingInputError(`installments deve estar entre 1 e 21 (recebido: ${input.installments})`);
  }
  if (input.overrideMarkupRate !== undefined && input.overrideMarkupRate < 0) {
    throw new InvalidPricingInputError(`overrideMarkupRate não pode ser negativo`);
  }
  if (input.overrideExchangeRate !== undefined && input.overrideExchangeRate <= 0) {
    throw new InvalidPricingInputError(`overrideExchangeRate deve ser positivo`);
  }
}

// ─── Engine principal ─────────────────────────────────────────────────────

/**
 * Calcula o preço completo de um produto, gerando um PricingResult auditável.
 *
 * @param input  - Dados do produto e parâmetros de venda
 * @param deps   - Funções de lookup (Drizzle ou mock em testes)
 *
 * @throws NegativeMarginError       se netMargin < minimumRequiredMargin
 * @throws InvalidPricingInputError  se o input for inválido
 * @throws ExchangeRateNotFoundError  se não houver taxa de câmbio
 * @throws MarkupRuleNotFoundError   se não houver regra de markup
 * @throws PaymentConfigNotFoundError se não houver config de MDR
 */
export async function calculatePrice(
  input: PricingInput,
  deps: PricingDependencies,
  warningThresholdPct: number = MARGIN_WARNING_THRESHOLD_PCT
): Promise<PricingResult> {
  validateInput(input);

  const tenantId = input.tenantId;
  const installments = input.installments ?? 1;
  const paymentMethod: PaymentMethod = input.paymentMethod ?? 'credit_visa';
  const acquirer: Acquirer = input.acquirer ?? 'asaas';

  // ── PASSO 1: Câmbio ─────────────────────────────────────────────────────
  let exchangeRate: number;
  let exchangeRateId: string | undefined;
  let spreadPct: number;

  if (input.overrideExchangeRate !== undefined) {
    exchangeRate = input.overrideExchangeRate;
    spreadPct = 0;
  } else if (input.netCurrency === 'BRL') {
    exchangeRate = 1;
    spreadPct = 0;
  } else {
    const fx = await deps.getExchangeRate(tenantId, input.netCurrency, 'BRL');
    exchangeRate = fx.effectiveRate;
    exchangeRateId = fx.id;
    spreadPct = fx.spreadPct;
  }

  const netPriceBRL = input.netCurrency === 'BRL'
    ? input.netPrice
    : convertCurrency(input.netPrice, exchangeRate);

  // ── PASSO 2: Markup ─────────────────────────────────────────────────────
  let markupRate: number;
  let markupRuleId: string | undefined;
  let markupRuleName: string;
  let markupMinPercentage: number;
  let operationalCostFixed: number;
  let operationalCostPercentage: number;

  if (input.overrideMarkupRate !== undefined) {
    markupRate = input.overrideMarkupRate;
    markupRuleName = 'Override Manual';
    markupMinPercentage = 0; // Override ignora mínimo (responsabilidade do agente)
    operationalCostFixed = 0;
    operationalCostPercentage = 0;
  } else {
    const rule = await deps.getMarkupRule(tenantId, {
      productId: input.productId,
      supplierId: input.supplierId,
      category: input.category,
    });
    markupRate = rule.markupPercentage;
    markupRuleId = rule.id;
    markupRuleName = rule.name;
    markupMinPercentage = rule.markupMinPercentage;
    operationalCostFixed = rule.operationalCostFixed;
    operationalCostPercentage = rule.operationalCostPercentage;
  }

  const markupAmount = calcMarkupAmount(netPriceBRL, markupRate);
  const operationalCostTotal = calcOperationalCost(
    netPriceBRL,
    operationalCostFixed,
    operationalCostPercentage
  );
  const grossPrice = calcGrossPrice(netPriceBRL, markupAmount, operationalCostTotal);

  // ── PASSO 3: Margem mínima (pré-pagamento) ───────────────────────────────
  const minimumRequiredMargin = calcMinimumMargin(netPriceBRL, markupMinPercentage);

  // ── PASSO 4: Pagamento ───────────────────────────────────────────────────
  const paymentConfig = await deps.getPaymentConfig(tenantId, { acquirer, paymentMethod, installments });

  const isInterestAbsorbed = installments <= paymentConfig.maxAbsorbedInstallments;

  let finalPrice: number;
  let paymentFeeAmount: number;
  let interestRepasse: number;
  let installmentValue: number;
  let totalPaidByCustomer: number;
  let mdrRate: number;

  if (isInterestAbsorbed) {
    const { finalPrice: fp, feeAmount } = calcAbsorbedMDR(grossPrice, paymentConfig.mdrRate);
    finalPrice = fp;
    paymentFeeAmount = feeAmount;
    interestRepasse = 0;
    mdrRate = paymentConfig.mdrRate;
    installmentValue = calcAbsorbedInstallment(finalPrice, installments);
    totalPaidByCustomer = round2(installmentValue * installments);
  } else {
    const passThrough = calcPassThroughInstallment(
      grossPrice,
      installments,
      paymentConfig.monthlyInterestRate
    );
    finalPrice = grossPrice;
    paymentFeeAmount = 0;
    interestRepasse = passThrough.interestAmount;
    mdrRate = 0;
    installmentValue = passThrough.installmentValue;
    totalPaidByCustomer = passThrough.totalPaid;
  }

  // ── PASSO 5: Margens ─────────────────────────────────────────────────────
  const netMargin = calcNetMargin(finalPrice, netPriceBRL, operationalCostTotal, paymentFeeAmount);
  const marginPercentage = calcMarginPercentage(netMargin, finalPrice);
  const isMarginPositive = netMargin > 0;
  const marginAboveMinimum = netMargin >= minimumRequiredMargin;

  // ── VALIDAÇÃO CRÍTICA: bloqueia venda com margem insuficiente ─────────────
  if (!marginAboveMinimum) {
    throw new NegativeMarginError({
      netMargin,
      minimumRequired: minimumRequiredMargin,
      finalPrice,
      netPriceBRL,
      markupRate,
      context: 'item',
    });
  }

  // ── SEMÁFORO DE MARGEM ───────────────────────────────────────────────────
  // 'warning' = margem existe mas está abaixo do threshold de conforto (4%)
  // 'ok'      = margem acima do threshold → operação saudável
  const marginStatus: MarginStatus = marginPercentage < warningThresholdPct ? 'warning' : 'ok';
  const marginWarning = marginStatus === 'warning';

  const result: PricingResult = {
    netPriceOriginal: input.netPrice,
    netCurrency: input.netCurrency,
    exchangeRate,
    exchangeRateId,
    spreadPct,
    netPriceBRL,
    markupRate,
    markupRuleId,
    markupRuleName,
    markupAmount,
    operationalCostFixed,
    operationalCostPercentage,
    operationalCostTotal,
    grossPrice,
    installments,
    paymentMethod,
    acquirer,
    mdrRate,
    isInterestAbsorbed,
    paymentFeeAmount,
    interestRepasse,
    finalPrice,
    totalPaidByCustomer,
    installmentValue,
    netMargin,
    marginPercentage,
    isMarginPositive,
    marginAboveMinimum,
    minimumRequiredMargin,
    marginStatus,
    marginWarning,
    calculatedAt: new Date(),
  };

  if (deps.logResult) {
    deps.logResult(input, result).catch((err) => {
      // Silencia erro de log — nunca deve impedir o pricing
      console.error('[pricing_engine_log] Falha ao registrar log:', err?.message || err);
    });
  }

  return result;
}

// ─── Motor de pacote (multi-item) ─────────────────────────────────────────

/**
 * Calcula o preço de um pacote com múltiplos itens.
 * O parcelamento é aplicado sobre o TOTAL do pacote, não por item.
 *
 * @throws NegativeMarginError quando totalNetMargin < 0 sem override autorizado
 */
export async function calculatePackagePrice(
  tenantId: string,
  items: Array<{
    label: string;
    input: PricingInput;
  }>,
  packageInstallments: number,
  packagePaymentMethod: PaymentMethod,
  packageAcquirer: Acquirer,
  deps: PricingDependencies,
  options: PackageOptions = {}
): Promise<PackagePricingResult> {
  const {
    allowNegativeMarginOverride = false,
    marginWarningThresholdPct = MARGIN_WARNING_THRESHOLD_PCT,
  } = options;

  // 1. Calcula cada item individualmente (sem parcelamento — 1x à vista)
  const itemResults: PackageItemResult[] = [];

  for (const item of items) {
    const pricing = await calculatePrice(
      { ...item.input, tenantId, installments: 1, paymentMethod: 'credit_visa', acquirer: 'rede' },
      deps,
      marginWarningThresholdPct
    );
    itemResults.push({
      label: item.label,
      category: item.input.category,
      supplierId: item.input.supplierId,
      pricing,
    });
  }

  // 2. Soma os totais
  const totalNetBRL = round2(itemResults.reduce((s, i) => s + i.pricing.netPriceBRL, 0));
  const totalGrossPrice = round2(itemResults.reduce((s, i) => s + i.pricing.grossPrice, 0));

  // 3. Recalcula pagamento sobre o total do pacote (MDR único sobre o total)
  const paymentConfig = await deps.getPaymentConfig(tenantId, {
    acquirer: packageAcquirer,
    paymentMethod: packagePaymentMethod,
    installments: packageInstallments,
  });

  const isAbsorbed = packageInstallments <= paymentConfig.maxAbsorbedInstallments;
  let totalFinalPrice: number;
  let installmentValue: number;
  let totalPaidByCustomer: number;
  let interestRepasse: number;

  if (isAbsorbed) {
    const { finalPrice, feeAmount } = calcAbsorbedMDR(totalGrossPrice, paymentConfig.mdrRate);
    totalFinalPrice = finalPrice;
    installmentValue = calcAbsorbedInstallment(finalPrice, packageInstallments);
    totalPaidByCustomer = round2(installmentValue * packageInstallments);
    interestRepasse = 0;
  } else {
    const passThrough = calcPassThroughInstallment(
      totalGrossPrice,
      packageInstallments,
      paymentConfig.monthlyInterestRate
    );
    totalFinalPrice = totalGrossPrice;
    installmentValue = passThrough.installmentValue;
    totalPaidByCustomer = passThrough.totalPaid;
    interestRepasse = passThrough.interestAmount;
  }

  // 4. Margem total do pacote
  const totalMarkupSum = round2(itemResults.reduce((s, i) => s + i.pricing.markupAmount, 0));
  const packageMdrFee = isAbsorbed ? round2(totalFinalPrice - totalGrossPrice) : 0;
  const totalNetMargin = round2(totalMarkupSum - packageMdrFee);
  const totalMarginPercentage = calcMarginPercentage(totalNetMargin, totalFinalPrice);

  // 5. BLOQUEIO DE MARGEM NEGATIVA NO PACOTE 
  let wasNegativeMarginOverridden = false;

  if (totalNetMargin < 0) {
    if (!allowNegativeMarginOverride) {
      throw new NegativeMarginError({
        netMargin: totalNetMargin,
        minimumRequired: 0,
        finalPrice: totalFinalPrice,
        netPriceBRL: totalNetBRL,
        markupRate: totalMarkupSum / totalNetBRL,
        context: 'package',
      });
    }
    wasNegativeMarginOverridden = true;
  }

  // 6. SEMÁFORO DE MARGEM DO PACOTE 
  const marginStatus: MarginStatus =
    totalMarginPercentage < marginWarningThresholdPct ? 'warning' : 'ok';
  const marginWarning = marginStatus === 'warning';

  return {
    items: itemResults,
    totalNetBRL,
    totalGrossPrice,
    totalFinalPrice,
    totalNetMargin,
    totalMarginPercentage,
    installments: packageInstallments,
    paymentMethod: packagePaymentMethod,
    acquirer: packageAcquirer,
    installmentValue,
    totalPaidByCustomer,
    marginStatus,
    marginWarning,
    wasNegativeMarginOverridden,
    calculatedAt: new Date(),
  };
}
