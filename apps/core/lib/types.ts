export interface ValidationStatus {
  status: 'success' | 'warning' | 'error';
  missing: string[];
}

export interface ContentValidation {
  seo: ValidationStatus;
  openGraph: ValidationStatus;
  otherFields: ValidationStatus;
}

export interface BaseContent {
  id: string;
  titulo: string;
  conteudo: any;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  tenant_id: string;
}

export interface Roteiro extends BaseContent {
  destino: string;
  tipo: string;
  dificuldade: string;
  // Add other roteiro specific fields here
}

export interface Artigo extends BaseContent {
  categoria: string;
  tom_voz: string;
  tamanho: string;
  // Add other artigo specific fields here
}

export interface RoteiroWithValidation extends Roteiro {
  descricao_curta?: string;
  validation?: ContentValidation;
  total_cost?: number;
}

export interface BlogPostWithValidation extends Artigo {
  resumo?: string;
  validation?: ContentValidation;
  total_cost?: number;
}

export const BlogCategorias = [
  'Dicas de Viagem',
  'Destinos',
  'Gastronomia',
  'Hospedagem',
  'Cultura Local',
  'Planejamento',
  'Sustentabilidade',
];

export const RoteiroCategorias = [
  'Viagem Solo',
  'Casal',
  'Família',
  'Amigos',
  'Negócios',
];
