import { createInMemoryDeps } from './packages/lib/pricing-engine/in-memory-deps';
import { calculatePrice, calculatePackagePrice } from './packages/lib/pricing-engine/engine';
import { formatBRL, formatPct } from './packages/lib/pricing-engine/math';

async function runTests() {
  console.log('=== INICIANDO TESTES DO PRICING ENGINE ===\n');

  const tenantId = '77777777-7777-7777-7777-777777777777';

  // 1. Instanciar dependências in-memory
  const deps = createInMemoryDeps({
    exchangeRates: {
      USD: 5.85, // Taxa base de mercado USD -> BRL
    },
  });

  // 2. Teste 1: Produto em BRL, 1x à vista (MDR absorvido)
  console.log('--- Teste 1: Hospedagem Nacional BRL, 1x à vista (Asaas) ---');
  try {
    const res1 = await calculatePrice({
      tenantId,
      netPrice: 1000,
      netCurrency: 'BRL',
      category: 'hotel',
      acquirer: 'asaas',
      paymentMethod: 'credit_master',
      installments: 1,
    }, deps);

    console.log(`Custo original (Net): BRL 1.000,00`);
    console.log(`Preço final de Venda: ${formatBRL(res1.finalPrice)}`);
    console.log(`Markup aplicado: ${formatPct(res1.markupRate)} (${formatBRL(res1.markupAmount)})`);
    console.log(`Taxa cobrada pelo gateway (MDR): ${formatPct(res1.mdrRate)} (${formatBRL(res1.paymentFeeAmount)})`);
    console.log(`Margem líquida real: ${formatBRL(res1.netMargin)} (${formatPct(res1.marginPercentage)})`);
    console.log(`Semáforo de margem: ${res1.marginStatus.toUpperCase()}\n`);
    
    // Verificações assertions
    // Custo BRL = 1000. Markup hotel global padrão = 12% -> markupAmount = 120. Gross price = 1120.
    // MDR 1x credit_master Asaas = 2.99% -> finalPrice = 1120 / (1 - 0.0299) = 1120 / 0.9701 = 1154.52
    // Fee = 1154.52 * 0.0299 = 34.52. Margem = 1154.52 - 1000 - 34.52 = 120.00.
    if (Math.abs(res1.finalPrice - 1154.52) > 0.01) {
      throw new Error(`Teste 1 Falhou: finalPrice esperado 1154.52, recebido ${res1.finalPrice}`);
    }
    console.log('✅ Teste 1 passou!\n');
  } catch (error: any) {
    console.error('❌ Teste 1 Falhou:', error.message);
    process.exit(1);
  }

  // 3. Teste 2: Produto em USD, 5x parcelado (MDR absorvido)
  console.log('--- Teste 2: Voo Internacional USD, 5x parcelado (Rede) ---');
  try {
    const res2 = await calculatePrice({
      tenantId,
      netPrice: 200,
      netCurrency: 'USD',
      category: 'flight',
      acquirer: 'rede',
      paymentMethod: 'credit_visa',
      installments: 5,
    }, deps);

    console.log(`Custo original (Net): USD 200,00`);
    console.log(`Taxa de câmbio efetiva (com spread): ${res2.exchangeRate}`);
    console.log(`Custo convertido: ${formatBRL(res2.netPriceBRL)}`);
    console.log(`Preço final de Venda: ${formatBRL(res2.finalPrice)}`);
    console.log(`Markup aplicado: ${formatPct(res2.markupRate)} (${formatBRL(res2.markupAmount)})`);
    console.log(`Taxa cobrada pelo adquirente (MDR 5x): ${formatPct(res2.mdrRate)} (${formatBRL(res2.paymentFeeAmount)})`);
    console.log(`Valor de cada parcela (5x): ${formatBRL(res2.installmentValue)}`);
    console.log(`Margem líquida real: ${formatBRL(res2.netMargin)} (${formatPct(res2.marginPercentage)})`);
    console.log(`Semáforo de margem: ${res2.marginStatus.toUpperCase()}\n`);

    // Verificações assertions
    // Custo USD = 200. Fx rate mercado = 5.85, spread = 1.5% -> effective rate = 5.85 * 1.015 = 5.93775
    // Custo BRL = Math.ceil(200 * 5.93775 * 100) / 100 = 1187.55
    // Markup flight global padrão = 6% -> markupAmount = Math.ceil(1187.55 * 0.06 * 100) / 100 = 71.26
    // Gross price = 1187.55 + 71.26 = 1258.81
    // MDR 5x Rede Visa = 6.60% -> finalPrice = Math.ceil(1258.81 / (1 - 0.066) * 100) / 100 = 1347.77
    // Parcela = Math.ceil(1347.77 / 5 * 100) / 100 = 269.56
    if (Math.abs(res2.finalPrice - 1347.77) > 0.01) {
      throw new Error(`Teste 2 Falhou: finalPrice esperado 1347.77, recebido ${res2.finalPrice}`);
    }
    console.log('✅ Teste 2 passou!\n');
  } catch (error: any) {
    console.error('❌ Teste 2 Falhou:', error.message);
    process.exit(1);
  }

  // 4. Teste 3: Repasse de Juros (12x parcelado, excede o máximo de absorção 10x)
  console.log('--- Teste 3: Seguro Viagem BRL, 12x parcelado com juros repassados (Rede) ---');
  try {
    const res3 = await calculatePrice({
      tenantId,
      netPrice: 300,
      netCurrency: 'BRL',
      category: 'insurance',
      acquirer: 'rede',
      paymentMethod: 'credit_visa',
      installments: 12,
    }, deps);

    console.log(`Custo original (Net): BRL 300,00`);
    console.log(`Preço final do Tenant: ${formatBRL(res3.finalPrice)}`);
    console.log(`Markup aplicado: ${formatPct(res3.markupRate)} (${formatBRL(res3.markupAmount)})`);
    console.log(`Juros acumulados do parcelamento (Repasse): ${formatBRL(res3.interestRepasse)}`);
    console.log(`Total pago pelo passageiro no final: ${formatBRL(res3.totalPaidByCustomer)}`);
    console.log(`Valor de cada parcela (12x com juros): ${formatBRL(res3.installmentValue)}`);
    console.log(`Margem líquida real (Tenant ganha markup cheio): ${formatBRL(res3.netMargin)} (${formatPct(res3.marginPercentage)})`);
    console.log(`Semáforo de margem: ${res3.marginStatus.toUpperCase()}\n`);

    // Verificações assertions
    // Custo BRL = 300. Markup seguro global padrão = 20% -> markupAmount = 60. Gross price = 360.
    // 12x excede maxAbsorbed (10x). Juros repassados de 1.99% a.m.
    // PMT = PV * [i * (1+i)^n] / [(1+i)^n - 1]
    // factor = (0.0199 * 1.0199^12) / (1.0199^12 - 1) = 0.094506
    // installmentValue = Math.ceil(360 * factor * 100) / 100 = 34.03
    // totalPaid = 34.03 * 12 = 408.36
    // interest = 408.36 - 360 = 48.36
    if (Math.abs(res3.installmentValue - 34.03) > 0.01) {
      throw new Error(`Teste 3 Falhou: parcela esperada 34.03, recebido ${res3.installmentValue}`);
    }
    console.log('✅ Teste 3 passou!\n');
  } catch (error: any) {
    console.error('❌ Teste 3 Falhou:', error.message);
    process.exit(1);
  }

  // 5. Teste 4: Margem Insuficiente (Bloqueio)
  console.log('--- Teste 4: Teste de Bloqueio por Margem Mínima Insuficiente ---');
  try {
    // Configura um mock de regras onde o markup resolvido (2%) é menor que o mínimo exigido (5%)
    const depsViolation = createInMemoryDeps({
      markupRules: [
        {
          id: 'violation-rule',
          scope: 'global',
          name: 'Regra de Margem Insuficiente',
          markupPercentage: 0.02, // 2% markup
          markupMinPercentage: 0.05, // 5% mínimo exigido
          operationalCostFixed: 0,
          operationalCostPercentage: 0,
          priority: 10,
        },
      ],
    });

    await calculatePrice({
      tenantId,
      netPrice: 1000,
      netCurrency: 'BRL',
      category: 'hotel',
    }, depsViolation);
    
    // Se não lançar erro, falhou
    throw new Error('O teste deveria ter disparado um NegativeMarginError');
  } catch (error: any) {
    if (error.name === 'NegativeMarginError') {
      console.log(`✅ Teste 4 passou! Lançou o erro esperado: "${error.message}"\n`);
    } else {
      console.error('❌ Teste 4 Falhou (lançou erro incorreto):', error.message);
      process.exit(1);
    }
  }

  // 6. Teste 5: Precificação de Pacote (Multi-item com recalculo de MDR consolidado)
  console.log('--- Teste 5: Pacote Dinâmico (Hotel BRL + Voo USD), 10x parcelado (Rede) ---');
  try {
    const packageRes = await calculatePackagePrice(
      tenantId,
      [
        {
          label: 'Hotel Copacabana Palace',
          input: {
            tenantId,
            netPrice: 1000,
            netCurrency: 'BRL',
            category: 'hotel',
          },
        },
        {
          label: 'Voo Rio -> Miami',
          input: {
            tenantId,
            netPrice: 200,
            netCurrency: 'USD',
            category: 'flight',
          },
        },
      ],
      10, // 10 parcelas
      'credit_visa',
      'rede',
      deps,
      { allowNegativeMarginOverride: true } // Permite margem negativa para testar auditoria admin
    );

    console.log(`Preço final consolidado do Pacote: ${formatBRL(packageRes.totalFinalPrice)}`);
    console.log(`Total NET em BRL: ${formatBRL(packageRes.totalNetBRL)}`);
    console.log(`Total Bruto (com markups individuais): ${formatBRL(packageRes.totalGrossPrice)}`);
    console.log(`Valor da parcela (10x absorvido no total): ${formatBRL(packageRes.installmentValue)}`);
    console.log(`Margem líquida consolidada do Pacote: ${formatBRL(packageRes.totalNetMargin)} (${formatPct(packageRes.totalMarginPercentage)})`);
    console.log(`Semáforo de margem do Pacote: ${packageRes.marginStatus.toUpperCase()}\n`);

    // Verificações assertions
    // Item 1 (Hotel): net = 1000, markup = 12% (120), gross = 1120.
    // Item 2 (Flight): net = 1187.55 (USD 200 * 5.93775), markup = 6% (71.26), gross = 1258.81.
    // Total gross = 1120 + 1258.81 = 2378.81.
    // MDR 10x Rede Visa = 10.45% -> totalFinalPrice = Math.ceil(2378.81 / (1 - 0.1045) * 100) / 100 = 2656.41
    // Parcela = Math.ceil(2656.41 / 10 * 100) / 100 = 265.65.
    // Total pago pelo cliente = 265.65 * 10 = 2656.50
    if (Math.abs(packageRes.totalFinalPrice - 2656.41) > 0.01) {
      throw new Error(`Teste 5 Falhou: totalFinalPrice esperado 2656.41, recebido ${packageRes.totalFinalPrice}`);
    }
    console.log('✅ Teste 5 passou!\n');
  } catch (error: any) {
    console.error('❌ Teste 5 Falhou:', error.message);
    process.exit(1);
  }

  console.log('=== TODOS OS TESTES PASSARAM COM SUCESSO! ===');
}

runTests().catch(console.error);
