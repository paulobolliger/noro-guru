// Types para o módulo de Comissões e Repasses
// Gerado a partir da migration 20251030_financeiro_comissoes_v1.sql

export type FinTipoComissao = 
  | 'hotel'
  | 'aereo'
  | 'tour'
  | 'seguro'
  | 'visto'
  | 'outro';

export type FinStatusComissao =
  | 'pendente'
  | 'prevista'
  | 'paga'
  | 'cancelada'
  | 'repassada';

export type FinTipoRepassado =
  | 'agencia'
  | 'consultor'
  | 'parceiro';

export interface FinRegraComissao {
  id: string;
  tenant_id: string;
  tipo: FinTipoComissao;
  produto_id?: string;
  fornecedor_id?: string;
  percentual?: number;
  valor_fixo?: number;
  faixa_inicial?: number;
  faixa_final?: number;
  ativo: boolean;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export interface FinComissaoRecebida {
  id: string;
  tenant_id: string;
  tipo: FinTipoComissao;
  fornecedor_id?: string;
  produto_id?: string;
  valor_bruto: number;
  percentual?: number;
  valor_comissao: number;
  moeda: string;
  data_prevista?: string;
  data_recebida?: string;
  status: FinStatusComissao;
  origem?: string;
  comprovante_url?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export interface FinComissaoSplit {
  id: string;
  comissao_id: string;
  tipo_repassado: FinTipoRepassado;
  usuario_id?: string;
  percentual?: number;
  valor_repassado: number;
  status: FinStatusComissao;
  data_repassada?: string;
  metodo_pagamento?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export interface FinRepasseAutomacao {
  id: string;
  split_id: string;
  status: FinStatusComissao;
  data_agendada?: string;
  data_executada?: string;
  comprovante_url?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

// Interface para a view de previsão
export interface PrevisaoComissoesFuturas {
  tenant_id: string;
  tipo: FinTipoComissao;
  fornecedor_id?: string;
  produto_id?: string;
  data_prevista: string;
  total_previsto: number;
  qtd_prevista: number;
}