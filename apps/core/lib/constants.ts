// lib/constants.ts

/**
 * Tipos de destinos turísticos
 */
export const DESTINATION_TYPES = [
  'Praia',
  'Montanha',
  'Cidade',
  'Aventura',
  'Cultural',
  'Gastronômico',
  'Ecoturismo',
  'Histórico',
  'Romântico',
  'Família',
  'Luxo',
  'Econômico',
  'Religioso',
  'Negócios',
] as const;

/**
 * Níveis de dificuldade para roteiros
 */
export const DIFFICULTY_LEVELS = [
  'Fácil',
  'Moderado',
  'Difícil',
  'Muito Difícil',
] as const;

/**
 * Duração típica de roteiros
 */
export const DURATION_OPTIONS = [
  '1 dia',
  '2-3 dias',
  '4-7 dias',
  '1-2 semanas',
  '2-4 semanas',
  'Mais de 1 mês',
] as const;

/**
 * Status de publicação de conteúdo
 */
export const PUBLICATION_STATUS = [
  'draft',
  'published',
  'archived',
] as const;

/**
 * Tons de escrita para artigos
 */
export const ARTICLE_TONES = [
  'Informativo',
  'Inspirador',
  'Prático',
  'Descontraído',
  'Profissional',
  'Pessoal',
  'Persuasivo',
] as const;

/**
 * Períodos para análise de custos
 */
export const COST_PERIODS = {
  '7d': { label: 'Últimos 7 dias', days: 7 },
  '30d': { label: 'Últimos 30 dias', days: 30 },
  '90d': { label: 'Últimos 90 dias', days: 90 },
  '365d': { label: 'Último ano', days: 365 },
  'all': { label: 'Todo período', days: 99999 },
} as const;

export type DestinationType = typeof DESTINATION_TYPES[number];
export type DifficultyLevel = typeof DIFFICULTY_LEVELS[number];
export type DurationOption = typeof DURATION_OPTIONS[number];
export type PublicationStatus = typeof PUBLICATION_STATUS[number];
export type ArticleTone = typeof ARTICLE_TONES[number];
export type CostPeriod = keyof typeof COST_PERIODS;
