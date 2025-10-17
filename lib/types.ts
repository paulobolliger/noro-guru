// lib/types.ts

// Lista de categorias de Roteiros
export const RoteiroCategorias = [
  'Viagens Solo',
  'Viagens em Família',
  'Lua de Mel & Românticas',
  'Expedições de Aventura',
  'Cultura & Gastronomia',
  'Bem-estar & Transformação',
  'Luxo & Experiências Exclusivas',
  'Ecoturismo & Sustentabilidade',
  'Work & Travel (Nômade Digital)',
  'Eventos & Temporadas Especiais'
] as const;
export type RoteiroCategoria = typeof RoteiroCategorias[number];

// Lista de categorias do Blog
export const BlogCategorias = [
  'Inspiração & Tendências',
  'Guia do Viajante Solo',
  'Família & Crianças',
  'Cultura & Experiências Locais',
  'Sustentabilidade & Turismo Consciente',
  'Planejamento & Dicas Práticas',
  'Nômade Digital & Trabalho Remoto',
  'Bem-estar & Autoconhecimento',
  'Luxo & Experiências Exclusivas',
  'Bastidores da NOMADE GURU'
] as const;
export type BlogCategoria = typeof BlogCategorias[number];


// Interface para o itinerário diário dentro de um roteiro
export interface DetalheDia {
  dia: number;
  titulo: string;
  descricao: string;
}

// Interface principal para a tabela nomade_roteiros
export interface Roteiro {
  id: string;
  created_at: string;
  updated_at?: string | null;
  titulo: string;
  slug: string;
  status: 'published' | 'draft';
  destaque?: boolean | null;
  duracao_dias: number | null;
  preco_base: number | null;
  descricao_curta: string | null;
  imagem_url: string | null; // Esta continua correta para os roteiros
  imagem_alt_text?: string | null;
  detalhes: DetalheDia[] | null;
  categoria?: RoteiroCategoria | null;
  // Campos de SEO
  meta_title?: string | null;
  meta_description?: string | null;
  keywords?: string[] | null;
  canonical_url?: string | null;
  // Open Graph Fields
  og_title?: string | null;
  og_description?: string | null;
  og_image_url?: string | null;
  og_image_alt_text?: string | null;
}

// Interface principal para a tabela nomade_blog_posts
export interface BlogPost {
  id: string;
  created_at: string;
  updated_at?: string | null;
  titulo: string;
  slug: string;
  status: 'published' | 'draft';
  destaque?: boolean | null;
  resumo: string | null;
  conteudo: string | null;
  imagem_capa_url: string | null; // <-- CORREÇÃO APLICADA AQUI
  imagem_alt_text?: string | null;
  categoria?: BlogCategoria | null;
  roteiro_relacionado_id?: string | null;
  // Opcional: para quando o Supabase traz o roteiro completo relacionado
  nomade_roteiros?: Roteiro | null;
  // SEO Fields
  meta_title?: string | null;
  meta_description?: string | null;
  keywords?: string[] | null;
  canonical_url?: string | null;
  // Open Graph Fields
  og_title?: string | null;
  og_description?: string | null;
  og_image_url?: string | null;
  og_image_alt_text?: string | null;
}