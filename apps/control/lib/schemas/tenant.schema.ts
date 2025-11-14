// lib/schemas/tenant.schema.ts
import { z } from 'zod';

/**
 * Schema para criar novo tenant
 */
export const createTenantSchema = z.object({
  // Identificação
  name: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(255, 'Nome muito longo'),

  slug: z.string()
    .min(3, 'Slug deve ter no mínimo 3 caracteres')
    .max(50, 'Slug muito longo')
    .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens')
    .refine(val => !val.startsWith('-') && !val.endsWith('-'),
      'Slug não pode começar ou terminar com hífen'),

  // Plano
  plan: z.enum(['free', 'pro', 'enterprise']).default('free'),

  // Marca/Tipo
  marca: z.enum(['noro', 'nomade', 'safetrip', 'vistos']).optional(),

  // Contato/Billing
  billing_email: z.string().email('Email inválido'),

  // Admin inicial
  admin_email: z.string().email('Email do administrador inválido'),
  admin_name: z.string().min(3, 'Nome do administrador obrigatório'),

  // Domínio customizado (opcional)
  custom_domain: z.string().optional(),

  // Informações da empresa (opcional)
  company_info: z.object({
    cnpj: z.string().optional(),
    razao_social: z.string().optional(),
    telefone: z.string().optional(),
    endereco: z.object({
      logradouro: z.string().optional(),
      numero: z.string().optional(),
      complemento: z.string().optional(),
      bairro: z.string().optional(),
      cidade: z.string().optional(),
      estado: z.string().optional(),
      cep: z.string().optional(),
      pais: z.string().default('BR'),
    }).optional(),
  }).optional(),

  // Configurações iniciais
  settings: z.object({
    max_usuarios: z.number().int().positive().default(5),
    max_leads: z.number().int().positive().optional(),
    max_processos: z.number().int().positive().optional(),
  }).optional(),
});

/**
 * Schema para atualizar tenant
 */
export const updateTenantSchema = z.object({
  id: z.string().uuid('ID inválido'),
  name: z.string().min(3).max(255).optional(),
  status: z.enum(['provisioning', 'active', 'suspended', 'deleted']).optional(),
  plan: z.enum(['free', 'pro', 'enterprise']).optional(),
  billing_email: z.string().email().optional(),
  notes: z.string().optional(),
});

/**
 * Schema para adicionar domínio ao tenant
 */
export const addDomainSchema = z.object({
  tenant_id: z.string().uuid('ID de tenant inválido'),
  domain: z.string()
    .min(3, 'Domínio inválido')
    .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9](\.[a-z0-9][a-z0-9-]*[a-z0-9])*\.[a-z]{2,}$/i,
      'Formato de domínio inválido'),
  is_primary: z.boolean().default(false),
});

/**
 * Schema para verificar domínio
 */
export const verifyDomainSchema = z.object({
  domain_id: z.string().uuid('ID de domínio inválido'),
});

/**
 * Schema para adicionar usuário ao tenant
 */
export const addUserToTenantSchema = z.object({
  tenant_id: z.string().uuid('ID de tenant inválido'),
  email: z.string().email('Email inválido'),
  role: z.enum(['admin', 'manager', 'agent', 'finance', 'viewer']),
  name: z.string().min(3, 'Nome obrigatório'),
});

/**
 * Schema para atualizar role de usuário
 */
export const updateUserRoleSchema = z.object({
  tenant_id: z.string().uuid('ID de tenant inválido'),
  user_id: z.string().uuid('ID de usuário inválido'),
  role: z.enum(['admin', 'manager', 'agent', 'finance', 'viewer']),
});

/**
 * Schema para suspender tenant
 */
export const suspendTenantSchema = z.object({
  tenant_id: z.string().uuid('ID de tenant inválido'),
  reason: z.string().min(10, 'Motivo deve ter no mínimo 10 caracteres'),
});

/**
 * Schema para provisionamento
 */
export const provisionTenantSchema = z.object({
  tenant_id: z.string().uuid('ID de tenant inválido'),
  copy_from_core: z.boolean().default(true),
  skip_migrations: z.boolean().default(false),
});

/**
 * Types inferidos
 */
export type CreateTenantInput = z.infer<typeof createTenantSchema>;
export type UpdateTenantInput = z.infer<typeof updateTenantSchema>;
export type AddDomainInput = z.infer<typeof addDomainSchema>;
export type VerifyDomainInput = z.infer<typeof verifyDomainSchema>;
export type AddUserToTenantInput = z.infer<typeof addUserToTenantSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type SuspendTenantInput = z.infer<typeof suspendTenantSchema>;
export type ProvisionTenantInput = z.infer<typeof provisionTenantSchema>;
