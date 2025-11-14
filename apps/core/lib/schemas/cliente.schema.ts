// lib/schemas/cliente.schema.ts
import { z } from 'zod';

/**
 * Schema para dados de endereço
 */
export const enderecoSchema = z.object({
  rua: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
  pais: z.string().optional(),
});

/**
 * Schema para contato de emergência
 */
export const contatoEmergenciaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  telefone: z.string().min(1, 'Telefone é obrigatório'),
  relacao: z.string().optional(),
});

/**
 * Schema para preferências de viagem
 */
export const preferenciasViagemSchema = z.object({
  tipo_acomodacao: z.enum(['economica', 'standard', 'luxo']).optional(),
  assento_preferido: z.enum(['janela', 'corredor', 'meio']).optional(),
  restricoes_alimentares: z.array(z.string()).optional(),
  necessidades_especiais: z.string().optional(),
  atividades_favoritas: z.array(z.string()).optional(),
  destinos_interesse: z.array(z.string()).optional(),
});

/**
 * Schema para criar novo cliente
 */
export const createClienteSchema = z.object({
  // Dados pessoais (obrigatórios)
  nome_completo: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(8, 'Telefone inválido'),

  // Dados pessoais (opcionais)
  data_nascimento: z.string().optional(),
  cpf: z.string().optional(),
  passaporte: z.string().optional(),
  nacionalidade: z.string().optional(),

  // Endereço
  endereco: enderecoSchema.optional(),

  // Contatos
  telefone_alternativo: z.string().optional(),
  contato_emergencia: contatoEmergenciaSchema.optional(),

  // Preferências
  preferencias_viagem: preferenciasViagemSchema.optional(),

  // Milhas
  milhas_acumuladas: z.number().min(0).default(0),

  // Tags
  tags: z.array(z.string()).optional(),

  // Observações
  observacoes: z.string().optional(),
});

/**
 * Schema para atualizar cliente existente
 * Todos os campos são opcionais
 */
export const updateClienteSchema = createClienteSchema.partial();

/**
 * Schema para buscar clientes com filtros
 */
export const searchClientesSchema = z.object({
  query: z.string().optional(),
  status: z.enum(['ativo', 'inativo', 'todos']).default('todos'),
  tags: z.array(z.string()).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.enum(['nome', 'data_criacao', 'ultima_viagem']).default('nome'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

/**
 * Types inferidos dos schemas
 */
export type CreateClienteInput = z.infer<typeof createClienteSchema>;
export type UpdateClienteInput = z.infer<typeof updateClienteSchema>;
export type SearchClientesInput = z.infer<typeof searchClientesSchema>;
export type Endereco = z.infer<typeof enderecoSchema>;
export type ContatoEmergencia = z.infer<typeof contatoEmergenciaSchema>;
export type PreferenciasViagem = z.infer<typeof preferenciasViagemSchema>;
