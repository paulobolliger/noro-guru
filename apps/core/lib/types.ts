export interface ValidationStatus {
  status: 'success' | 'warning' | 'error' | 'complete' | 'incomplete' | string;
  missing: string[];
  filledCount?: number;
  total?: number;
}

export interface ContentValidation {
  seo: ValidationStatus;
  openGraph: ValidationStatus;
  otherFields: ValidationStatus;
  canPublish?: boolean;
  missingCount?: number;
}

export interface BaseContent {
  id: string;
  titulo: string;
  conteudo: any;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  tenant_id: string;
  [key: string]: any;
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

export type BlogPost = Artigo;

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

export type SocialNetworkType =
  | 'instagram'
  | 'facebook'
  | 'tiktok'
  | 'youtube'
  | 'pinterest';

export type ConnectionStatus = 'connected' | 'disconnected' | 'error' | 'expired';

export interface SocialAccountInfo {
  id?: string;
  username?: string;
  name?: string;
  display_name?: string;
  followers_count?: number;
  profile_picture_url?: string;
  [key: string]: any;
}

export interface InstagramCredentials {
  app_id: string;
  app_secret: string;
  access_token: string;
  refresh_token?: string;
  account_id?: string;
  user_id?: string;
}

export interface SocialNetworkConfig {
  id?: string;
  network: SocialNetworkType;
  status: ConnectionStatus;
  enabled?: boolean;
  credentials?: InstagramCredentials | Record<string, unknown>;
  account_info?: SocialAccountInfo;
  connected_at?: string;
  last_tested_at?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}
