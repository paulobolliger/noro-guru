// types/supabase.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      nomade_users: {
        Row: {
          id: string
          email: string
          nome: string | null
          role: string
          avatar_url: string | null
          telefone: string | null
          whatsapp: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          nome?: string | null
          role?: string
          avatar_url?: string | null
          telefone?: string | null
          whatsapp?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          nome?: string | null
          role?: string
          avatar_url?: string | null
          telefone?: string | null
          whatsapp?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      nomade_leads: {
        Row: {
          id: string
          nome: string
          email: string | null
          telefone: string | null
          whatsapp: string | null
          origem: string | null
          canal_preferencial: string | null
          status: string
          valor_estimado: number | null
          probabilidade: number
          destino_interesse: string | null
          periodo_viagem: string | null
          num_pessoas: number | null
          observacoes: string | null
          proxima_acao: string | null
          data_proxima_acao: string | null
          responsavel: string | null
          tags: string[] | null
          metadata: Json | null
          perdido_motivo: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          email?: string | null
          telefone?: string | null
          whatsapp?: string | null
          origem?: string | null
          canal_preferencial?: string | null
          status?: string
          valor_estimado?: number | null
          probabilidade?: number
          destino_interesse?: string | null
          periodo_viagem?: string | null
          num_pessoas?: number | null
          observacoes?: string | null
          proxima_acao?: string | null
          data_proxima_acao?: string | null
          responsavel?: string | null
          tags?: string[] | null
          metadata?: Json | null
          perdido_motivo?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          email?: string | null
          telefone?: string | null
          whatsapp?: string | null
          origem?: string | null
          canal_preferencial?: string | null
          status?: string
          valor_estimado?: number | null
          probabilidade?: number
          destino_interesse?: string | null
          periodo_viagem?: string | null
          num_pessoas?: number | null
          observacoes?: string | null
          proxima_acao?: string | null
          data_proxima_acao?: string | null
          responsavel?: string | null
          tags?: string[] | null
          metadata?: Json | null
          perdido_motivo?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      nomade_interacoes: {
        Row: {
          id: string
          lead_id: string
          tipo: string
          canal: string | null
          assunto: string | null
          conteudo: string | null
          sentido: string | null
          anexos: Json | null
          created_by: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          tipo: string
          canal?: string | null
          assunto?: string | null
          conteudo?: string | null
          sentido?: string | null
          anexos?: Json | null
          created_by?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          tipo?: string
          canal?: string | null
          assunto?: string | null
          conteudo?: string | null
          sentido?: string | null
          anexos?: Json | null
          created_by?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
      nomade_orcamentos: {
        Row: {
          id: string
          lead_id: string | null
          numero_orcamento: string
          roteiro_base_id: string | null
          titulo: string
          descricao: string | null
          data_viagem_inicio: string | null
          data_viagem_fim: string | null
          num_pessoas: number | null
          num_dias: number | null
          destinos: string[] | null
          valor_total: number
          valor_sinal: number | null
          status: string
          validade_ate: string | null
          itens: Json | null
          observacoes: string | null
          termos_condicoes: string | null
          pdf_url: string | null
          enviado_em: string | null
          visualizado_em: string | null
          respondido_em: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lead_id?: string | null
          numero_orcamento: string
          roteiro_base_id?: string | null
          titulo: string
          descricao?: string | null
          data_viagem_inicio?: string | null
          data_viagem_fim?: string | null
          num_pessoas?: number | null
          num_dias?: number | null
          destinos?: string[] | null
          valor_total: number
          valor_sinal?: number | null
          status?: string
          validade_ate?: string | null
          itens?: Json | null
          observacoes?: string | null
          termos_condicoes?: string | null
          pdf_url?: string | null
          enviado_em?: string | null
          visualizado_em?: string | null
          respondido_em?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lead_id?: string | null
          numero_orcamento?: string
          roteiro_base_id?: string | null
          titulo?: string
          descricao?: string | null
          data_viagem_inicio?: string | null
          data_viagem_fim?: string | null
          num_pessoas?: number | null
          num_dias?: number | null
          destinos?: string[] | null
          valor_total?: number
          valor_sinal?: number | null
          status?: string
          validade_ate?: string | null
          itens?: Json | null
          observacoes?: string | null
          termos_condicoes?: string | null
          pdf_url?: string | null
          enviado_em?: string | null
          visualizado_em?: string | null
          respondido_em?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      nomade_pedidos: {
        Row: {
          id: string
          orcamento_id: string | null
          lead_id: string | null
          numero_pedido: string
          status: string
          valor_total: number
          valor_pago: number
          status_pagamento: string
          metodo_pagamento: string | null
          data_viagem_inicio: string | null
          data_viagem_fim: string | null
          num_pessoas: number | null
          passageiros: Json | null
          itens: Json | null
          vouchers: Json | null
          observacoes: string | null
          cancelado_motivo: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          orcamento_id?: string | null
          lead_id?: string | null
          numero_pedido: string
          status?: string
          valor_total: number
          valor_pago?: number
          status_pagamento?: string
          metodo_pagamento?: string | null
          data_viagem_inicio?: string | null
          data_viagem_fim?: string | null
          num_pessoas?: number | null
          passageiros?: Json | null
          itens?: Json | null
          vouchers?: Json | null
          observacoes?: string | null
          cancelado_motivo?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          orcamento_id?: string | null
          lead_id?: string | null
          numero_pedido?: string
          status?: string
          valor_total?: number
          valor_pago?: number
          status_pagamento?: string
          metodo_pagamento?: string | null
          data_viagem_inicio?: string | null
          data_viagem_fim?: string | null
          num_pessoas?: number | null
          passageiros?: Json | null
          itens?: Json | null
          vouchers?: Json | null
          observacoes?: string | null
          cancelado_motivo?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      nomade_transacoes: {
        Row: {
          id: string
          pedido_id: string | null
          tipo: string
          categoria: string
          subcategoria: string | null
          descricao: string
          valor: number
          data_transacao: string
          data_vencimento: string | null
          status: string
          metodo: string | null
          fornecedor: string | null
          comprovante_url: string | null
          referencia_externa: string | null
          observacoes: string | null
          tags: string[] | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          pedido_id?: string | null
          tipo: string
          categoria: string
          subcategoria?: string | null
          descricao: string
          valor: number
          data_transacao: string
          data_vencimento?: string | null
          status?: string
          metodo?: string | null
          fornecedor?: string | null
          comprovante_url?: string | null
          referencia_externa?: string | null
          observacoes?: string | null
          tags?: string[] | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          pedido_id?: string | null
          tipo?: string
          categoria?: string
          subcategoria?: string | null
          descricao?: string
          valor?: number
          data_transacao?: string
          data_vencimento?: string | null
          status?: string
          metodo?: string | null
          fornecedor?: string | null
          comprovante_url?: string | null
          referencia_externa?: string | null
          observacoes?: string | null
          tags?: string[] | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      nomade_tarefas: {
        Row: {
          id: string
          lead_id: string | null
          pedido_id: string | null
          titulo: string
          descricao: string | null
          prioridade: string
          status: string
          responsavel: string | null
          data_vencimento: string | null
          concluido_em: string | null
          tags: string[] | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lead_id?: string | null
          pedido_id?: string | null
          titulo: string
          descricao?: string | null
          prioridade?: string
          status?: string
          responsavel?: string | null
          data_vencimento?: string | null
          concluido_em?: string | null
          tags?: string[] | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lead_id?: string | null
          pedido_id?: string | null
          titulo?: string
          descricao?: string | null
          prioridade?: string
          status?: string
          responsavel?: string | null
          data_vencimento?: string | null
          concluido_em?: string | null
          tags?: string[] | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      nomade_notificacoes: {
        Row: {
          id: string
          user_id: string
          tipo: string
          titulo: string
          mensagem: string | null
          link: string | null
          lida: boolean
          lida_em: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tipo: string
          titulo: string
          mensagem?: string | null
          link?: string | null
          lida?: boolean
          lida_em?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tipo?: string
          titulo?: string
          mensagem?: string | null
          link?: string | null
          lida?: boolean
          lida_em?: string | null
          created_at?: string
        }
      }
      nomade_newsletter: {
        Row: {
          id: string
          email: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          status?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_dashboard_metrics: {
        Args: {
          periodo_dias: number
        }
        Returns: {
          leads_ativos: number
          leads_novos_periodo: number
          pedidos_ativos: number
          receita_periodo: number
          taxa_conversao: number
          tarefas_pendentes: number
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}