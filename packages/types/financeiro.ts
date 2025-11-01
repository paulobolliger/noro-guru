/**
 * Tipos TypeScript para o Módulo Financeiro NORO
 * Sincronizado com o schema do Supabase
 */

// ==============================================
// ENUMS
// ==============================================

export type Moeda = 'BRL' | 'USD' | 'EUR' | 'GBP' | 'AUD' | 'CAD';
export type Marca = 'nomade' | 'safetrip' | 'vistos' | 'noro';
export type TipoContaBancaria = 'corrente' | 'poupanca' | 'investimento' | 'internacional';
export type StatusFinanceiro = 'pendente' | 'pago' | 'cancelado' | 'atrasado';
export type TipoReceita = 'servico' | 'produto' | 'comissao' | 'recorrente' | 'outro';
export type TipoDespesa = 'fixa' | 'variavel' | 'operacional' | 'marketing' | 'fornecedor' | 'salario' | 'outro';
export type FormaPagamento = 'pix' | 'cartao_credito' | 'cartao_debito' | 'boleto' | 'transferencia' | 'internacional';
export type GatewayPagamento = 'stripe' | 'cielo' | 'paypal' | 'remessa_online' | 'wise';
export type FrequenciaRecorrencia = 'mensal' | 'trimestral' | 'semestral' | 'anual';
export type TipoTransacao = 'entrada' | 'saida' | 'transferencia';
export type StatusTransacao = 'pendente' | 'efetivada' | 'cancelada';
export type TipoPlanoContas = 'ativo' | 'passivo' | 'receita' | 'despesa' | 'patrimonio_liquido';
export type TipoCategoria = 'receita' | 'despesa';
export type CenarioProjecao = 'otimista' | 'realista' | 'pessimista';
export type CentroCusto = 'infraestrutura' | 'marketing' | 'operacional' | 'administrativo';

// ==============================================
// CONTAS BANCÁRIAS
// ==============================================

export interface FinContaBancaria {
  id: string;
  tenant_id: string;
  marca: Marca;
  nome: string;
  tipo: TipoContaBancaria;
  banco: string;
  agencia?: string | null;
  conta?: string | null;
  moeda: Moeda;
  saldo_inicial: number;
  saldo_atual: number;
  ativo: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface FinContaBancariaInsert extends Omit<FinContaBancaria, 'id' | 'saldo_atual' | 'created_at' | 'updated_at'> {}
export interface FinContaBancariaUpdate extends Partial<FinContaBancariaInsert> {}

// ==============================================
// CATEGORIAS FINANCEIRAS
// ==============================================

export interface FinCategoria {
  id: string;
  tenant_id: string;
  nome: string;
  tipo: TipoCategoria;
  categoria_pai_id?: string | null;
  cor?: string | null;
  icone?: string | null;
  ordem: number;
  ativo: boolean;
  created_at: string;
}

export interface FinCategoriaInsert extends Omit<FinCategoria, 'id' | 'created_at'> {}
export interface FinCategoriaUpdate extends Partial<FinCategoriaInsert> {}

// ==============================================
// RECEITAS
// ==============================================

export interface FinReceita {
  id: string;
  tenant_id: string;
  marca: Marca;
  descricao: string;
  categoria_id?: string | null;
  valor: number;
  moeda: Moeda;
  taxa_cambio: number;
  valor_brl: number; // Computed field
  tipo_receita: TipoReceita;
  
  // Relacionamentos
  cliente_id?: string | null;
  orcamento_id?: string | null;
  pedido_id?: string | null;
  
  // Controle financeiro
  status: StatusFinanceiro;
  data_vencimento: string; // ISO date
  data_pagamento?: string | null;
  data_competencia: string;
  
  forma_pagamento?: FormaPagamento | null;
  gateway_pagamento?: GatewayPagamento | null;
  transaction_id?: string | null;
  
  conta_bancaria_id?: string | null;
  
  // Comissões
  possui_comissao: boolean;
  valor_comissao?: number | null;
  percentual_comissao?: number | null;
  fornecedor_comissao_id?: string | null;
  
  // Recorrência
  recorrente: boolean;
  frequencia_recorrencia?: FrequenciaRecorrencia | null;
  proximo_vencimento?: string | null;
  
  // Notas e documentos
  nota_fiscal?: string | null;
  recibo_url?: string | null;
  observacoes?: string | null;
  
  // Auditoria
  created_by?: string | null;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface FinReceitaInsert extends Omit<FinReceita, 'id' | 'valor_brl' | 'created_at' | 'updated_at'> {}
export interface FinReceitaUpdate extends Partial<FinReceitaInsert> {}

// ==============================================
// DESPESAS
// ==============================================

export interface FinDespesa {
  id: string;
  tenant_id: string;
  marca: Marca;
  descricao: string;
  categoria_id?: string | null;
  valor: number;
  moeda: Moeda;
  taxa_cambio: number;
  valor_brl: number; // Computed field
  tipo_despesa: TipoDespesa;
  
  // Relacionamentos
  fornecedor_id?: string | null;
  pedido_id?: string | null;
  
  // Controle financeiro
  status: StatusFinanceiro;
  data_vencimento: string;
  data_pagamento?: string | null;
  data_competencia: string;
  
  forma_pagamento?: FormaPagamento | null;
  conta_bancaria_id?: string | null;
  
  // Centro de custo
  centro_custo?: CentroCusto | null;
  projeto_associado?: string | null;
  
  // Recorrência
  recorrente: boolean;
  frequencia_recorrencia?: FrequenciaRecorrencia | null;
  proximo_vencimento?: string | null;
  
  // Documentos
  nota_fiscal?: string | null;
  comprovante_url?: string | null;
  observacoes?: string | null;
  
  // Auditoria
  created_by?: string | null;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface FinDespesaInsert extends Omit<FinDespesa, 'id' | 'valor_brl' | 'created_at' | 'updated_at'> {}
export interface FinDespesaUpdate extends Partial<FinDespesaInsert> {}

// ==============================================
// TRANSAÇÕES (FLUXO DE CAIXA)
// ==============================================

export interface FinTransacao {
  id: string;
  tenant_id: string;
  marca: Marca;
  tipo: TipoTransacao;
  descricao: string;
  valor: number;
  moeda: Moeda;
  
  conta_origem_id?: string | null;
  conta_destino_id?: string | null;
  
  receita_id?: string | null;
  despesa_id?: string | null;
  
  categoria_id?: string | null;
  
  data_transacao: string;
  data_competencia: string;
  
  status: StatusTransacao;
  
  observacoes?: string | null;
  metadata: Record<string, any>;
  
  created_by?: string | null;
  created_at: string;
}

export interface FinTransacaoInsert extends Omit<FinTransacao, 'id' | 'created_at'> {}
export interface FinTransacaoUpdate extends Partial<FinTransacaoInsert> {}

// ==============================================
// PLANO DE CONTAS
// ==============================================

export interface FinPlanoContas {
  id: string;
  tenant_id: string;
  codigo: string; // Ex: "1.1.01.001"
  nome: string;
  tipo: TipoPlanoContas;
  nivel: number;
  conta_pai_id?: string | null;
  aceita_lancamento: boolean;
  ativo: boolean;
  created_at: string;
}

export interface FinPlanoContasInsert extends Omit<FinPlanoContas, 'id' | 'created_at'> {}
export interface FinPlanoContasUpdate extends Partial<FinPlanoContasInsert> {}

// ==============================================
// COMISSÕES
// ==============================================

export interface FinComissao {
  id: string;
  tenant_id: string;
  receita_id: string;
  fornecedor_id?: string | null;
  
  percentual: number;
  valor_comissao: number;
  moeda: Moeda;
  
  status: StatusFinanceiro;
  data_vencimento?: string | null;
  data_pagamento?: string | null;
  
  observacoes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface FinComissaoInsert extends Omit<FinComissao, 'id' | 'created_at' | 'updated_at'> {}
export interface FinComissaoUpdate extends Partial<FinComissaoInsert> {}

// ==============================================
// PROJEÇÕES
// ==============================================

export interface FinProjecao {
  id: string;
  tenant_id: string;
  marca: Marca;
  mes_referencia: string; // Primeiro dia do mês
  
  receita_prevista: number;
  despesa_prevista: number;
  saldo_previsto: number; // Computed field
  
  receita_realizada: number;
  despesa_realizada: number;
  saldo_realizado: number; // Computed field
  
  cenario: CenarioProjecao;
  
  observacoes?: string | null;
  metadata: Record<string, any>;
  
  created_at: string;
  updated_at: string;
}

export interface FinProjecaoInsert extends Omit<FinProjecao, 'id' | 'saldo_previsto' | 'saldo_realizado' | 'created_at' | 'updated_at'> {}
export interface FinProjecaoUpdate extends Partial<FinProjecaoInsert> {}

// ==============================================
// VIEWS (somente leitura)
// ==============================================

export interface FinResumoMarca {
  marca: Marca;
  mes: string;
  receita_realizada: number;
  despesa_realizada: number;
  lucro: number;
}

export interface FinContaReceber {
  id: string;
  marca: Marca;
  descricao: string;
  valor: number;
  data_vencimento: string;
  status_real: StatusFinanceiro;
  dias_atraso: number;
  cliente_id?: string | null;
  forma_pagamento?: FormaPagamento | null;
}

export interface FinContaPagar {
  id: string;
  marca: Marca;
  descricao: string;
  valor: number;
  data_vencimento: string;
  status_real: StatusFinanceiro;
  dias_atraso: number;
  fornecedor_id?: string | null;
  forma_pagamento?: FormaPagamento | null;
}

// ==============================================
// KPIs E MÉTRICAS
// ==============================================

export interface FinKPIs {
  // Receitas
  mrr: number; // Monthly Recurring Revenue
  arr: number; // Annual Recurring Revenue
  receita_total_mes: number;
  receita_total_ano: number;
  ticket_medio: number;
  
  // Despesas
  despesa_total_mes: number;
  despesa_total_ano: number;
  custo_aquisicao_cliente: number; // CAC
  
  // Lucratividade
  margem_lucro: number; // %
  lucro_liquido_mes: number;
  lucro_liquido_ano: number;
  ebitda: number;
  
  // Fluxo de caixa
  saldo_atual: number;
  projecao_30_dias: number;
  projecao_60_dias: number;
  projecao_90_dias: number;
  
  // Clientes
  ltv: number; // Lifetime Value
  churn_rate: number; // %
  
  // Contas
  contas_receber: number;
  contas_pagar: number;
  contas_atrasadas_receber: number;
  contas_atrasadas_pagar: number;
}

// ==============================================
// FILTROS E QUERIES
// ==============================================

export interface FinFiltros {
  marca?: Marca | Marca[];
  data_inicio?: string;
  data_fim?: string;
  status?: StatusFinanceiro | StatusFinanceiro[];
  categoria_id?: string | string[];
  cliente_id?: string;
  fornecedor_id?: string;
  forma_pagamento?: FormaPagamento | FormaPagamento[];
  moeda?: Moeda | Moeda[];
  tipo?: TipoReceita | TipoDespesa | TipoTransacao;
  recorrente?: boolean;
  centro_custo?: CentroCusto;
}

export interface FinRelatorioParams {
  tipo: 'receitas' | 'despesas' | 'fluxo_caixa' | 'dre' | 'balanco';
  periodo: {
    inicio: string;
    fim: string;
  };
  agrupamento?: 'dia' | 'semana' | 'mes' | 'trimestre' | 'ano';
  marcas?: Marca[];
  categorias?: string[];
  formato?: 'json' | 'csv' | 'pdf';
}

// ==============================================
// INTERFACES DE INTEGRAÇÃO
// ==============================================

export interface StripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  customer?: string;
  metadata: Record<string, any>;
}

export interface RemessaOnlineQuote {
  id: string;
  from_currency: string;
  to_currency: string;
  rate: number;
  amount: number;
  converted_amount: number;
  expires_at: string;
}

export interface NFe {
  numero: string;
  serie: string;
  data_emissao: string;
  valor: number;
  chave_acesso: string;
  xml_url: string;
  pdf_url: string;
  status: 'emitida' | 'cancelada' | 'inutilizada';
}

// ==============================================
// UTILITIES
// ==============================================

export interface FinDashboardCard {
  titulo: string;
  valor: number;
  moeda: Moeda;
  variacao?: number; // % em relação ao período anterior
  tendencia?: 'alta' | 'baixa' | 'estavel';
  icone?: string;
  cor?: string;
}

export interface FinChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }[];
}

// ==============================================
// CENTRO DE CUSTOS E PROJETOS
// ==============================================

export type TipoCentroCusto = 'viagem' | 'grupo' | 'cliente' | 'projeto' | 'evento' | 'outros';
export type StatusCentroCusto = 'planejamento' | 'ativo' | 'concluido' | 'cancelado';
export type TipoRateio = 'percentual' | 'valor_fixo' | 'proporcional';

export interface FinCentroCusto {
  id: string;
  tenant_id: string;
  
  // Identificação
  codigo: string; // Ex: "RIO-OUT-25", "GRUPO-ARGENTINA-123"
  nome: string;
  descricao?: string | null;
  
  // Classificação
  tipo: TipoCentroCusto;
  marca?: Marca | null;
  
  // Período
  data_inicio: string; // ISO Date
  data_fim?: string | null;
  
  // Financeiro
  orcamento_previsto: number;
  moeda: Moeda;
  
  // Metas
  meta_margem_percentual: number; // Default 15%
  meta_receita?: number | null;
  
  // Status
  status: StatusCentroCusto;
  
  // Responsáveis
  responsavel_id?: string | null;
  equipe?: string[] | null; // Array de user_ids
  
  // Metadados
  tags?: string[] | null;
  metadata?: Record<string, any> | null;
  
  // Auditoria
  created_at: string;
  updated_at: string;
  created_by?: string | null;
}

export interface FinCentroCustoInsert extends Omit<FinCentroCusto, 'id' | 'created_at' | 'updated_at'> {}
export interface FinCentroCustoUpdate extends Partial<FinCentroCustoInsert> {}

export interface FinAlocacao {
  id: string;
  tenant_id: string;
  
  // Relacionamentos
  centro_custo_id: string;
  receita_id?: string | null;
  despesa_id?: string | null;
  
  // Rateio
  tipo_rateio: TipoRateio;
  percentual_alocacao?: number | null; // 0-100%
  valor_alocado: number; // Valor em BRL
  
  // Detalhes
  observacoes?: string | null;
  data_alocacao: string; // ISO Date
  
  // Auditoria
  created_at: string;
  updated_at: string;
  created_by?: string | null;
}

export interface FinAlocacaoInsert extends Omit<FinAlocacao, 'id' | 'created_at' | 'updated_at'> {}
export interface FinAlocacaoUpdate extends Partial<FinAlocacaoInsert> {}

// View de Rentabilidade
export interface FinRentabilidadeCentroCusto {
  id: string;
  tenant_id: string;
  codigo: string;
  nome: string;
  tipo: TipoCentroCusto;
  marca?: Marca | null;
  status: StatusCentroCusto;
  data_inicio: string;
  data_fim?: string | null;
  orcamento_previsto: number;
  meta_margem_percentual: number;
  meta_receita?: number | null;
  
  // Valores calculados
  receitas_total: number;
  despesas_total: number;
  margem_liquida: number;
  margem_percentual: number;
  saldo_orcamento: number;
  percentual_orcamento_utilizado: number;
  
  // Contadores
  qtd_receitas: number;
  qtd_despesas: number;
  
  created_at: string;
  updated_at: string;
}

// Relatório detalhado de rentabilidade
export interface FinRelatorioRentabilidade {
  centro_custo: FinCentroCusto;
  rentabilidade: FinRentabilidadeCentroCusto;
  
  // Detalhamento
  receitas: Array<{
    id: string;
    descricao: string;
    valor: number;
    valor_alocado: number;
    percentual_alocacao?: number;
    data_competencia: string;
    status: StatusFinanceiro;
  }>;
  
  despesas: Array<{
    id: string;
    descricao: string;
    valor: number;
    valor_alocado: number;
    percentual_alocacao?: number;
    data_competencia: string;
    status: StatusFinanceiro;
    categoria?: string;
  }>;
  
  // Análises
  composicao_custos: Array<{
    categoria: string;
    valor: number;
    percentual: number;
  }>;
  
  maiores_despesas: Array<{
    descricao: string;
    valor: number;
    categoria?: string;
  }>;
  
  // Comparativos
  comparativo_orcamento: {
    previsto: number;
    realizado: number;
    diferenca: number;
    percentual_execucao: number;
  };
  
  comparativo_meta: {
    meta_margem: number;
    margem_atual: number;
    diferenca: number;
    atingiu_meta: boolean;
  };
}

// Análise de IA
export interface FinAnaliseIA {
  centro_custo_id: string;
  data_analise: string;
  
  // Alertas
  alertas: Array<{
    tipo: 'margem_baixa' | 'orcamento_estourado' | 'meta_nao_atingida' | 'custo_alto';
    severidade: 'baixa' | 'media' | 'alta' | 'critica';
    titulo: string;
    descricao: string;
    valor_impacto?: number;
  }>;
  
  // Insights
  insights: Array<{
    tipo: 'cambio' | 'fornecedor' | 'sazonalidade' | 'categoria';
    titulo: string;
    descricao: string;
    recomendacao?: string;
  }>;
  
  // Previsões
  previsao_margem_final: number;
  confianca_previsao: number; // 0-100%
  risco_nivel: 'baixo' | 'medio' | 'alto';
  
  // Comparações
  comparacao_projetos_similares?: {
    media_margem: number;
    melhor_margem: number;
    posicao_ranking: number;
  };
}

// ==============================================
// CONTAS A PAGAR/RECEBER AVANÇADO
// ==============================================

// Enums para Duplicatas
export type FinStatusDuplicata = 'aberta' | 'parcialmente_recebida' | 'recebida' | 'vencida' | 'cancelada' | 'protestada' | 'negociacao';

export type FinTipoCondicaoPagamento = 
  | 'a_vista'
  | 'd_plus_15'
  | 'd_plus_30'
  | 'd_plus_45'
  | 'd_plus_60'
  | 'apos_checkout'
  | 'apos_embarque'
  | 'entrada_mais_parcelas'
  | 'personalizado';

export type FinReferenciaData = 'emissao' | 'checkout' | 'embarque' | 'entrega' | 'personalizada';

export type FinTipoAdiantamento = 'pagamento_antecipado' | 'deposito_garantia' | 'sinal' | 'credito_prepago';
export type FinStatusAdiantamento = 'ativo' | 'parcialmente_utilizado' | 'totalmente_utilizado' | 'cancelado' | 'expirado';

export type FinTipoCredito = 'refund' | 'overpayment' | 'desconto_fornecedor' | 'credito_futuro' | 'estorno' | 'devolucao';
export type FinStatusCredito = 'disponivel' | 'parcialmente_utilizado' | 'totalmente_utilizado' | 'expirado' | 'cancelado';

export type FinTipoLembrete = 'vencimento_proximo' | 'vencido' | 'cobranca' | 'confirmacao_pagamento';
export type FinCanalNotificacao = 'email' | 'whatsapp' | 'sms' | 'webhook';

// Condições de Pagamento
export interface FinCondicaoPagamento {
  id: string;
  tenant_id: string;
  
  nome: string;
  codigo?: string | null;
  tipo: FinTipoCondicaoPagamento;
  
  dias_vencimento: number;
  referencia_data: FinReferenciaData;
  numero_parcelas: number;
  intervalo_parcelas: number;
  
  percentual_desconto_antecipacao?: number | null;
  percentual_juros_atraso?: number | null;
  
  descricao?: string | null;
  ativo: boolean;
  
  created_at: string;
  updated_at: string;
}

export interface FinCondicaoPagamentoInsert extends Omit<FinCondicaoPagamento, 'id' | 'created_at' | 'updated_at'> {}
export interface FinCondicaoPagamentoUpdate extends Partial<FinCondicaoPagamentoInsert> {}

// Duplicatas a Receber
export interface FinDuplicataReceber {
  id: string;
  tenant_id: string;
  marca: Marca;
  
  // Identificação
  numero_duplicata: string;
  numero_nota_fiscal?: string | null;
  serie_nota_fiscal?: string | null;
  chave_acesso_nfe?: string | null;
  
  // Relacionamentos
  cliente_id?: string | null;
  fornecedor_intermediario_id?: string | null;
  reserva_id?: string | null;
  pedido_id?: string | null;
  orcamento_id?: string | null;
  condicao_pagamento_id?: string | null;
  
  // Valores
  valor_original: number;
  valor_desconto: number;
  valor_juros: number;
  valor_total: number;
  valor_recebido: number;
  valor_pendente: number;
  
  moeda: Moeda;
  taxa_cambio: number;
  valor_brl: number;
  
  // Datas
  data_emissao: string; // ISO date
  data_vencimento: string;
  data_recebimento?: string | null;
  data_referencia?: string | null;
  
  // Status
  status: FinStatusDuplicata;
  dias_atraso: number;
  
  // Dados do Cliente (cache)
  cliente_nome?: string | null;
  cliente_documento?: string | null;
  cliente_email?: string | null;
  cliente_telefone?: string | null;
  
  // Observações
  observacoes?: string | null;
  condicao_pagamento_texto?: string | null;
  documento_url?: string | null;
  xml_nfe_url?: string | null;
  
  // Auditoria
  created_by?: string | null;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface FinDuplicataReceberInsert extends Omit<FinDuplicataReceber, 'id' | 'valor_brl' | 'valor_pendente' | 'dias_atraso' | 'created_at' | 'updated_at'> {}
export interface FinDuplicataReceberUpdate extends Partial<FinDuplicataReceberInsert> {}

// Duplicatas a Pagar
export interface FinDuplicataPagar {
  id: string;
  tenant_id: string;
  marca: Marca;
  
  // Identificação
  numero_duplicata: string;
  numero_nota_fiscal?: string | null;
  serie_nota_fiscal?: string | null;
  chave_acesso_nfe?: string | null;
  
  // Relacionamentos
  fornecedor_id: string;
  reserva_id?: string | null;
  pedido_id?: string | null;
  condicao_pagamento_id?: string | null;
  adiantamento_id?: string | null;
  
  // Valores
  valor_original: number;
  valor_desconto: number;
  valor_juros: number;
  valor_total: number;
  valor_pago: number;
  valor_pendente: number;
  valor_credito_aplicado: number;
  
  moeda: Moeda;
  taxa_cambio: number;
  valor_brl: number;
  
  // Datas
  data_emissao: string;
  data_vencimento: string;
  data_pagamento?: string | null;
  data_referencia?: string | null;
  
  // Status
  status: FinStatusDuplicata;
  dias_vencimento: number;
  
  // Dados do Fornecedor (cache)
  fornecedor_nome?: string | null;
  fornecedor_documento?: string | null;
  fornecedor_email?: string | null;
  fornecedor_telefone?: string | null;
  
  // Controle de Pagamento
  forma_pagamento?: FormaPagamento | null;
  conta_bancaria_id?: string | null;
  comprovante_pagamento_url?: string | null;
  
  // Observações
  observacoes?: string | null;
  condicao_pagamento_texto?: string | null;
  documento_url?: string | null;
  xml_nfe_url?: string | null;
  
  // Auditoria
  created_by?: string | null;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface FinDuplicataPagarInsert extends Omit<FinDuplicataPagar, 'id' | 'valor_brl' | 'valor_pendente' | 'dias_vencimento' | 'created_at' | 'updated_at'> {}
export interface FinDuplicataPagarUpdate extends Partial<FinDuplicataPagarInsert> {}

// Parcelas
export interface FinParcela {
  id: string;
  tenant_id: string;
  
  duplicata_receber_id?: string | null;
  duplicata_pagar_id?: string | null;
  
  numero_parcela: number;
  valor: number;
  valor_pago: number;
  
  data_vencimento: string;
  data_pagamento?: string | null;
  
  status: FinStatusDuplicata;
  observacoes?: string | null;
  
  created_at: string;
  updated_at: string;
}

export interface FinParcelaInsert extends Omit<FinParcela, 'id' | 'created_at' | 'updated_at'> {}
export interface FinParcelaUpdate extends Partial<FinParcelaInsert> {}

// Adiantamentos
export interface FinAdiantamento {
  id: string;
  tenant_id: string;
  marca: Marca;
  
  numero_adiantamento: string;
  tipo: FinTipoAdiantamento;
  
  fornecedor_id: string;
  fornecedor_nome?: string | null;
  reserva_id?: string | null;
  
  valor_original: number;
  valor_utilizado: number;
  valor_disponivel: number;
  
  moeda: Moeda;
  taxa_cambio: number;
  
  data_pagamento: string;
  data_expiracao?: string | null;
  
  status: FinStatusAdiantamento;
  
  forma_pagamento?: FormaPagamento | null;
  conta_bancaria_id?: string | null;
  comprovante_pagamento_url?: string | null;
  
  observacoes?: string | null;
  condicoes_uso?: string | null;
  
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface FinAdiantamentoInsert extends Omit<FinAdiantamento, 'id' | 'valor_disponivel' | 'status' | 'created_at' | 'updated_at'> {}
export interface FinAdiantamentoUpdate extends Partial<FinAdiantamentoInsert> {}

// Créditos
export interface FinCredito {
  id: string;
  tenant_id: string;
  marca: Marca;
  
  numero_credito: string;
  tipo_credito: FinTipoCredito;
  
  fornecedor_id: string;
  fornecedor_nome?: string | null;
  duplicata_origem_id?: string | null;
  reserva_id?: string | null;
  
  valor_original: number;
  valor_utilizado: number;
  valor_disponivel: number;
  
  moeda: Moeda;
  taxa_cambio: number;
  
  data_recebimento: string;
  data_expiracao?: string | null;
  
  status: FinStatusCredito;
  
  motivo: string;
  documento_referencia?: string | null;
  comprovante_url?: string | null;
  
  observacoes?: string | null;
  
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface FinCreditoInsert extends Omit<FinCredito, 'id' | 'valor_disponivel' | 'status' | 'created_at' | 'updated_at'> {}
export interface FinCreditoUpdate extends Partial<FinCreditoInsert> {}

// Utilizações
export interface FinUtilizacao {
  id: string;
  tenant_id: string;
  
  adiantamento_id?: string | null;
  credito_id?: string | null;
  duplicata_pagar_id?: string | null;
  
  valor_utilizado: number;
  data_utilizacao: string;
  
  observacoes?: string | null;
  
  created_by?: string | null;
  created_at: string;
}

export interface FinUtilizacaoInsert extends Omit<FinUtilizacao, 'id' | 'created_at'> {}

// Lembretes
export interface FinLembrete {
  id: string;
  tenant_id: string;
  
  duplicata_receber_id?: string | null;
  duplicata_pagar_id?: string | null;
  
  tipo_lembrete: FinTipoLembrete;
  dias_antecedencia: number;
  canais: FinCanalNotificacao[];
  
  destinatario_nome?: string | null;
  destinatario_email?: string | null;
  destinatario_telefone?: string | null;
  
  programado_para: string;
  enviado_em?: string | null;
  status: string;
  erro_mensagem?: string | null;
  
  assunto?: string | null;
  mensagem?: string | null;
  
  created_at: string;
}

export interface FinLembreteInsert extends Omit<FinLembrete, 'id' | 'created_at'> {}

// Views - Saldos
export interface FinSaldoAdiantamento {
  tenant_id: string;
  fornecedor_id: string;
  fornecedor_nome: string;
  total_adiantamentos: number;
  valor_total_adiantado: number;
  valor_total_utilizado: number;
  saldo_disponivel: number;
  adiantamentos_ativos: number;
}

export interface FinSaldoCredito {
  tenant_id: string;
  fornecedor_id: string;
  fornecedor_nome: string;
  total_creditos: number;
  valor_total_creditos: number;
  valor_total_utilizado: number;
  saldo_disponivel: number;
  total_refunds: number;
  total_overpayments: number;
}

// Views - Aging
export interface FinAgingReceber {
  tenant_id: string;
  marca: Marca;
  total_duplicatas: number;
  total_pendente: number;
  a_vencer: number;
  valor_a_vencer: number;
  vencidas_30: number;
  valor_vencidas_30: number;
  vencidas_60: number;
  valor_vencidas_60: number;
  vencidas_90: number;
  valor_vencidas_90: number;
  vencidas_90_plus: number;
  valor_vencidas_90_plus: number;
}

export interface FinAgingPagar {
  tenant_id: string;
  marca: Marca;
  total_duplicatas: number;
  total_pendente: number;
  a_vencer: number;
  valor_a_vencer: number;
  vencidas_30: number;
  valor_vencidas_30: number;
  vencidas_60: number;
  valor_vencidas_60: number;
  vencidas_60_plus: number;
  valor_vencidas_60_plus: number;
}

// View - Fluxo de Caixa Projetado
export interface FinFluxoCaixaProjetado {
  tenant_id: string;
  marca: Marca;
  data: string;
  entradas: number;
  saidas: number;
  saldo_dia: number;
  saldo_acumulado: number;
}

// View - Status Financeiro por Reserva
export interface FinFinanceiroReserva {
  reserva_id: string;
  tenant_id: string;
  marca: Marca;
  
  total_duplicatas_receber: number;
  valor_total_receber: number;
  valor_recebido: number;
  valor_pendente_receber: number;
  
  total_duplicatas_pagar: number;
  valor_total_pagar: number;
  valor_pago: number;
  valor_pendente_pagar: number;
  
  status_financeiro: 'quitado' | 'pendente_recebimento' | 'pendente_pagamento' | 'pendente_ambos';
}

// DTOs para Importação de NF-e
export interface FinDadosNFe {
  chave_acesso: string;
  numero: string;
  serie: string;
  data_emissao: string;
  
  emitente: {
    cnpj: string;
    nome: string;
    endereco?: string;
  };
  
  destinatario: {
    documento: string;
    nome: string;
    endereco?: string;
  };
  
  valores: {
    total_produtos: number;
    total_desconto: number;
    total_nfe: number;
  };
  
  itens: Array<{
    codigo: string;
    descricao: string;
    quantidade: number;
    valor_unitario: number;
    valor_total: number;
  }>;
  
  condicao_pagamento?: {
    tipo: string;
    parcelas: number;
    valor_parcela: number;
  };
}

export interface FinImportarNFeRequest {
  xml_content: string; // conteúdo do XML em base64 ou string
  tipo: 'receber' | 'pagar';
  tenant_id: string;
  marca: Marca;
}

export interface FinImportarNFeResponse {
  sucesso: boolean;
  mensagem: string;
  duplicata_id?: string;
  dados_nfe?: FinDadosNFe;
  erros?: string[];
}
