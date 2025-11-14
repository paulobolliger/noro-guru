// lib/schemas/notificacao.schema.ts
import { z } from 'zod';

/**
 * Tipos de notificação
 */
export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  BOOKING = 'booking',
  PAYMENT = 'payment',
  MESSAGE = 'message',
  SYSTEM = 'system',
}

/**
 * Schema para criar notificação
 */
export const createNotificacaoSchema = z.object({
  // Destinatário
  user_id: z.string().uuid('ID de usuário inválido'),

  // Tipo e conteúdo
  tipo: z.nativeEnum(NotificationType),
  titulo: z.string().min(1, 'Título é obrigatório').max(200),
  mensagem: z.string().min(1, 'Mensagem é obrigatória').max(1000),

  // Links e ações
  link: z.string().url().optional(),
  action_label: z.string().max(50).optional(),
  action_url: z.string().url().optional(),

  // Metadados adicionais
  metadata: z.record(z.any()).optional(),

  // Prioridade
  prioridade: z.enum(['baixa', 'normal', 'alta', 'urgente']).default('normal'),

  // Expiração (opcional)
  expira_em: z.string().optional(), // ISO date string
});

/**
 * Schema para atualizar notificação
 */
export const updateNotificacaoSchema = z.object({
  id: z.string().uuid('ID inválido'),
  lida: z.boolean().optional(),
  arquivada: z.boolean().optional(),
});

/**
 * Schema para marcar como lida
 */
export const marcarLidaSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

/**
 * Schema para marcar múltiplas como lidas
 */
export const marcarTodasLidasSchema = z.object({
  ids: z.array(z.string().uuid()).optional(), // Se vazio, marca todas
  ate_data: z.string().optional(), // Marca todas até esta data
});

/**
 * Schema para buscar notificações
 */
export const searchNotificacoesSchema = z.object({
  user_id: z.string().uuid().optional(), // Auto-preenchido pelo backend
  tipo: z.nativeEnum(NotificationType).optional(),
  lida: z.boolean().optional(),
  arquivada: z.boolean().optional(),
  prioridade: z.enum(['baixa', 'normal', 'alta', 'urgente']).optional(),
  limit: z.number().int().positive().max(100).default(50),
  offset: z.number().int().min(0).default(0),
  sortBy: z.enum(['data_criacao', 'prioridade']).default('data_criacao'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * Schema para deletar notificações antigas
 */
export const deleteNotificacoesAntigasSchema = z.object({
  dias: z.number().int().positive().default(30),
  apenas_lidas: z.boolean().default(true),
});

/**
 * Schema para estatísticas de notificações
 */
export const statsNotificacoesSchema = z.object({
  user_id: z.string().uuid(),
});

/**
 * Types inferidos dos schemas
 */
export type CreateNotificacaoInput = z.infer<typeof createNotificacaoSchema>;
export type UpdateNotificacaoInput = z.infer<typeof updateNotificacaoSchema>;
export type MarcarLidaInput = z.infer<typeof marcarLidaSchema>;
export type MarcarTodasLidasInput = z.infer<typeof marcarTodasLidasSchema>;
export type SearchNotificacoesInput = z.infer<typeof searchNotificacoesSchema>;
export type DeleteNotificacoesAntigasInput = z.infer<typeof deleteNotificacoesAntigasSchema>;
export type StatsNotificacoesInput = z.infer<typeof statsNotificacoesSchema>;
