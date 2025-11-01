// Types para o módulo Cambial e Multimoeda
// Gerado a partir da migration 20251030_financeiro_cambial_v1.sql

export type FinTipoCambio = 
  | 'comercial'
  | 'turismo'
  | 'interno_noro'
  | 'fixo_grupo';

export type FinMoedaBase = 
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'BRL';

export type FinFonteTaxa = 
  | 'bcb'
  | 'remessa_online'
  | 'wise'
  | 'manual'
  | 'contrato';

export interface FinConfigCambioGrupo {
  id: string;
  tenant_id: string;
  grupo_id: string;
  moeda: FinMoedaBase;
  tipo_cambio: FinTipoCambio;
  taxa_fixa?: number;
  margem_cambio?: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface FinTaxaCambio {
  id: string;
  tenant_id: string;
  data_taxa: string;
  hora_taxa: string;
  moeda_origem: FinMoedaBase;
  moeda_destino: FinMoedaBase;
  tipo_cambio: FinTipoCambio;
  taxa_compra: number;
  taxa_venda: number;
  fonte_taxa: FinFonteTaxa;
  spread?: number;
  iof?: number;
  outras_taxas?: number;
  observacoes?: string;
  created_at: string;
}

export interface FinAlertaCambio {
  id: string;
  tenant_id: string;
  moeda: FinMoedaBase;
  tipo_cambio: FinTipoCambio;
  valor_gatilho: number;
  variacao_percentual: number;
  mensagem?: string;
  notificado_em?: string;
  created_at: string;
}

export interface FinSimulacaoMargem {
  id: string;
  tenant_id: string;
  produto_id?: string;
  moeda_origem: FinMoedaBase;
  moeda_destino: FinMoedaBase;
  valor_original: number;
  taxa_cambio: number;
  spread?: number;
  iof?: number;
  outras_taxas?: number;
  markup?: number;
  valor_final: number;
  margem_final: number;
  observacoes?: string;
  created_at: string;
  created_by?: string;
}

export interface VariacaoCambial {
  tenant_id: string;
  moeda_origem: FinMoedaBase;
  moeda_destino: FinMoedaBase;
  tipo_cambio: FinTipoCambio;
  data_taxa: string;
  taxa_atual: number;
  taxa_anterior?: number;
  taxa_7_dias?: number;
  taxa_30_dias?: number;
  variacao_diaria: number;
  variacao_semanal: number;
  variacao_mensal: number;
}