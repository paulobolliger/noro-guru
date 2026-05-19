export type ClienteStatus = 'ativo' | 'vip' | 'inativo' | 'blacklist' | string;
export type ClienteTipo = 'pessoa_fisica' | 'pessoa_juridica' | string;
export type ClienteSegmento =
  | 'luxo'
  | 'familia'
  | 'aventura'
  | 'corporativo'
  | 'mochileiro'
  | 'romantico'
  | string;
export type ClienteNivel = 'bronze' | 'prata' | 'ouro' | 'platina' | 'diamante' | string;

export type DocumentoTipo =
  | 'passaporte'
  | 'rg'
  | 'cpf'
  | 'cnh'
  | 'visto'
  | 'outro'
  | string;

export type DocumentoStatus = 'valido' | 'vencido' | 'pendente' | 'renovando' | string;

export interface Cliente {
  id: string;
  nome: string;
  email?: string | null;
  telefone?: string | null;
  status: ClienteStatus;
  nivel: ClienteNivel;
  moeda_preferida: string;
  total_viagens: number;
  ticket_medio: number;
  total_gasto: number;
  [key: string]: any;
}
