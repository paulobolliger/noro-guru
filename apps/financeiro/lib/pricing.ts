import { TipoMarkup, RegraPreco } from '../types/pricing'

/**
 * Calcula o markup final com base em uma lista de regras
 */
export function calcularMarkupFinal(
  valorCusto: number,
  markupBase: number,
  tipoMarkupBase: TipoMarkup,
  regras: RegraPreco[],
  data: Date = new Date()
): {
  markup: number
  tipo: TipoMarkup
  regrasAplicadas: {
    tipo: string
    valor: number
    descricao: string
  }[]
  justificativa: string
} {
  let markupFinal = markupBase
  let tipoFinal = tipoMarkupBase
  const regrasAplicadas = []

  // Registra markup base
  regrasAplicadas.push({
    tipo: 'markup_padrao',
    valor: markupBase,
    descricao: `Markup base de ${markupBase}%`
  })

  // Ordena regras por prioridade (maior primeiro)
  const regrasPriorizadas = [...regras].sort((a, b) => b.prioridade - a.prioridade)

  // Aplica cada regra
  for (const regra of regrasPriorizadas) {
    // Verifica condições de aplicação
    if (!verificarCondicoesRegra(regra, valorCusto, data)) {
      continue
    }

    // Se regra deve sobrepor, reseta markup
    if (regra.sobrepor_regras) {
      markupFinal = regra.valor_markup
      tipoFinal = regra.tipo_markup
      regrasAplicadas.length = 0 // Limpa regras anteriores
    } else {
      // Ajusta markup conforme tipo
      if (regra.tipo_markup === 'percentual') {
        markupFinal += regra.valor_markup
      } else if (regra.tipo_markup === 'fixo') {
        // Converte valor fixo para percentual equivalente
        markupFinal += (regra.valor_markup / valorCusto * 100)
      }
    }

    // Registra regra aplicada
    regrasAplicadas.push({
      tipo: regra.tipo,
      valor: regra.valor_markup,
      descricao: regra.descricao || `${regra.nome}: ${regra.valor_markup}%`
    })
  }

  return {
    markup: markupFinal,
    tipo: tipoFinal,
    regrasAplicadas,
    justificativa: `Markup final de ${markupFinal.toFixed(2)}% calculado com base em ${regrasAplicadas.length} regras.`
  }
}

/**
 * Verifica se uma regra deve ser aplicada com base nas condições
 */
function verificarCondicoesRegra(
  regra: RegraPreco,
  valorCusto: number,
  data: Date
): boolean {
  // Verifica valor mínimo
  if (regra.valor_minimo && valorCusto < regra.valor_minimo) {
    return false
  }

  // Verifica valor máximo
  if (regra.valor_maximo && valorCusto > regra.valor_maximo) {
    return false
  }

  // Verifica data início
  if (regra.data_inicio && new Date(regra.data_inicio) > data) {
    return false
  }

  // Verifica data fim
  if (regra.data_fim && new Date(regra.data_fim) < data) {
    return false
  }

  return true
}

/**
 * Calcula o preço final com base no custo e markup
 */
export function calcularPrecoFinal(
  valorCusto: number,
  markup: number,
  tipoMarkup: TipoMarkup
): {
  valorFinal: number
  valorMarkup: number
  margemLucro: number
  margemPercentual: number
} {
  let valorMarkup: number
  let valorFinal: number

  if (tipoMarkup === 'percentual') {
    valorMarkup = valorCusto * (markup / 100)
    valorFinal = valorCusto + valorMarkup
  } else if (tipoMarkup === 'fixo') {
    valorMarkup = markup
    valorFinal = valorCusto + valorMarkup
  } else {
    // Para tipos dinâmico/personalizado, assume percentual
    valorMarkup = valorCusto * (markup / 100)
    valorFinal = valorCusto + valorMarkup
  }

  const margemLucro = valorFinal - valorCusto
  const margemPercentual = (margemLucro / valorFinal) * 100

  return {
    valorFinal,
    valorMarkup,
    margemLucro,
    margemPercentual
  }
}

/**
 * Formata um valor monetário
 */
export function formatarMoeda(
  valor: number,
  moeda: string = 'EUR',
  locale: string = 'pt-BR'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: moeda
  }).format(valor)
}

/**
 * Formata uma porcentagem
 */
export function formatarPorcentagem(
  valor: number,
  casasDecimais: number = 2,
  locale: string = 'pt-BR'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: casasDecimais,
    maximumFractionDigits: casasDecimais
  }).format(valor / 100)
}