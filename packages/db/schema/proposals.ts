import { index, integer, jsonb, numeric, text, timestamp, uuid, bigint, date } from 'drizzle-orm/pg-core';
import { noro } from './_schema';
import { tenants } from './tenants';
import { users } from './users';
import { products } from './products';

export const proposalStatusValues = [
  'rascunho',
  'enviada',
  'visualizada',
  'aceita',
  'recusada',
  'expirada',
  'cancelada',
] as const;

export const proposalAceiteTipoValues = ['manual', 'link_publico'] as const;

export const proposalItemTipoValues = ['produto_catalogo', 'manual'] as const;

export type ProposalStatus = (typeof proposalStatusValues)[number];
export type ProposalAceiteTipo = (typeof proposalAceiteTipoValues)[number];
export type ProposalItemTipo = (typeof proposalItemTipoValues)[number];

// ---------------------------------------------------------------------------
// proposals — cabeçalho da proposta
// ---------------------------------------------------------------------------

export const proposals = noro.table(
  'proposals',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id),

    // CRM — lead pré-conversão ou cliente já convertido
    // FK lógica sem .references() para evitar dependência circular com leads/clients
    leadId: uuid('lead_id'),
    clientId: uuid('client_id'),

    // Identificação
    numero: text('numero').notNull(),
    titulo: text('titulo').notNull(),
    versao: integer('versao').notNull().default(1),

    // Viagem
    dataViagemInicio: date('data_viagem_inicio'),
    dataViagemFim: date('data_viagem_fim'),
    numPax: integer('num_pax'),
    destinoPrincipal: text('destino_principal'),

    // Financeiro — sempre na moeda_base, sem conversão BRL
    moedaBase: text('moeda_base').notNull().default('BRL'),
    subtotalCents: bigint('subtotal_cents', { mode: 'number' }).default(0),
    descontoCents: bigint('desconto_cents', { mode: 'number' }).default(0),
    totalCents: bigint('total_cents', { mode: 'number' }).default(0),
    valorSinalCents: bigint('valor_sinal_cents', { mode: 'number' }),
    condicoesPagamento: text('condicoes_pagamento'),

    // Câmbio — referência histórica apenas, sem uso contratual
    taxaCambioSnapshot: numeric('taxa_cambio_snapshot', { precision: 10, scale: 6 }),
    taxaCambioAt: timestamp('taxa_cambio_at', { withTimezone: true }),

    // Status e aceite
    status: text('status').$type<ProposalStatus>().notNull().default('rascunho'),
    aceiteTipo: text('aceite_tipo').$type<ProposalAceiteTipo>(),
    // Token UUID para link público — acesso aciona status 'visualizada' automaticamente
    aceiteToken: text('aceite_token'),
    aceitaAt: timestamp('aceita_at', { withTimezone: true }),
    aceitaPorNome: text('aceita_por_nome'),

    // Validade e conteúdo
    validadeAte: date('validade_ate'),
    descricao: text('descricao'),
    observacoes: text('observacoes'),
    termosCondicoes: text('termos_condicoes'),

    // Agente responsável
    createdBy: uuid('created_by').references(() => users.id),

    // Temporais
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    sentAt: timestamp('sent_at', { withTimezone: true }),
  },
  (table) => [
    index('proposals_tenant_id_idx').on(table.tenantId),
    index('proposals_status_idx').on(table.status),
    index('proposals_lead_id_idx').on(table.leadId),
    index('proposals_client_id_idx').on(table.clientId),
    index('proposals_aceite_token_idx').on(table.aceiteToken),
    index('proposals_created_at_idx').on(table.createdAt),
  ],
);

// ---------------------------------------------------------------------------
// proposal_items — itens da proposta com snapshot financeiro imutável
// ---------------------------------------------------------------------------

export const proposalItems = noro.table(
  'proposal_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    proposalId: uuid('proposal_id')
      .notNull()
      .references(() => proposals.id),

    // Produto do catálogo (nullable para itens manuais)
    productId: uuid('product_id').references(() => products.id),

    // Tipo e descrição
    tipo: text('tipo').$type<ProposalItemTipo>().notNull(),
    nome: text('nome').notNull(),
    descricao: text('descricao'),
    categoria: text('categoria'),

    // Datas e pax específicos do item
    dataInicio: date('data_inicio'),
    dataFim: date('data_fim'),
    numPax: integer('num_pax'),

    // SNAPSHOT FINANCEIRO — imutável após proposal.aceita_at ser preenchido
    // Bloqueio aplicado no repository: updateProposalItem verifica proposal.aceita_at
    moedaOriginal: text('moeda_original').notNull().default('BRL'),
    taxaCambio: numeric('taxa_cambio', { precision: 10, scale: 6 }),
    custoBaseCents: bigint('custo_base_cents', { mode: 'number' }),
    precoVendaCents: bigint('preco_venda_cents', { mode: 'number' }).notNull(),
    markupPercentual: numeric('markup_percentual', { precision: 5, scale: 2 }),
    // Snapshot das regras de pricing aplicadas — imutável após aceite
    snapshotPricingRules: jsonb('snapshot_pricing_rules').$type<Record<string, unknown>>(),

    // Ordenação
    ordem: integer('ordem').notNull().default(0),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('proposal_items_proposal_id_idx').on(table.proposalId),
    index('proposal_items_product_id_idx').on(table.productId),
    index('proposal_items_ordem_idx').on(table.proposalId, table.ordem),
  ],
);
