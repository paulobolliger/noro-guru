// lib/schemas/pagamento.schema.ts
import { z } from 'zod';

/**
 * Schema para criar novo pagamento
 */
export const createPagamentoSchema = z.object({
  // Relacionamentos
  pedido_id: z.string().uuid('ID de pedido inválido'),
  cliente_id: z.string().uuid('ID de cliente inválido'),

  // Valor
  valor: z.number().positive('Valor deve ser positivo'),
  moeda: z.enum(['EUR', 'USD', 'BRL']).default('EUR'),

  // Forma de pagamento
  forma_pagamento: z.enum([
    'dinheiro',
    'transferencia',
    'cartao_credito',
    'cartao_debito',
    'pix',
    'boleto',
    'outro'
  ]),

  // Status
  status: z.enum(['pendente', 'confirmado', 'cancelado', 'reembolsado']).default('pendente'),

  // Data de pagamento
  data_pagamento: z.string().optional(), // ISO date string

  // Referências
  referencia_externa: z.string().optional(), // ID da transação no gateway
  comprovante_url: z.string().url().optional(),

  // Observações
  observacoes: z.string().optional(),
});

/**
 * Schema para atualizar pagamento
 */
export const updatePagamentoSchema = createPagamentoSchema.partial().extend({
  id: z.string().uuid('ID inválido'),
});

/**
 * Schema para confirmar pagamento
 */
export const confirmarPagamentoSchema = z.object({
  id: z.string().uuid('ID inválido'),
  data_pagamento: z.string(), // ISO date string
  referencia_externa: z.string().optional(),
  comprovante_url: z.string().url().optional(),
  observacoes: z.string().optional(),
});

/**
 * Schema para cancelar/reembolsar pagamento
 */
export const cancelarPagamentoSchema = z.object({
  id: z.string().uuid('ID inválido'),
  tipo: z.enum(['cancelar', 'reembolsar']),
  motivo: z.string().min(10, 'Motivo deve ter no mínimo 10 caracteres'),
  valor_reembolso: z.number().positive().optional(),
});

/**
 * Schema para buscar pagamentos com filtros
 */
export const searchPagamentosSchema = z.object({
  cliente_id: z.string().uuid().optional(),
  pedido_id: z.string().uuid().optional(),
  status: z.enum(['pendente', 'confirmado', 'cancelado', 'reembolsado', 'todos']).default('todos'),
  forma_pagamento: z.enum([
    'dinheiro',
    'transferencia',
    'cartao_credito',
    'cartao_debito',
    'pix',
    'boleto',
    'outro',
    'todos'
  ]).default('todos'),
  data_inicio: z.string().optional(),
  data_fim: z.string().optional(),
  valor_min: z.number().min(0).optional(),
  valor_max: z.number().min(0).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.enum(['data_criacao', 'data_pagamento', 'valor']).default('data_pagamento'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * Schema para relatório de pagamentos
 */
export const relatorioePagamentosSchema = z.object({
  data_inicio: z.string(), // ISO date string
  data_fim: z.string(), // ISO date string
  agrupar_por: z.enum(['dia', 'semana', 'mes']).default('dia'),
  status: z.enum(['pendente', 'confirmado', 'cancelado', 'reembolsado', 'todos']).default('confirmado'),
  moeda: z.enum(['EUR', 'USD', 'BRL', 'todas']).default('todas'),
});

/**
 * Types inferidos dos schemas
 */
export type CreatePagamentoInput = z.infer<typeof createPagamentoSchema>;
export type UpdatePagamentoInput = z.infer<typeof updatePagamentoSchema>;
export type ConfirmarPagamentoInput = z.infer<typeof confirmarPagamentoSchema>;
export type CancelarPagamentoInput = z.infer<typeof cancelarPagamentoSchema>;
export type SearchPagamentosInput = z.infer<typeof searchPagamentosSchema>;
export type RelatorioPagamentosInput = z.infer<typeof relatorioePagamentosSchema>;
