export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      noro_audit_log: {
        Row: {
          action: string
          actor_user_id: string | null
          after_data: Json | null
          before_data: Json | null
          created_at: string
          entity: string
          entity_id: string | null
          id: string
          meta: Json | null
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          entity: string
          entity_id?: string | null
          id?: string
          meta?: Json | null
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          entity?: string
          entity_id?: string | null
          id?: string
          meta?: Json | null
        }
        Relationships: []
      }
      noro_campanhas: {
        Row: {
          canal: string | null
          created_at: string
          fim: string | null
          id: string
          inicio: string | null
          meta: Json | null
          nome: string
        }
        Insert: {
          canal?: string | null
          created_at?: string
          fim?: string | null
          id?: string
          inicio?: string | null
          meta?: Json | null
          nome: string
        }
        Update: {
          canal?: string | null
          created_at?: string
          fim?: string | null
          id?: string
          inicio?: string | null
          meta?: Json | null
          nome?: string
        }
        Relationships: []
      }
      noro_clientes: {
        Row: {
          ativo: boolean
          created_at: string
          documento: string | null
          email: string | null
          genero: string | null
          id: string
          inscricao_estadual: string | null
          nascimento: string | null
          nome: string
          observacoes: string | null
          responsavel_comercial: string | null
          tags: string[] | null
          telefone: string | null
          tipo: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          documento?: string | null
          email?: string | null
          genero?: string | null
          id?: string
          inscricao_estadual?: string | null
          nascimento?: string | null
          nome: string
          observacoes?: string | null
          responsavel_comercial?: string | null
          tags?: string[] | null
          telefone?: string | null
          tipo?: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean
          created_at?: string
          documento?: string | null
          email?: string | null
          genero?: string | null
          id?: string
          inscricao_estadual?: string | null
          nascimento?: string | null
          nome?: string
          observacoes?: string | null
          responsavel_comercial?: string | null
          tags?: string[] | null
          telefone?: string | null
          tipo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      noro_clientes_contatos_emergencia: {
        Row: {
          cliente_id: string
          created_at: string
          id: string
          nome: string
          relacao: string | null
          telefone: string
        }
        Insert: {
          cliente_id: string
          created_at?: string
          id?: string
          nome: string
          relacao?: string | null
          telefone: string
        }
        Update: {
          cliente_id?: string
          created_at?: string
          id?: string
          nome?: string
          relacao?: string | null
          telefone?: string
        }
        Relationships: [
          {
            foreignKeyName: "noro_clientes_contatos_emergencia_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "noro_clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      noro_clientes_documentos: {
        Row: {
          cliente_id: string
          created_at: string
          id: string
          meta: Json | null
          nome_arquivo: string | null
          tipo: string | null
          url: string | null
        }
        Insert: {
          cliente_id: string
          created_at?: string
          id?: string
          meta?: Json | null
          nome_arquivo?: string | null
          tipo?: string | null
          url?: string | null
        }
        Update: {
          cliente_id?: string
          created_at?: string
          id?: string
          meta?: Json | null
          nome_arquivo?: string | null
          tipo?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "noro_clientes_documentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "noro_clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      noro_clientes_enderecos: {
        Row: {
          bairro: string | null
          cep: string | null
          cidade: string | null
          cliente_id: string
          complemento: string | null
          created_at: string
          estado: string | null
          id: string
          logradouro: string | null
          numero: string | null
          pais: string | null
          principal: boolean | null
          tipo: string | null
        }
        Insert: {
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          cliente_id: string
          complemento?: string | null
          created_at?: string
          estado?: string | null
          id?: string
          logradouro?: string | null
          numero?: string | null
          pais?: string | null
          principal?: boolean | null
          tipo?: string | null
        }
        Update: {
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          cliente_id?: string
          complemento?: string | null
          created_at?: string
          estado?: string | null
          id?: string
          logradouro?: string | null
          numero?: string | null
          pais?: string | null
          principal?: boolean | null
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "noro_clientes_enderecos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "noro_clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      noro_clientes_milhas: {
        Row: {
          cliente_id: string
          id: string
          numero: string | null
          programa: string
          saldo: number | null
          updated_at: string
        }
        Insert: {
          cliente_id: string
          id?: string
          numero?: string | null
          programa: string
          saldo?: number | null
          updated_at?: string
        }
        Update: {
          cliente_id?: string
          id?: string
          numero?: string | null
          programa?: string
          saldo?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "noro_clientes_milhas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "noro_clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      noro_clientes_preferencias: {
        Row: {
          cliente_id: string
          id: string
          preferencia: Json | null
          updated_at: string
        }
        Insert: {
          cliente_id: string
          id?: string
          preferencia?: Json | null
          updated_at?: string
        }
        Update: {
          cliente_id?: string
          id?: string
          preferencia?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "noro_clientes_preferencias_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: true
            referencedRelation: "noro_clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      noro_comissoes: {
        Row: {
          agente_id: string | null
          created_at: string
          id: string
          pedido_id: string | null
          percentual: number | null
          status: string
          valor: number
        }
        Insert: {
          agente_id?: string | null
          created_at?: string
          id?: string
          pedido_id?: string | null
          percentual?: number | null
          status?: string
          valor?: number
        }
        Update: {
          agente_id?: string | null
          created_at?: string
          id?: string
          pedido_id?: string | null
          percentual?: number | null
          status?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "noro_comissoes_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "noro_pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      noro_comunicacao_templates: {
        Row: {
          assunto: string | null
          canal: string
          corpo: string | null
          id: string
          nome: string
          updated_at: string
          uso_count: number
        }
        Insert: {
          assunto?: string | null
          canal: string
          corpo?: string | null
          id?: string
          nome: string
          updated_at?: string
          uso_count?: number
        }
        Update: {
          assunto?: string | null
          canal?: string
          corpo?: string | null
          id?: string
          nome?: string
          updated_at?: string
          uso_count?: number
        }
        Relationships: []
      }
      noro_configuracoes: {
        Row: {
          key: string
          updated_at: string
          value: Json | null
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json | null
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json | null
        }
        Relationships: []
      }
      noro_empresa: {
        Row: {
          config: Json | null
          created_at: string
          documento: string | null
          email: string | null
          endereco: Json | null
          id: string
          nome: string
          site: string | null
          telefone: string | null
        }
        Insert: {
          config?: Json | null
          created_at?: string
          documento?: string | null
          email?: string | null
          endereco?: Json | null
          id?: string
          nome: string
          site?: string | null
          telefone?: string | null
        }
        Update: {
          config?: Json | null
          created_at?: string
          documento?: string | null
          email?: string | null
          endereco?: Json | null
          id?: string
          nome?: string
          site?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      noro_fornecedores: {
        Row: {
          created_at: string
          documento: string | null
          email: string | null
          id: string
          meta: Json | null
          nome: string
          site: string | null
          telefone: string | null
        }
        Insert: {
          created_at?: string
          documento?: string | null
          email?: string | null
          id?: string
          meta?: Json | null
          nome: string
          site?: string | null
          telefone?: string | null
        }
        Update: {
          created_at?: string
          documento?: string | null
          email?: string | null
          id?: string
          meta?: Json | null
          nome?: string
          site?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      noro_funil_vendas: {
        Row: {
          ativo: boolean
          etapa: string
          id: string
          ordem: number
        }
        Insert: {
          ativo?: boolean
          etapa: string
          id?: string
          ordem: number
        }
        Update: {
          ativo?: boolean
          etapa?: string
          id?: string
          ordem?: number
        }
        Relationships: []
      }
      noro_interacoes: {
        Row: {
          assunto: string | null
          canal: string | null
          cliente_id: string | null
          conteudo: string | null
          created_at: string
          id: string
          lead_id: string | null
          user_id: string | null
        }
        Insert: {
          assunto?: string | null
          canal?: string | null
          cliente_id?: string | null
          conteudo?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          user_id?: string | null
        }
        Update: {
          assunto?: string | null
          canal?: string | null
          cliente_id?: string | null
          conteudo?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "noro_interacoes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "noro_clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "noro_interacoes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "noro_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      noro_leads: {
        Row: {
          assigned_to: string | null
          created_at: string
          email: string | null
          etapa_funil: string | null
          id: string
          mensagem: string | null
          nome: string
          origem: string | null
          status: string
          telefone: string | null
          ultimo_contato: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          email?: string | null
          etapa_funil?: string | null
          id?: string
          mensagem?: string | null
          nome: string
          origem?: string | null
          status?: string
          telefone?: string | null
          ultimo_contato?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          email?: string | null
          etapa_funil?: string | null
          id?: string
          mensagem?: string | null
          nome?: string
          origem?: string | null
          status?: string
          telefone?: string | null
          ultimo_contato?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "noro_leads_etapa_funil_fkey"
            columns: ["etapa_funil"]
            isOneToOne: false
            referencedRelation: "noro_funil_vendas"
            referencedColumns: ["id"]
          },
        ]
      }
      noro_logs: {
        Row: {
          created_at: string
          id: string
          level: string
          message: string
          meta: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          level?: string
          message: string
          meta?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          level?: string
          message?: string
          meta?: Json | null
        }
        Relationships: []
      }
      noro_newsletter: {
        Row: {
          created_at: string
          email: string
          id: string
          nome: string | null
          origem: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          nome?: string | null
          origem?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          nome?: string | null
          origem?: string | null
        }
        Relationships: []
      }
      noro_notificacoes: {
        Row: {
          corpo: string | null
          created_at: string
          id: string
          lida: boolean
          titulo: string
          user_id: string
        }
        Insert: {
          corpo?: string | null
          created_at?: string
          id?: string
          lida?: boolean
          titulo: string
          user_id: string
        }
        Update: {
          corpo?: string | null
          created_at?: string
          id?: string
          lida?: boolean
          titulo?: string
          user_id?: string
        }
        Relationships: []
      }
      noro_orcamentos: {
        Row: {
          cliente_id: string | null
          created_at: string
          descricao: string | null
          id: string
          lead_id: string | null
          numero: string | null
          status: string
          valor_total: number
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          lead_id?: string | null
          numero?: string | null
          status?: string
          valor_total?: number
        }
        Update: {
          cliente_id?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          lead_id?: string | null
          numero?: string | null
          status?: string
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "noro_orcamentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "noro_clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "noro_orcamentos_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "noro_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      noro_orcamentos_itens: {
        Row: {
          descricao: string
          id: string
          orcamento_id: string
          preco_unitario: number
          quantidade: number
          total: number | null
        }
        Insert: {
          descricao: string
          id?: string
          orcamento_id: string
          preco_unitario?: number
          quantidade?: number
          total?: number | null
        }
        Update: {
          descricao?: string
          id?: string
          orcamento_id?: string
          preco_unitario?: number
          quantidade?: number
          total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "noro_orcamentos_itens_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "noro_orcamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      noro_pedidos: {
        Row: {
          cliente_id: string | null
          created_at: string
          descricao: string | null
          id: string
          lead_id: string | null
          numero: string | null
          status: string
          valor_total: number
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          lead_id?: string | null
          numero?: string | null
          status?: string
          valor_total?: number
        }
        Update: {
          cliente_id?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          lead_id?: string | null
          numero?: string | null
          status?: string
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "noro_pedidos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "noro_clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "noro_pedidos_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "noro_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      noro_pedidos_itens: {
        Row: {
          descricao: string
          id: string
          pedido_id: string
          preco_unitario: number
          quantidade: number
          total: number | null
        }
        Insert: {
          descricao: string
          id?: string
          pedido_id: string
          preco_unitario?: number
          quantidade?: number
          total?: number | null
        }
        Update: {
          descricao?: string
          id?: string
          pedido_id?: string
          preco_unitario?: number
          quantidade?: number
          total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "noro_pedidos_itens_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "noro_pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      noro_pedidos_timeline: {
        Row: {
          created_at: string
          id: string
          mensagem: string | null
          pedido_id: string
          tipo: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          mensagem?: string | null
          pedido_id: string
          tipo: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          mensagem?: string | null
          pedido_id?: string
          tipo?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "noro_pedidos_timeline_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "noro_pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      noro_tarefas: {
        Row: {
          cliente_id: string | null
          created_at: string
          descricao: string | null
          due_date: string | null
          id: string
          lead_id: string | null
          responsavel: string | null
          status: string
          titulo: string
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string
          descricao?: string | null
          due_date?: string | null
          id?: string
          lead_id?: string | null
          responsavel?: string | null
          status?: string
          titulo: string
        }
        Update: {
          cliente_id?: string | null
          created_at?: string
          descricao?: string | null
          due_date?: string | null
          id?: string
          lead_id?: string | null
          responsavel?: string | null
          status?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "noro_tarefas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "noro_clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "noro_tarefas_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "noro_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      noro_transacoes: {
        Row: {
          created_at: string
          external_id: string | null
          id: string
          metodo: string | null
          pedido_id: string | null
          status: string
          tipo: string
          valor: number
        }
        Insert: {
          created_at?: string
          external_id?: string | null
          id?: string
          metodo?: string | null
          pedido_id?: string | null
          status?: string
          tipo: string
          valor?: number
        }
        Update: {
          created_at?: string
          external_id?: string | null
          id?: string
          metodo?: string | null
          pedido_id?: string | null
          status?: string
          tipo?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "noro_transacoes_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "noro_pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      noro_users: {
        Row: {
          created_at: string
          display_name: string | null
          email: string
          id: string
          role: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email: string
          id?: string
          role?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string
          id?: string
          role?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      citext: {
        Args: { "": boolean } | { "": string } | { "": unknown }
        Returns: string
      }
      citext_hash: {
        Args: { "": string }
        Returns: number
      }
      citextin: {
        Args: { "": unknown }
        Returns: string
      }
      citextout: {
        Args: { "": string }
        Returns: unknown
      }
      citextrecv: {
        Args: { "": unknown }
        Returns: string
      }
      citextsend: {
        Args: { "": string }
        Returns: string
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

export default Database
