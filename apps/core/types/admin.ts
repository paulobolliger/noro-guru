export interface Lead {
  id: string;
  nome: string;
  status: string;
  origem?: string | null;
  valor_estimado?: number | null;
  [key: string]: any;
}

export interface Tarefa {
  id: string;
  titulo: string;
  prioridade: string;
  data_vencimento?: string | null;
  [key: string]: any;
}
