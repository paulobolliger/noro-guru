import { Moeda } from '@noro/types'

// Tipos de Markup
export type TipoMarkup = 'fixo' | 'percentual' | 'dinamico' | 'personalizado'

// Tipos de Regras de Preço
export type TipoRegraPreco = 
  | 'markup_padrao'
  | 'volume'
  | 'sazonalidade'
  | 'cliente_categoria'
  | 'destino'
  | 'fornecedor'
  | 'produto'

// Markup Padrão
export interface MarkupPadrao {
  id: string
  tenant_id: string
  tipo_produto: string
  nome: string
  descricao?: string
  tipo_markup: TipoMarkup
  valor_markup: number
  moeda: Moeda
  ativo: boolean
  ordem: number
  created_by: string
  created_at: string
  updated_at: string
}

// Regra de Preço
export interface RegraPreco {
  id: string
  tenant_id: string
  nome: string
  tipo: TipoRegraPreco
  descricao?: string
  
  // Condições
  valor_minimo?: number
  valor_maximo?: number
  data_inicio?: string
  data_fim?: string
  
  // Markup
  tipo_markup: TipoMarkup
  valor_markup: number
  moeda: Moeda
  
  // Controle
  prioridade: number
  sobrepor_regras: boolean
  ativo: boolean
  
  // Metadados
  metadados?: Record<string, any>
  created_by: string
  created_at: string
  updated_at: string
}

// Simulação de Preço
export interface SimulacaoPreco {
  id: string
  tenant_id: string
  
  // Referências
  tipo_produto: string
  fornecedor_id?: string
  cliente_id?: string
  
  // Valores Base
  valor_custo: number
  moeda_custo: Moeda
  taxa_cambio?: number
  valor_custo_brl: number
  
  // Cálculos
  markup_aplicado?: number
  valor_markup?: number
  valor_final?: number
  margem_lucro?: number
  margem_percentual?: number
  
  // Regras
  regras_aplicadas?: {
    tipo: TipoRegraPreco
    valor: number
    descricao: string
  }[]
  justificativa?: string
  
  // Auditoria
  created_by: string
  created_at: string
}

// Histórico de Preço
export interface HistoricoPreco {
  id: string
  tenant_id: string
  
  // Identificação
  tipo_produto: string
  produto_id: string
  fornecedor_id?: string
  
  // Valores
  valor_custo: number
  valor_venda: number
  moeda: Moeda
  taxa_cambio?: number
  
  // Margens
  markup_aplicado?: number
  margem_lucro?: number
  margem_percentual?: number
  
  // Período
  data_inicio: string
  data_fim?: string
  
  // Metadados
  observacoes?: string
  created_by: string
  created_at: string
}