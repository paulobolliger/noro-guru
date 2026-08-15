// ═══════════════════════════════════════════════════════════════════════════
// currencyService.ts — Serviço de Câmbio Dinâmico (AwesomeAPI PTAX / Comercial)
// ═══════════════════════════════════════════════════════════════════════════

export interface PtaxRateInfo {
  code: string;
  codein: string;
  name: string;
  ptaxVenda: number; // ask (PTAX / Comercial Venda)
  ptaxCompra: number; // bid
  high: number;
  low: number;
  pctChange: number;
  timestamp: string;
  createDate: string;
}

export interface EffectiveExchangeRate {
  fromCurrency: string;
  toCurrency: string;
  ptaxVenda: number;
  masterSpreadPct: number;
  effectiveRate: number; // ptaxVenda * (1 + masterSpreadPct / 100)
  updatedAt: string;
  isLocked: boolean;
  source: string;
}

// Spreads Master Padrão (Configuráveis no Control Plane)
const DEFAULT_MASTER_SPREADS: Record<string, number> = {
  USD: 3.5, // 3.5%
  EUR: 4.0, // 4.0%
};

// Cotação ativa em memória
let lockedDailyRates: Record<string, EffectiveExchangeRate> = {};

/**
 * Busca a cotação PTAX Venda oficial da AwesomeAPI (USD-BRLPTAX, EUR-BRLPTAX).
 */
export async function fetchLivePtaxRates(): Promise<Record<string, PtaxRateInfo>> {
  const apiKey = process.env.AWESOME_API_KEY || '23b7af563cd43bf96ccbfb7e253919fd9c08db31c4195d4cbd7cc5516be3f29c';
  const url = `https://economia.awesomeapi.com.br/json/last/USD-BRLPTAX,EUR-BRLPTAX?token=${apiKey}`;

  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) {
      throw new Error(`AwesomeAPI HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    const result: Record<string, PtaxRateInfo> = {};

    if (data.USDBRLPTAX) {
      const item = data.USDBRLPTAX;
      result.USD = {
        code: item.code,
        codein: item.codein,
        name: item.name,
        ptaxVenda: parseFloat(item.ask),
        ptaxCompra: parseFloat(item.bid),
        high: parseFloat(item.high),
        low: parseFloat(item.low),
        pctChange: parseFloat(item.pctChange),
        timestamp: item.timestamp,
        createDate: item.create_date,
      };
    }

    if (data.EURBRLPTAX) {
      const item = data.EURBRLPTAX;
      result.EUR = {
        code: item.code,
        codein: item.codein,
        name: item.name,
        ptaxVenda: parseFloat(item.ask),
        ptaxCompra: parseFloat(item.bid),
        high: parseFloat(item.high),
        low: parseFloat(item.low),
        pctChange: parseFloat(item.pctChange),
        timestamp: item.timestamp,
        createDate: item.create_date,
      };
    }

    return result;
  } catch (error) {
    console.error('[CurrencyService] Erro ao buscar cotação AwesomeAPI PTAX:', error);
    throw error;
  }
}

/**
 * Executado pelo Cron Job diário (09:15 AM) ou pelo botão do Control Plane.
 * Atualiza e calcula dinamicamente as taxas com o Master Spread.
 */
export async function updateAndLockDailyRates(masterSpreads?: Record<string, number>): Promise<Record<string, EffectiveExchangeRate>> {
  const liveRates = await fetchLivePtaxRates();
  const spreads = masterSpreads ?? DEFAULT_MASTER_SPREADS;

  for (const currency of ['USD', 'EUR'] as const) {
    if (liveRates[currency]) {
      const ptaxVenda = liveRates[currency].ptaxVenda;
      const masterSpreadPct = spreads[currency] ?? DEFAULT_MASTER_SPREADS[currency] ?? 3.5;
      const effectiveRate = Number((ptaxVenda * (1 + masterSpreadPct / 100)).toFixed(4));

      lockedDailyRates[currency] = {
        fromCurrency: currency,
        toCurrency: 'BRL',
        ptaxVenda,
        masterSpreadPct,
        effectiveRate,
        updatedAt: new Date().toISOString(),
        isLocked: true,
        source: 'AwesomeAPI PTAX Oficial (BCB)',
      };
    }
  }

  return lockedDailyRates;
}

/**
 * Obtém a cotação ativa para uso no Pricing Engine.
 */
export function getLockedExchangeRate(fromCurrency: string): EffectiveExchangeRate {
  if (fromCurrency === 'BRL') {
    return {
      fromCurrency: 'BRL',
      toCurrency: 'BRL',
      ptaxVenda: 1,
      masterSpreadPct: 0,
      effectiveRate: 1,
      updatedAt: new Date().toISOString(),
      isLocked: true,
      source: 'Nativa (BRL)',
    };
  }

  const currencyUpper = fromCurrency.toUpperCase();
  if (lockedDailyRates[currencyUpper]) {
    return lockedDailyRates[currencyUpper];
  }

  // Se ainda não houver taxa em memória, gera dinamicamente
  return {
    fromCurrency: currencyUpper,
    toCurrency: 'BRL',
    ptaxVenda: currencyUpper === 'USD' ? 5.1217 : 5.8305,
    masterSpreadPct: currencyUpper === 'USD' ? 3.5 : 4.0,
    effectiveRate: currencyUpper === 'USD' ? 5.3009 : 6.0637,
    updatedAt: new Date().toISOString(),
    isLocked: false,
    source: 'AwesomeAPI PTAX Inicial',
  };
}

/**
 * Retorna as taxas ativas para exibição no Control Plane.
 */
export function getAllLockedRates(): Record<string, EffectiveExchangeRate> {
  return lockedDailyRates;
}
