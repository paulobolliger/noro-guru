export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export default interface Database {
  public: {
    Tables: {
      nomade_blog_categorias: {
        Row: {
          created_at: string
          id: string
          nome: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          slug?: string
        }
        Relationships: []
      }
      nomade_blog_posts: {
        Row: {
          canonical_url: string | null
          categoria: string | null
          conteudo: string | null
          created_at: string
          destaque: boolean | null
          id: string
          imagem_alt_text: string | null
          imagem_capa_url: string | null
          keywords: string[] | null
          meta_description: string | null
          meta_title: string | null
          og_description: string | null
          og_image_alt_text: string | null
          og_image_url: string | null
          og_title: string | null
          resumo: string | null
          roteiro_relacionado_id: string | null
          slug: string
          status: string
          titulo: string
          updated_at: string | null
        }
        Insert: {
          canonical_url?: string | null
          categoria?: string | null
          conteudo?: string | null
          created_at?: string
          destaque?: boolean | null
          id?: string
          imagem_alt_text?: string | null
          imagem_capa_url?: string | null
          keywords?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image_alt_text?: string | null
          og_image_url?: string | null
          og_title?: string | null
          resumo?: string | null
          roteiro_relacionado_id?: string | null
          slug: string
          status?: string
          titulo: string
          updated_at?: string | null
        }
        Update: {
          canonical_url?: string | null
          categoria?: string | null
          conteudo?: string | null
          created_at?: string
          destaque?: boolean | null
          id?: string
          imagem_alt_text?: string | null
          imagem_capa_url?: string | null
          keywords?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image_alt_text?: string | null
          og_image_url?: string | null
          og_title?: string | null
          resumo?: string | null
          roteiro_relacionado_id?: string | null
          slug?: string
          status?: string
          titulo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nomade_blog_posts_roteiro_relacionado_id_fkey"
            columns: ["roteiro_relacionado_id"]
            isOneToOne: false
            referencedRelation: "nomade_roteiros"
            referencedColumns: ["id"]
          },
        ]
      }
      nomade_interacoes: {
        Row: {
          anexos: Json | null
          assunto: string | null
          canal: string | null
          conteudo: string | null
          created_at: string
          created_by: string | null
          id: string
          lead_id: string
          metadata: Json | null
          sentido: string | null
          tipo: string
        }
        Insert: {
          anexos?: Json | null
          assunto?: string | null
          canal?: string | null
          conteudo?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          lead_id: string
          metadata?: Json | null
          sentido?: string | null
          tipo: string
        }
        Update: {
          anexos?: Json | null
          assunto?: string | null
          canal?: string | null
          conteudo?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          lead_id?: string
          metadata?: Json | null
          sentido?: string | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "nomade_interacoes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "nomade_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nomade_interacoes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "nomade_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      nomade_leads: {
        Row: {
          canal_preferencial: string | null
          created_at: string
          data_proxima_acao: string | null
          destino_interesse: string | null
          email: string | null
          id: string
          metadata: Json | null
          nome: string
          num_pessoas: number | null
          observacoes: string | null
          origem: string | null
          perdido_motivo: string | null
          periodo_viagem: string | null
          probabilidade: number
          proxima_acao: string | null
          responsavel: string | null
          status: string
          tags: string[] | null
          telefone: string | null
          updated_at: string
          valor_estimado: number | null
          whatsapp: string | null
        }
        Insert: {
          canal_preferencial?: string | null
          created_at?: string
          data_proxima_acao?: string | null
          destino_interesse?: string | null
          email?: string | null
          id?: string
          metadata?: Json | null
          nome: string
          num_pessoas?: number | null
          observacoes?: string | null
          origem?: string | null
          perdido_motivo?: string | null
          periodo_viagem?: string | null
          probabilidade?: number
          proxima_acao?: string | null
          responsavel?: string | null
          status?: string
          tags?: string[] | null
          telefone?: string | null
          updated_at?: string
          valor_estimado?: number | null
          whatsapp?: string | null
        }
        Update: {
          canal_preferencial?: string | null
          created_at?: string
          data_proxima_acao?: string | null
          destino_interesse?: string | null
          email?: string | null
          id?: string
          metadata?: Json | null
          nome?: string
          num_pessoas?: number | null
          observacoes?: string | null
          origem?: string | null
          perdido_motivo?: string | null
          periodo_viagem?: string | null
          probabilidade?: number
          proxima_acao?: string | null
          responsavel?: string | null
          status?: string
          tags?: string[] | null
          telefone?: string | null
          updated_at?: string
          valor_estimado?: number | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nomade_leads_responsavel_fkey"
            columns: ["responsavel"]
            isOneToOne: false
            referencedRelation: "nomade_users"
            referencedColumns: ["id"]
          },
        ]
      }
      nomade_logs: {
        Row: {
          created_at: string
          id: number
          mensagem: string | null
          tipo: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          mensagem?: string | null
          tipo?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          mensagem?: string | null
          tipo?: string | null
        }
        Relationships: []
      }
      nomade_mensagens: {
        Row: {
          assunto: string | null
          created_at: string
          email: string
          id: number
          mensagem: string
          nome: string
        }
        Insert: {
          assunto?: string | null
          created_at?: string
          email: string
          id?: number
          mensagem: string
          nome: string
        }
        Update: {
          assunto?: string | null
          created_at?: string
          email?: string
          id?: number
          mensagem?: string
          nome?: string
        }
        Relationships: []
      }
      nomade_newsletter: {
        Row: {
          created_at: string
          email: string
          id: string
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          status?: string
        }
        Relationships: []
      }
      nomade_notificacoes: {
        Row: {
          created_at: string
          id: string
          lida: boolean
          lida_em: string | null
          link: string | null
          mensagem: string | null
          tipo: string
          titulo: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          lida?: boolean
          lida_em?: string | null
          link?: string | null
          mensagem?: string | null
          tipo: string
          titulo: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          lida?: boolean
          lida_em?: string | null
          link?: string | null
          mensagem?: string | null
          tipo?: string
          titulo?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nomade_notificacoes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      nomade_orcamentos: {
        Row: {
          created_at: string
          created_by: string | null
          data_viagem_fim: string | null
          data_viagem_inicio: string | null
          descricao: string | null
          destinos: string[] | null
          enviado_em: string | null
          id: string
          itens: Json | null
          lead_id: string | null
          num_dias: number | null
          num_pessoas: number | null
          numero_orcamento: string
          observacoes: string | null
          pdf_url: string | null
          respondido_em: string | null
          roteiro_base_id: string | null
          status: string
          termos_condicoes: string | null
          titulo: string
          updated_at: string
          validade_ate: string | null
          valor_sinal: number | null
          valor_total: number
          visualizado_em: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          data_viagem_fim?: string | null
          data_viagem_inicio?: string | null
          descricao?: string | null
          destinos?: string[] | null
          enviado_em?: string | null
          id?: string
          itens?: Json | null
          lead_id?: string | null
          num_dias?: number | null
          num_pessoas?: number | null
          numero_orcamento: string
          observacoes?: string | null
          pdf_url?: string | null
          respondido_em?: string | null
          roteiro_base_id?: string | null
          status?: string
          termos_condicoes?: string | null
          titulo: string
          updated_at?: string
          validade_ate?: string | null
          valor_sinal?: number | null
          valor_total: number
          visualizado_em?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          data_viagem_fim?: string | null
          data_viagem_inicio?: string | null
          descricao?: string | null
          destinos?: string[] | null
          enviado_em?: string | null
          id?: string
          itens?: Json | null
          lead_id?: string | null
          num_dias?: number | null
          num_pessoas?: number | null
          numero_orcamento?: string
          observacoes?: string | null
          pdf_url?: string | null
          respondido_em?: string | null
          roteiro_base_id?: string | null
          status?: string
          termos_condicoes?: string | null
          titulo?: string
          updated_at?: string
          validade_ate?: string | null
          valor_sinal?: number | null
          valor_total?: number
          visualizado_em?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nomade_orcamentos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "nomade_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nomade_orcamentos_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "nomade_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      nomade_pedidos: {
        Row: {
          cancelado_motivo: string | null
          created_at: string
          created_by: string | null
          data_viagem_fim: string | null
          data_viagem_inicio: string | null
          id: string
          itens: Json | null
          lead_id: string | null
          metodo_pagamento: string | null
          num_pessoas: number | null
          numero_pedido: string
          observacoes: string | null
          orcamento_id: string | null
          passageiros: Json | null
          status: string
          status_pagamento: string
          updated_at: string
          valor_pago: number
          valor_total: number
          vouchers: Json | null
        }
        Insert: {
          cancelado_motivo?: string | null
          created_at?: string
          created_by?: string | null
          data_viagem_fim?: string | null
          data_viagem_inicio?: string | null
          id?: string
          itens?: Json | null
          lead_id?: string | null
          metodo_pagamento?: string | null
          num_pessoas?: number | null
          numero_pedido: string
          observacoes?: string | null
          orcamento_id?: string | null
          passageiros?: Json | null
          status?: string
          status_pagamento?: string
          updated_at?: string
          valor_pago?: number
          valor_total: number
          vouchers?: Json | null
        }
        Update: {
          cancelado_motivo?: string | null
          created_at?: string
          created_by?: string | null
          data_viagem_fim?: string | null
          data_viagem_inicio?: string | null
          id?: string
          itens?: Json | null
          lead_id?: string | null
          metodo_pagamento?: string | null
          num_pessoas?: number | null
          numero_pedido?: string
          observacoes?: string | null
          orcamento_id?: string | null
          passageiros?: Json | null
          status?: string
          status_pagamento?: string
          updated_at?: string
          valor_pago?: number
          valor_total?: number
          vouchers?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "nomade_pedidos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "nomade_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nomade_pedidos_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "nomade_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nomade_pedidos_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "nomade_orcamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      nomade_roteiros: {
        Row: {
          canonical_url: string | null
          categoria: string | null
          created_at: string
          descricao_curta: string | null
          destaque: boolean | null
          detalhes: Json | null
          duracao_dias: number | null
          id: string
          imagem_alt_text: string | null
          imagem_url: string | null
          keywords: string[] | null
          meta_description: string | null
          meta_title: string | null
          og_description: string | null
          og_image_alt_text: string | null
          og_image_url: string | null
          og_title: string | null
          preco_base: number | null
          slug: string
          status: string
          titulo: string
          updated_at: string | null
        }
        Insert: {
          canonical_url?: string | null
          categoria?: string | null
          created_at?: string
          descricao_curta?: string | null
          destaque?: boolean | null
          detalhes?: Json | null
          duracao_dias?: number | null
          id?: string
          imagem_alt_text?: string | null
          imagem_url?: string | null
          keywords?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image_alt_text?: string | null
          og_image_url?: string | null
          og_title?: string | null
          preco_base?: number | null
          slug: string
          status?: string
          titulo: string
          updated_at?: string | null
        }
        Update: {
          canonical_url?: string | null
          categoria?: string | null
          created_at?: string
          descricao_curta?: string | null
          destaque?: boolean | null
          detalhes?: Json | null
          duracao_dias?: number | null
          id?: string
          imagem_alt_text?: string | null
          imagem_url?: string | null
          keywords?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image_alt_text?: string | null
          og_image_url?: string | null
          og_title?: string | null
          preco_base?: number | null
          slug?: string
          status?: string
          titulo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      nomade_tarefas: {
        Row: {
          concluido_em: string | null
          created_at: string
          created_by: string | null
          data_vencimento: string | null
          descricao: string | null
          id: string
          lead_id: string | null
          pedido_id: string | null
          prioridade: string
          responsavel: string | null
          status: string
          tags: string[] | null
          titulo: string
          updated_at: string
        }
        Insert: {
          concluido_em?: string | null
          created_at?: string
          created_by?: string | null
          data_vencimento?: string | null
          descricao?: string | null
          id?: string
          lead_id?: string | null
          pedido_id?: string | null
          prioridade?: string
          responsavel?: string | null
          status?: string
          tags?: string[] | null
          titulo: string
          updated_at?: string
        }
        Update: {
          concluido_em?: string | null
          created_at?: string
          created_by?: string | null
          data_vencimento?: string | null
          descricao?: string | null
          id?: string
          lead_id?: string | null
          pedido_id?: string | null
          prioridade?: string
          responsavel?: string | null
          status?: string
          tags?: string[] | null
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "nomade_tarefas_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "nomade_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nomade_tarefas_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "nomade_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nomade_tarefas_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "nomade_pedidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nomade_tarefas_responsavel_fkey"
            columns: ["responsavel"]
            isOneToOne: false
            referencedRelation: "nomade_users"
            referencedColumns: ["id"]
          },
        ]
      }
      nomade_transacoes: {
        Row: {
          categoria: string
          comprovante_url: string | null
          created_at: string
          created_by: string | null
          data_transacao: string
          data_vencimento: string | null
          descricao: string
          fornecedor: string | null
          id: string
          metodo: string | null
          observacoes: string | null
          pedido_id: string | null
          referencia_externa: string | null
          status: string
          subcategoria: string | null
          tags: string[] | null
          tipo: string
          updated_at: string
          valor: number
        }
        Insert: {
          categoria: string
          comprovante_url?: string | null
          created_at?: string
          created_by?: string | null
          data_transacao: string
          data_vencimento?: string | null
          descricao: string
          fornecedor?: string | null
          id?: string
          metodo?: string | null
          observacoes?: string | null
          pedido_id?: string | null
          referencia_externa?: string | null
          status?: string
          subcategoria?: string | null
          tags?: string[] | null
          tipo: string
          updated_at?: string
          valor: number
        }
        Update: {
          categoria?: string
          comprovante_url?: string | null
          created_at?: string
          created_by?: string | null
          data_transacao?: string
          data_vencimento?: string | null
          descricao?: string
          fornecedor?: string | null
          id?: string
          metodo?: string | null
          observacoes?: string | null
          pedido_id?: string | null
          referencia_externa?: string | null
          status?: string
          subcategoria?: string | null
          tags?: string[] | null
          tipo?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "nomade_transacoes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "nomade_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nomade_transacoes_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "nomade_pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      nomade_users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          nome: string | null
          role: string
          telefone: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          nome?: string | null
          role?: string
          telefone?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          nome?: string | null
          role?: string
          telefone?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nomade_users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
