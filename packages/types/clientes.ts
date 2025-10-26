// ============================================================================
// TIPOS - MÓDULO CLIENTES
// ============================================================================

export type ClienteStatus = 'ativo' | 'inativo' | 'vip' | 'blacklist';
export type ClienteTipo = 'pessoa_fisica' | 'pessoa_juridica';
export type ClienteSegmento = 'luxo' | 'familia' | 'aventura' | 'corporativo' | 'mochileiro' | 'romantico';
export type ClienteNivel = 'bronze' | 'prata' | 'ouro' | 'platina' | 'diamante';

export interface Cliente {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  whatsapp?: string;
  cpf?: string;
  passaporte?: string;
  data_nascimento?: string;
  nacionalidade?: string;
  profissao?: string;
  
  status: ClienteStatus;
  tipo: ClienteTipo;
  segmento?: ClienteSegmento;
  nivel: ClienteNivel;
  
  origem_lead_id?: string;
  agente_responsavel_id?: string;
  
  total_viagens: number;
  total_gasto: number;
  ticket_medio: number;
  nps_score?: number;
  
  data_primeiro_contato?: string;
  data_ultima_viagem?: string;
  data_proxima_viagem?: string;
  data_ultimo_contato?: string;
  
  idioma_preferido: string;
  moeda_preferida: string;
  
  tags?: string[];
  metadata?: Record<string, any>;
  observacoes?: string;
  
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  
  // Relacionamentos (quando fazer join)
  agente?: {
    id: string;
    nome: string;
    email: string;
  };
  origem_lead?: {
    id: string;
    nome: string;
    email: string;
    origem: string;
  };
}

// ============================================================================
// DOCUMENTOS
// ============================================================================

export type DocumentoTipo = 
  | 'passaporte' 
  | 'visto' 
  | 'rg' 
  | 'cpf' 
  | 'cnh' 
  | 'vacina' 
  | 'certidao';

export type DocumentoStatus = 'valido' | 'vencido' | 'pendente' | 'renovando';

export interface ClienteDocumento {
  id: string;
  cliente_id: string;
  tipo: DocumentoTipo;
  numero?: string;
  pais_emissor?: string;
  orgao_emissor?: string;
  data_emissao?: string;
  data_validade?: string;
  status: DocumentoStatus;
  arquivo_url?: string;
  arquivo_public_id?: string;
  arquivo_nome?: string;
  arquivo_tamanho?: number;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// PREFERÊNCIAS
// ============================================================================

export type FrequenciaViagem = 'mensal' | 'trimestral' | 'semestral' | 'anual' | 'eventual';
export type OrcamentoMedio = 'economico' | 'moderado' | 'confortavel' | 'luxo' | 'ultra_luxo';
export type EstiloViagem = 
  | 'aventura' 
  | 'relaxante' 
  | 'cultural' 
  | 'gastronomico' 
  | 'romantico' 
  | 'familia' 
  | 'negocios';

export type AssentoPreferido = 'janela' | 'corredor' | 'qualquer';
export type ClassePreferida = 'economica' | 'economica_premium' | 'executiva' | 'primeira_classe';

export type TipoHospedagem = 
  | 'hotel' 
  | 'resort' 
  | 'pousada' 
  | 'hostel' 
  | 'apartamento' 
  | 'casa' 
  | 'camping';

export type CategoriaHotel = '3_estrelas' | '4_estrelas' | '5_estrelas' | 'boutique' | 'luxo';

export type RestricaoAlimentar = 
  | 'vegetariano' 
  | 'vegano' 
  | 'sem_gluten' 
  | 'sem_lactose' 
  | 'halal' 
  | 'kosher';

export type RefeicaoPreferida = 
  | 'cafe_manha' 
  | 'meia_pensao' 
  | 'pensao_completa' 
  | 'all_inclusive';

export interface ClientePreferencias {
  id: string;
  cliente_id: string;
  
  // Viagem
  frequencia_viagem?: FrequenciaViagem;
  orcamento_medio?: OrcamentoMedio;
  estilo_viagem?: EstiloViagem[];
  destinos_favoritos?: string[];
  destinos_desejados?: string[];
  
  // Aéreo
  assento_preferido?: AssentoPreferido;
  classe_preferida?: ClassePreferida;
  cia_aerea_preferida?: string[];
  programas_fidelidade?: Array<{
    cia: string;
    numero: string;
    categoria: string;
  }>;
  
  // Hospedagem
  tipo_hospedagem?: TipoHospedagem[];
  preferencias_quarto?: string;
  categoria_hotel?: CategoriaHotel;
  
  // Alimentação
  restricoes_alimentares?: RestricaoAlimentar[];
  refeicao_preferida?: RefeicaoPreferida;
  
  // Especiais
  necessidades_especiais?: string;
  mobilidade_reduzida: boolean;
  viaja_com_criancas: boolean;
  idade_criancas?: number[];
  viaja_com_pets: boolean;
  
  // Seguros
  seguro_preferido?: string;
  cobertura_minima?: number;
  cobertura_covid: boolean;
  
  // Extras
  aluguel_carro: boolean;
  categoria_carro?: string;
  tours_guiados: boolean;
  transfers: boolean;
  
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// ENDEREÇOS
// ============================================================================

export type EnderecoTipo = 'residencial' | 'comercial' | 'cobranca' | 'entrega';

export interface ClienteEndereco {
  id: string;
  cliente_id: string;
  tipo: EnderecoTipo;
  principal: boolean;
  logradouro: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade: string;
  estado?: string;
  cep?: string;
  pais: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// CONTATOS DE EMERGÊNCIA
// ============================================================================

export type Parentesco = 
  | 'pai' 
  | 'mae' 
  | 'conjuge' 
  | 'filho' 
  | 'filha' 
  | 'irmao' 
  | 'irma' 
  | 'amigo' 
  | 'outro';

export interface ClienteContatoEmergencia {
  id: string;
  cliente_id: string;
  nome: string;
  parentesco?: Parentesco;
  telefone: string;
  email?: string;
  observacoes?: string;
  created_at: string;
}

// ============================================================================
// MILHAS
// ============================================================================

export type CompanhiaMilhas = 
  | 'TAP' 
  | 'Latam' 
  | 'Azul' 
  | 'Gol' 
  | 'Smiles' 
  | 'Livelo' 
  | 'Emirates' 
  | 'United' 
  | 'American Airlines'
  | 'Air France/KLM'
  | 'Outro';

export type CategoriaMilhas = 
  | 'basico' 
  | 'prata' 
  | 'ouro' 
  | 'platina' 
  | 'diamante' 
  | 'titanio';

export interface ClienteMilhas {
  id: string;
  cliente_id: string;
  companhia: CompanhiaMilhas | string;
  numero_programa: string;
  categoria?: CategoriaMilhas;
  saldo_estimado?: number;
  data_validade?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// HISTÓRICO E TIMELINE
// ============================================================================

export interface ClienteHistoricoItem {
  id: string;
  tipo: 'orcamento' | 'pedido' | 'transacao';
  titulo: string;
  data: string;
  valor?: number;
  status: string;
  detalhes?: Record<string, any>;
}

export interface ClienteTimelineItem {
  id: string;
  tipo: 'interacao' | 'documento' | 'orcamento' | 'pedido' | 'transacao' | 'nota';
  titulo: string;
  descricao?: string;
  data: string;
  usuario?: {
    nome: string;
    avatar?: string;
  };
  metadata?: Record<string, any>;
}

// ============================================================================
// ESTATÍSTICAS DO CLIENTE
// ============================================================================

export interface ClienteEstatisticas {
  total_orcamentos: number;
  total_pedidos: number;
  taxa_conversao: number;
  ticket_medio: number;
  total_gasto: number;
  ultima_interacao: string;
  proxima_viagem?: string;
  documentos_vencendo: number;
}

// ============================================================================
// FILTROS E ORDENAÇÃO
// ============================================================================

export interface ClienteFiltros {
  status?: ClienteStatus[];
  segmento?: ClienteSegmento[];
  nivel?: ClienteNivel[];
  agente_id?: string;
  busca?: string;
  tags?: string[];
  data_cadastro_inicio?: string;
  data_cadastro_fim?: string;
}

export type ClienteOrdenacao = 
  | 'nome_asc' 
  | 'nome_desc' 
  | 'data_cadastro_asc' 
  | 'data_cadastro_desc'
  | 'total_gasto_asc'
  | 'total_gasto_desc'
  | 'ultima_viagem_asc'
  | 'ultima_viagem_desc';

// ============================================================================
// FORMS
// ============================================================================

export interface ClienteFormData {
  nome: string;
  email?: string;
  telefone?: string;
  whatsapp?: string;
  cpf?: string;
  passaporte?: string;
  data_nascimento?: string;
  nacionalidade?: string;
  profissao?: string;
  status: ClienteStatus;
  tipo: ClienteTipo;
  segmento?: ClienteSegmento;
  nivel: ClienteNivel;
  idioma_preferido: string;
  moeda_preferida: string;
  observacoes?: string;
}

export interface DocumentoFormData {
  tipo: DocumentoTipo;
  numero?: string;
  pais_emissor?: string;
  orgao_emissor?: string;
  data_emissao?: string;
  data_validade?: string;
  status: DocumentoStatus;
  arquivo_url?: string;
  arquivo_public_id?: string;
  arquivo_nome?: string;
  arquivo_tamanho?: number;
  observacoes?: string;
}

export interface EnderecoFormData {
  tipo: EnderecoTipo;
  principal: boolean;
  logradouro: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade: string;
  estado?: string;
  cep?: string;
  pais: string;
}

export interface ContatoEmergenciaFormData {
  nome: string;
  parentesco?: Parentesco;
  telefone: string;
  email?: string;
  observacoes?: string;
}

export interface MilhasFormData {
  companhia: CompanhiaMilhas | string;
  numero_programa: string;
  categoria?: CategoriaMilhas;
  saldo_estimado?: number;
  data_validade?: string;
  observacoes?: string;
}