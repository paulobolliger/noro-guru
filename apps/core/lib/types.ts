// lib/types.ts

/**
 * Categorias de roteiros
 */
export const RoteiroCategorias = [
  'Roteiro Completo',
  'Roteiro Rápido',
  'Roteiro de Fim de Semana',
  'Roteiro Econômico',
  'Roteiro Luxo',
  'Roteiro Família',
  'Roteiro Casal',
  'Roteiro Solo',
  'Roteiro Aventura',
  'Roteiro Cultural',
  'Roteiro Gastronômico',
  'Roteiro Natureza',
] as const;

/**
 * Categorias de artigos de blog
 */
export const ArtigoCategorias = [
  'Dicas de Viagem',
  'Destinos',
  'Cultura',
  'Gastronomia',
  'Aventura',
  'Planejamento',
  'Documentação',
  'Saúde e Segurança',
  'Economia',
  'Hospedagem',
  'Transporte',
  'Guias',
] as const;

// Alias para compatibilidade
export const BlogCategorias = ArtigoCategorias;

export type RoteiroCategoria = typeof RoteiroCategorias[number];
export type ArtigoCategoria = typeof ArtigoCategorias[number];
export type BlogCategoria = typeof BlogCategorias[number];

/**
 * Interface para conteúdo gerado por IA
 */
export interface AIGeneratedContent {
  id: string;
  titulo: string;
  slug: string;
  conteudo: string;
  tipo: 'roteiro' | 'artigo';
  status: 'draft' | 'published' | 'archived';
  categoria?: string;
  tags?: string[];
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  created_at?: string;
  updated_at?: string;
  published_at?: string | null;
}

/**
 * Opções para geração em massa
 */
export interface BulkGenerationOptions {
  tipo?: string;
  dificuldade?: string;
  categoria?: string;
  duracao?: string;
  [key: string]: string | undefined;
}
