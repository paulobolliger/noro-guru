// lib/utils/cost-calculator.ts

/**
 * Custos aproximados por 1M tokens (em USD)
 * GPT-4: Input $30/1M, Output $60/1M
 * GPT-3.5: Input $1.50/1M, Output $2/1M
 */
const COSTS = {
  GPT4: {
    input: 30 / 1_000_000,
    output: 60 / 1_000_000,
  },
  GPT35: {
    input: 1.5 / 1_000_000,
    output: 2 / 1_000_000,
  },
};

export interface CostEstimate {
  inputTokens: number;
  outputTokens: number;
  estimatedInputCost: number;
  estimatedOutputCost: number;
  estimatedTotalCost: number;
}

/**
 * Estima o custo de uma geração de IA
 * @param items Número de itens a gerar
 * @param avgTokensPerItem Média de tokens por item (input + output)
 * @param useGPT4 Se deve usar GPT-4 (true) ou GPT-3.5 (false)
 * @returns Estimativa de custo
 */
export function estimateCost(
  items: number,
  avgTokensPerItem: number = 1000,
  useGPT4: boolean = true
): CostEstimate {
  const model = useGPT4 ? COSTS.GPT4 : COSTS.GPT35;

  // Estima que 30% é input e 70% é output
  const totalTokens = items * avgTokensPerItem;
  const inputTokens = Math.floor(totalTokens * 0.3);
  const outputTokens = Math.floor(totalTokens * 0.7);

  const estimatedInputCost = inputTokens * model.input;
  const estimatedOutputCost = outputTokens * model.output;
  const estimatedTotalCost = estimatedInputCost + estimatedOutputCost;

  return {
    inputTokens,
    outputTokens,
    estimatedInputCost,
    estimatedOutputCost,
    estimatedTotalCost,
  };
}

/**
 * Formata o custo em USD com 2 casas decimais
 * @param cost Custo em USD
 * @returns String formatada (ex: "$0.50")
 */
export function formatCost(cost: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(cost);
}

/**
 * Calcula o custo real baseado em tokens consumidos
 * @param inputTokens Tokens de input
 * @param outputTokens Tokens de output
 * @param useGPT4 Se usou GPT-4 (true) ou GPT-3.5 (false)
 * @returns Custo real em USD
 */
export function calculateActualCost(
  inputTokens: number,
  outputTokens: number,
  useGPT4: boolean = true
): number {
  const model = useGPT4 ? COSTS.GPT4 : COSTS.GPT35;
  return (inputTokens * model.input) + (outputTokens * model.output);
}
