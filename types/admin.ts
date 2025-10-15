// types/admin.ts

export type UserRole = 'cliente' | 'admin' | 'super_admin';

export interface User {
  id: string;
  email: string;
  nome: string | null;
  role: UserRole;
  avatar_url: string | null;
  telefone: string | null;
  whatsapp: string | null;
  created_at: string;
  updated_at: string;
}

export type LeadStatus = 
  | 'novo' 
  | 'contato_inicial' 
  | 'qualificado' 
  | 'proposta_enviada' 
  | 'negociacao' 
  | 'ganho' 
  | 'perdido' 
  | 'inativo';

export type LeadOrigem = 
  | 'site' 
  | 'instagram' 
  | 'whatsapp' 
  | 'facebook' 
  | 'indicacao' 
  | 'google';

export interface Lead {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  whatsapp: string | null;
  origem: LeadOrigem | null;
  canal_preferencial: string | null;
  status: LeadStatus;
  valor_estimado: number | null;
  probabilidade: number;
  destino_interesse: string | null;
  periodo_viagem: string | null;
  num_pessoas: number | null;
  observacoes: string | null;
  proxima_acao: string | null;
  data_proxima_acao: string | null;
  responsavel: string | null;
  tags: string[] | null;
  metadata: any;
  perdido_motivo: string | null;
  created_at: string;
  updated_at: string;
}

export type InteracaoTipo = 
  | 'email' 
  | 'whatsapp' 
  | 'call' 
  | 'meeting' 
  | 'nota' 
  | 'sms' 
  | 'instagram' 
  | 'facebook';

export interface Interacao {
  id: string;
  lead_id: string;
  tipo: InteracaoTipo;
  canal: string | null;
  assunto: string | null;
  conteudo: string | null;
  sentido: 'enviado' | 'recebido' | null;
  anexos: any;
  created_by: string | null;
  metadata: any;
  created_at: string;
}

export type OrcamentoStatus = 
  | 'rascunho' 
  | 'enviado' 
  | 'visualizado' 
  | 'aceito' 
  | 'recusado' 
  | 'expirado' 
  | 'revisao';

export interface Orcamento {
  id: string;
  lead_id: string | null;
  numero_orcamento: string;
  roteiro_base_id: string | null;
  titulo: string;
  descricao: string | null;
  data_viagem_inicio: string | null;
  data_viagem_fim: string | null;
  num_pessoas: number | null;
  num_dias: number | null;
  destinos: string[] | null;
  valor_total: number;
  valor_sinal: number | null;
  status: OrcamentoStatus;
  validade_ate: string | null;
  itens: any;
  observacoes: string | null;
  termos_condicoes: string | null;
  pdf_url: string | null;
  enviado_em: string | null;
  visualizado_em: string | null;
  respondido_em: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export type PedidoStatus = 
  | 'pendente' 
  | 'confirmado' 
  | 'em_andamento' 
  | 'concluido' 
  | 'cancelado' 
  | 'reembolsado';

export type StatusPagamento = 
  | 'pendente' 
  | 'pago_parcial' 
  | 'pago_total' 
  | 'reembolsado' 
  | 'cancelado';

export interface Pedido {
  id: string;
  orcamento_id: string | null;
  lead_id: string | null;
  numero_pedido: string;
  status: PedidoStatus;
  valor_total: number;
  valor_pago: number;
  valor_pendente?: number;
  status_pagamento: StatusPagamento;
  metodo_pagamento: string | null;
  data_viagem_inicio: string | null;
  data_viagem_fim: string | null;
  num_pessoas: number | null;
  passageiros: any;
  itens: any;
  vouchers: any;
  observacoes: string | null;
  cancelado_motivo: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Transacao {
  id: string;
  pedido_id: string | null;
  tipo: 'receita' | 'despesa';
  categoria: string;
  subcategoria: string | null;
  descricao: string;
  valor: number;
  data_transacao: string;
  data_vencimento: string | null;
  status: 'pendente' | 'confirmado' | 'cancelado' | 'estornado';
  metodo: string | null;
  fornecedor: string | null;
  comprovante_url: string | null;
  referencia_externa: string | null;
  observacoes: string | null;
  tags: string[] | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export type TarefaPrioridade = 'baixa' | 'media' | 'alta' | 'urgente';
export type TarefaStatus = 'pendente' | 'em_andamento' | 'concluido' | 'cancelado';

export interface Tarefa {
  id: string;
  lead_id: string | null;
  pedido_id: string | null;
  titulo: string;
  descricao: string | null;
  prioridade: TarefaPrioridade;
  status: TarefaStatus;
  responsavel: string | null;
  data_vencimento: string | null;
  concluido_em: string | null;
  tags: string[] | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Notificacao {
  id: string;
  user_id: string;
  tipo: string;
  titulo: string;
  mensagem: string | null;
  link: string | null;
  lida: boolean;
  lida_em: string | null;
  created_at: string;
}

export interface DashboardMetrics {
  leads_ativos: number;
  leads_novos_periodo: number;
  pedidos_ativos: number;
  receita_periodo: number;
  taxa_conversao: number;
  tarefas_pendentes: number;
}