import { boolean, index, numeric, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';
import { noro } from './_schema';
import { tenants } from './tenants';
import { plans } from './plans';

export const pricingRuleEscopoValues = ['plataforma', 'tenant'] as const;

export const pricingRuleTipoValues = [
  'markup_percentual',
  'markup_minimo_percentual',
  'taxa_cartao_percentual',
  'taxa_remessa_percentual',
  'taxa_fixa_cents',
] as const;

export const pricingRuleCanalValues = ['direto', 'agente', 'api'] as const;

export type PricingRuleEscopo = (typeof pricingRuleEscopoValues)[number];
export type PricingRuleTipo = (typeof pricingRuleTipoValues)[number];
export type PricingRuleCanal = (typeof pricingRuleCanalValues)[number];

export const pricingRules = noro.table(
  'pricing_rules',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    nome: text('nome').notNull(),
    escopo: text('escopo').$type<PricingRuleEscopo>().notNull(),

    // null para regras de plataforma; preenchido para regras de tenant
    tenantId: uuid('tenant_id').references(() => tenants.id),

    // null = aplica a todas as categorias
    categoria: text('categoria'),

    // null = aplica a todos os planos
    planId: uuid('plan_id').references(() => plans.id),

    // null = aplica a todos os canais
    canal: text('canal').$type<PricingRuleCanal>(),

    tipoRegra: text('tipo_regra').$type<PricingRuleTipo>().notNull(),

    // % ou cents conforme tipoRegra
    valor: numeric('valor', { precision: 10, scale: 4 }).notNull(),

    // para taxa_fixa_cents
    moeda: text('moeda').default('BRL'),

    // menor prioridade = aplicado primeiro
    prioridade: integer('prioridade').default(0),

    ativo: boolean('ativo').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('pricing_rules_escopo_idx').on(table.escopo),
    index('pricing_rules_tenant_id_idx').on(table.tenantId),
    index('pricing_rules_tipo_regra_idx').on(table.tipoRegra),
    index('pricing_rules_ativo_idx').on(table.ativo),
    index('pricing_rules_prioridade_idx').on(table.prioridade),
  ],
);
