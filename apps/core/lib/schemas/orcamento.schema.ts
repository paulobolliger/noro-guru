// lib/schemas/orcamento.schema.ts
import { z } from 'zod';

/**
 * Schema para item de orçamento
 */
export const itemOrcamentoSchema = z.object({
  tipo: z.enum(['transporte', 'hospedagem', 'passeio', 'alimentacao', 'seguro', 'outro']),
  descricao: z.string().min(3, 'Descrição deve ter no mínimo 3 caracteres'),
  quantidade: z.number().int().positive('Quantidade deve ser positiva').default(1),
  valor_unitario: z.number().positive('Valor deve ser positivo'),
  valor_total: z.number().positive('Valor total deve ser positivo'),
  observacoes: z.string().optional(),
});

/**
 * Schema para informações de pagamento
 */
export const pagamentoInfoSchema = z.object({
  forma_pagamento: z.enum(['dinheiro', 'transferencia', 'cartao_credito', 'cartao_debito', 'pix', 'boleto']).optional(),
  parcelas: z.number().int().positive().default(1),
  entrada: z.number().min(0).optional(),
  desconto: z.number().min(0).optional(),
  desconto_percentual: z.number().min(0).max(100).optional(),
});

/**
 * Schema para criar novo orçamento
 */
export const createOrcamentoSchema = z.object({
  // Relacionamentos
  cliente_id: z.string().uuid('ID de cliente inválido'),

  // Dados da viagem
  destino: z.string().min(2, 'Destino deve ter no mínimo 2 caracteres'),
  data_inicio: z.string().optional(), // ISO date string
  data_fim: z.string().optional(), // ISO date string
  numero_viajantes: z.number().int().positive('Número de viajantes deve ser positivo').default(1),

  // Items do orçamento
  items: z.array(itemOrcamentoSchema).min(1, 'Orçamento deve ter pelo menos 1 item'),

  // Valores
  valor_total: z.number().positive('Valor total deve ser positivo'),
  moeda: z.enum(['EUR', 'USD', 'BRL']).default('EUR'),

  // Pagamento
  pagamento: pagamentoInfoSchema.optional(),

  // Status
  status: z.enum(['rascunho', 'enviado', 'aprovado', 'recusado', 'expirado']).default('rascunho'),

  // Validade
  validade_ate: z.string().optional(), // ISO date string

  // Observações
  observacoes: z.string().optional(),
  observacoes_internas: z.string().optional(),

  // Tags
  tags: z.array(z.string()).optional(),
});

/**
 * Schema para atualizar orçamento
 */
export const updateOrcamentoSchema = createOrcamentoSchema.partial().extend({
  id: z.string().uuid('ID inválido'),
});

/**
 * Schema para aprovar orçamento
 */
export const aprovarOrcamentoSchema = z.object({
  id: z.string().uuid('ID inválido'),
  observacoes: z.string().optional(),
});

/**
 * Schema para recusar orçamento
 */
export const recusarOrcamentoSchema = z.object({
  id: z.string().uuid('ID inválido'),
  motivo: z.string().min(10, 'Motivo deve ter no mínimo 10 caracteres'),
});

/**
 * Schema para buscar orçamentos com filtros
 */
export const searchOrcamentosSchema = z.object({
  cliente_id: z.string().uuid().optional(),
  status: z.enum(['rascunho', 'enviado', 'aprovado', 'recusado', 'expirado', 'todos']).default('todos'),
  destino: z.string().optional(),
  data_inicio: z.string().optional(),
  data_fim: z.string().optional(),
  valor_min: z.number().min(0).optional(),
  valor_max: z.number().min(0).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.enum(['data_criacao', 'valor_total', 'data_inicio']).default('data_criacao'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * Schema para duplicar orçamento
 */
export const duplicarOrcamentoSchema = z.object({
  id: z.string().uuid('ID inválido'),
  novo_cliente_id: z.string().uuid().optional(),
});

/**
 * Types inferidos dos schemas
 */
export type CreateOrcamentoInput = z.infer<typeof createOrcamentoSchema>;
export type UpdateOrcamentoInput = z.infer<typeof updateOrcamentoSchema>;
export type AprovarOrcamentoInput = z.infer<typeof aprovarOrcamentoSchema>;
export type RecusarOrcamentoInput = z.infer<typeof recusarOrcamentoSchema>;
export type SearchOrcamentosInput = z.infer<typeof searchOrcamentosSchema>;
export type ItemOrcamento = z.infer<typeof itemOrcamentoSchema>;
export type PagamentoInfo = z.infer<typeof pagamentoInfoSchema>;
