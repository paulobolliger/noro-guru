export type PedidoItemRow = {
  id: string;
  pedido_id?: string | null;
  servico_nome: string;
  quantidade: number;
  valor_unitario: number;
  valor_total?: number | null;
  created_at?: string | null;
  [key: string]: any;
};

export type PedidoComRelacionamentos = {
  id: string;
  status: string;
  valor_total: number | null;
  cliente_id: string | null;
  orcamento_id?: string | null;
  created_at?: string | null;
  clientes?: {
    nome?: string | null;
    nome_completo?: string | null;
    email?: string | null;
    telefone?: string | null;
    taxId?: string | null;
    cep?: string | null;
    logradouro?: string | null;
    numero?: string | null;
    bairro?: string | null;
    cidade?: string | null;
    estado?: string | null;
  } | null;
  pedido_itens?: PedidoItemRow[] | null;
  cobrancas?: Array<Record<string, unknown>> | null;
};
