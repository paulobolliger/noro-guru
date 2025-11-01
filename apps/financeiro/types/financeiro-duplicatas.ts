// Tipos TypeScript automáticos para duplicatas, adiantamentos, créditos, lembretes
// Gerado a partir da migration 20251030_create_duplicatas_avancado_v3_FULL_VIEWS.sql

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

export type FinReferenciaData =
  | 'emissao'
  | 'checkout'
  | 'embarque'
  | 'entrega'
  | 'personalizada';

export type FinStatusDuplicata =
  | 'aberta'
  | 'parcialmente_recebida'
  | 'recebida'
  | 'vencida'
  | 'cancelada'
  | 'protestada'
  | 'negociacao';

export type FinTipoAdiantamento =
  | 'pagamento_antecipado'
  | 'deposito_garantia'
  | 'sinal'
  | 'credito_prepago';

export type FinStatusAdiantamento =
  | 'ativo'
  | 'parcialmente_utilizado'
  | 'totalmente_utilizado'
  | 'cancelado'
  | 'expirado';

export type FinTipoCredito =
  | 'refund'
  | 'overpayment'
  | 'desconto_fornecedor'
  | 'credito_futuro'
  | 'estorno'
  | 'devolucao';

export type FinStatusCredito =
  | 'disponivel'
  | 'parcialmente_utilizado'
  | 'totalmente_utilizado'
  | 'expirado'
  | 'cancelado';

export type FinTipoLembrete =
  | 'vencimento_proximo'
  | 'vencido'
  | 'cobranca'
  | 'confirmacao_pagamento';

export type FinCanalNotificacao =
  | 'email'
  | 'whatsapp'
  | 'sms'
  | 'webhook';

export interface FinCondicaoPagamento {
  id: string;
  tenant_id: string;
  nome: string;
  codigo?: string;
  tipo: FinTipoCondicaoPagamento;
  dias_vencimento?: number;
  referencia_data?: FinReferenciaData;
  numero_parcelas?: number;
  intervalo_parcelas?: number;
  percentual_desconto_antecipacao?: number;
  percentual_juros_atraso?: number;
  descricao?: string;
  ativo?: boolean;
  created_at: string;
  updated_at: string;
}

export interface FinDuplicataReceber {
  id: string;
  tenant_id: string;
  marca: string;
  numero_duplicata: string;
  numero_nota_fiscal?: string;
  serie_nota_fiscal?: string;
  chave_acesso_nfe?: string;
  cliente_id?: string;
  fornecedor_intermediario_id?: string;
  reserva_id?: string;
  pedido_id?: string;
  orcamento_id?: string;
  condicao_pagamento_id?: string;
  valor_original: number;
  valor_desconto?: number;
  valor_juros?: number;
  valor_total: number;
  valor_recebido?: number;
  valor_pendente: number;
  moeda: string;
  taxa_cambio?: number;
  valor_brl: number;
  data_emissao: string;
  data_vencimento: string;
  data_recebimento?: string;
  data_referencia?: string;
  status: FinStatusDuplicata;
  cliente_nome?: string;
  cliente_documento?: string;
  cliente_email?: string;
  cliente_telefone?: string;
  observacoes?: string;
  condicao_pagamento_texto?: string;
  documento_url?: string;
  xml_nfe_url?: string;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface FinDuplicataPagar {
  id: string;
  tenant_id: string;
  marca: string;
  numero_duplicata: string;
  numero_nota_fiscal?: string;
  serie_nota_fiscal?: string;
  chave_acesso_nfe?: string;
  fornecedor_id: string;
  reserva_id?: string;
  pedido_id?: string;
  condicao_pagamento_id?: string;
  adiantamento_id?: string;
  valor_original: number;
  valor_desconto?: number;
  valor_juros?: number;
  valor_total: number;
  valor_pago?: number;
  valor_pendente: number;
  valor_credito_aplicado?: number;
  moeda: string;
  taxa_cambio?: number;
  valor_brl: number;
  data_emissao: string;
  data_vencimento: string;
  data_pagamento?: string;
  data_referencia?: string;
  status: FinStatusDuplicata;
  fornecedor_nome?: string;
  fornecedor_documento?: string;
  fornecedor_email?: string;
  fornecedor_telefone?: string;
  forma_pagamento?: string;
  conta_bancaria_id?: string;
  comprovante_pagamento_url?: string;
  observacoes?: string;
  condicao_pagamento_texto?: string;
  documento_url?: string;
  xml_nfe_url?: string;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface FinAdiantamento {
  id: string;
  tenant_id: string;
  marca: string;
  numero_adiantamento: string;
  tipo: FinTipoAdiantamento;
  fornecedor_id: string;
  fornecedor_nome?: string;
  reserva_id?: string;
  valor_original: number;
  valor_utilizado?: number;
  valor_disponivel: number;
  moeda: string;
  taxa_cambio?: number;
  data_pagamento: string;
  data_expiracao?: string;
  status: FinStatusAdiantamento;
  forma_pagamento?: string;
  conta_bancaria_id?: string;
  comprovante_pagamento_url?: string;
  observacoes?: string;
  condicoes_uso?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface FinCredito {
  id: string;
  tenant_id: string;
  marca: string;
  numero_credito: string;
  tipo_credito: FinTipoCredito;
  fornecedor_id: string;
  fornecedor_nome?: string;
  duplicata_origem_id?: string;
  reserva_id?: string;
  valor_original: number;
  valor_utilizado?: number;
  valor_disponivel: number;
  moeda: string;
  taxa_cambio?: number;
  data_recebimento: string;
  data_expiracao?: string;
  status: FinStatusCredito;
  motivo: string;
  documento_referencia?: string;
  comprovante_url?: string;
  observacoes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface FinUtilizacao {
  id: string;
  tenant_id: string;
  adiantamento_id?: string;
  credito_id?: string;
  duplicata_pagar_id?: string;
  valor_utilizado: number;
  data_utilizacao: string;
  observacoes?: string;
  created_by?: string;
  created_at: string;
}

export interface FinLembrete {
  id: string;
  tenant_id: string;
  duplicata_receber_id?: string;
  duplicata_pagar_id?: string;
  tipo_lembrete: FinTipoLembrete;
  dias_antecedencia?: number;
  canais?: FinCanalNotificacao[];
  destinatario_nome?: string;
  destinatario_email?: string;
  destinatario_telefone?: string;
  programado_para: string;
  enviado_em?: string;
  status?: string;
  erro_mensagem?: string;
  assunto?: string;
  mensagem?: string;
  created_at: string;
}
