// lib/schemas/pedido.schema.ts
import { z } from 'zod';

/**
 * Schema para item de pedido
 */
export const itemPedidoSchema = z.object({
  tipo: z.enum(['transporte', 'hospedagem', 'passeio', 'alimentacao', 'seguro', 'outro']),
  descricao: z.string().min(3, 'Descrição deve ter no mínimo 3 caracteres'),
  fornecedor: z.string().optional(),
  referencia_externa: z.string().optional(), // Código de reserva, voucher, etc
  quantidade: z.number().int().positive().default(1),
  valor_unitario: z.number().positive('Valor deve ser positivo'),
  valor_total: z.number().positive('Valor total deve ser positivo'),
  data_inicio: z.string().optional(), // ISO date string
  data_fim: z.string().optional(), // ISO date string
  status: z.enum(['pendente', 'confirmado', 'cancelado']).default('pendente'),
  observacoes: z.string().optional(),
});

/**
 * Schema para criar novo pedido
 */
export const createPedidoSchema = z.object({
  // Relacionamentos
  cliente_id: z.string().uuid('ID de cliente inválido'),
  orcamento_id: z.string().uuid('ID de orçamento inválido').optional(),

  // Dados da viagem
  destino: z.string().min(2, 'Destino deve ter no mínimo 2 caracteres'),
  data_inicio: z.string(), // ISO date string - obrigatório
  data_fim: z.string(), // ISO date string - obrigatório
  numero_viajantes: z.number().int().positive().default(1),

  // Items do pedido
  items: z.array(itemPedidoSchema).min(1, 'Pedido deve ter pelo menos 1 item'),

  // Valores
  valor_total: z.number().positive('Valor total deve ser positivo'),
  valor_pago: z.number().min(0).default(0),
  moeda: z.enum(['EUR', 'USD', 'BRL']).default('EUR'),

  // Status
  status: z.enum(['pendente', 'confirmado', 'em_andamento', 'concluido', 'cancelado']).default('pendente'),

  // Observações
  observacoes: z.string().optional(),
  observacoes_internas: z.string().optional(),

  // Tags
  tags: z.array(z.string()).optional(),
});

/**
 * Schema para atualizar pedido
 */
export const updatePedidoSchema = createPedidoSchema.partial().extend({
  id: z.string().uuid('ID inválido'),
});

/**
 * Schema para atualizar status do pedido
 */
export const updateStatusPedidoSchema = z.object({
  id: z.string().uuid('ID inválido'),
  status: z.enum(['pendente', 'confirmado', 'em_andamento', 'concluido', 'cancelado']),
  observacoes: z.string().optional(),
});

/**
 * Schema para cancelar pedido
 */
export const cancelarPedidoSchema = z.object({
  id: z.string().uuid('ID inválido'),
  motivo: z.string().min(10, 'Motivo deve ter no mínimo 10 caracteres'),
  reembolso_total: z.boolean().default(false),
  valor_reembolso: z.number().min(0).optional(),
});

/**
 * Schema para buscar pedidos com filtros
 */
export const searchPedidosSchema = z.object({
  cliente_id: z.string().uuid().optional(),
  status: z.enum(['pendente', 'confirmado', 'em_andamento', 'concluido', 'cancelado', 'todos']).default('todos'),
  destino: z.string().optional(),
  data_inicio: z.string().optional(),
  data_fim: z.string().optional(),
  valor_min: z.number().min(0).optional(),
  valor_max: z.number().min(0).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.enum(['data_criacao', 'data_inicio', 'valor_total']).default('data_inicio'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * Types inferidos dos schemas
 */
export type CreatePedidoInput = z.infer<typeof createPedidoSchema>;
export type UpdatePedidoInput = z.infer<typeof updatePedidoSchema>;
export type UpdateStatusPedidoInput = z.infer<typeof updateStatusPedidoSchema>;
export type CancelarPedidoInput = z.infer<typeof cancelarPedidoSchema>;
export type SearchPedidosInput = z.infer<typeof searchPedidosSchema>;
export type ItemPedido = z.infer<typeof itemPedidoSchema>;
