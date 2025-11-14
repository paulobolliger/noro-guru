// lib/schemas/usuario.schema.ts
import { z } from 'zod';

/**
 * Schema para criar/convidar novo usuário
 */
export const createUsuarioSchema = z.object({
  // Dados básicos
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),

  // Role/Permissão
  role: z.enum(['admin', 'gestor', 'agente', 'visualizador']),

  // Dados opcionais
  telefone: z.string().optional(),
  avatar_url: z.string().url().optional(),
  cargo: z.string().optional(),
  departamento: z.string().optional(),

  // Status
  ativo: z.boolean().default(true),
});

/**
 * Schema para atualizar usuário
 */
export const updateUsuarioSchema = createUsuarioSchema.partial().extend({
  id: z.string().uuid('ID inválido'),
});

/**
 * Schema para atualizar role de usuário
 */
export const updateRoleSchema = z.object({
  id: z.string().uuid('ID inválido'),
  role: z.enum(['admin', 'gestor', 'agente', 'visualizador']),
});

/**
 * Schema para ativar/desativar usuário
 */
export const toggleStatusUsuarioSchema = z.object({
  id: z.string().uuid('ID inválido'),
  ativo: z.boolean(),
  motivo: z.string().optional(),
});

/**
 * Schema para configurações de usuário
 */
export const configuracoesUsuarioSchema = z.object({
  tema: z.enum(['light', 'dark', 'auto']).default('light'),
  idioma: z.enum(['pt', 'en', 'es']).default('pt'),
  notificacoes_email: z.boolean().default(true),
  notificacoes_push: z.boolean().default(false),
  densidade_tabela: z.enum(['compacta', 'confortavel', 'espaçosa']).default('confortavel'),
  items_por_pagina: z.number().int().positive().min(10).max(100).default(20),
});

/**
 * Schema para buscar usuários com filtros
 */
export const searchUsuariosSchema = z.object({
  query: z.string().optional(),
  role: z.enum(['admin', 'gestor', 'agente', 'visualizador', 'todos']).default('todos'),
  ativo: z.enum(['sim', 'nao', 'todos']).default('todos'),
  departamento: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.enum(['nome', 'email', 'data_criacao', 'ultimo_acesso']).default('nome'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

/**
 * Schema para alterar senha
 */
export const alterarSenhaSchema = z.object({
  senha_atual: z.string().min(8, 'Senha atual é obrigatória'),
  senha_nova: z.string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
  confirmar_senha: z.string(),
}).refine((data) => data.senha_nova === data.confirmar_senha, {
  message: 'As senhas não coincidem',
  path: ['confirmar_senha'],
});

/**
 * Schema para redefinir senha (via email)
 */
export const redefinirSenhaSchema = z.object({
  email: z.string().email('Email inválido'),
});

/**
 * Schema para logs de auditoria de usuário
 */
export const logAuditoriaSchema = z.object({
  usuario_id: z.string().uuid(),
  acao: z.string().min(3, 'Ação deve ter no mínimo 3 caracteres'),
  entidade_tipo: z.string(), // 'cliente', 'pedido', 'pagamento', etc
  entidade_id: z.string().uuid().optional(),
  detalhes: z.record(z.any()).optional(),
  ip: z.string().optional(),
  user_agent: z.string().optional(),
});

/**
 * Types inferidos dos schemas
 */
export type CreateUsuarioInput = z.infer<typeof createUsuarioSchema>;
export type UpdateUsuarioInput = z.infer<typeof updateUsuarioSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
export type ToggleStatusUsuarioInput = z.infer<typeof toggleStatusUsuarioSchema>;
export type ConfiguracoesUsuario = z.infer<typeof configuracoesUsuarioSchema>;
export type SearchUsuariosInput = z.infer<typeof searchUsuariosSchema>;
export type AlterarSenhaInput = z.infer<typeof alterarSenhaSchema>;
export type RedefinirSenhaInput = z.infer<typeof redefinirSenhaSchema>;
export type LogAuditoria = z.infer<typeof logAuditoriaSchema>;
