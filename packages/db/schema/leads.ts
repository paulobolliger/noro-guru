import { date, index, integer, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { noro } from './_schema';
import { tenants } from './tenants';
import { users } from './users';

export const leadSourceValues = [
  'instagram_dm',
  'whatsapp_organico',
  'indicacao',
  'formulario_web',
  'campanha_paga',
  'telefone',
  'outro',
] as const;

export const leadStatusValues = [
  'novo',
  'em_contato',
  'briefing_coletado',
  'proposta_enviada',
  'proposta_visualizada',
  'negociacao',
  'ganho',
  'perdido',
  'inativo',
] as const;

export const leadTipoViagemValues = [
  'lazer',
  'corporativo',
  'lua_de_mel',
  'grupo',
  'incentivo',
  'aventura',
  'cruzeiro',
] as const;

export const leadLostReasonValues = [
  'preco',
  'concorrente',
  'desistiu',
  'sem_resposta',
  'fora_do_perfil',
  'outro',
] as const;

export type LeadSource = (typeof leadSourceValues)[number];
export type LeadStatus = (typeof leadStatusValues)[number];
export type LeadTipoViagem = (typeof leadTipoViagemValues)[number];
export type LeadLostReason = (typeof leadLostReasonValues)[number];

export const leads = noro.table(
  'leads',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id),

    // IDENTIDADE E CONTATO
    nome: text('nome').notNull(),
    email: text('email'),
    phone: text('phone'),
    whatsapp: text('whatsapp'),
    organizationName: text('organization_name'),

    // ORIGEM E ATRIBUIÇÃO
    source: text('source').$type<LeadSource>().notNull(),
    sourceDetail: text('source_detail'),
    assignedTo: uuid('assigned_to').references(() => users.id),

    // QUALIFICAÇÃO TURÍSTICA
    budgetMinCents: integer('budget_min_cents'),
    budgetMaxCents: integer('budget_max_cents'),
    destinosInteresse: text('destinos_interesse').array(),
    dataViagemInicio: date('data_viagem_inicio'),
    dataViagemFim: date('data_viagem_fim'),
    numPax: integer('num_pax'),
    tipoViagem: text('tipo_viagem').$type<LeadTipoViagem>(),

    // FUNIL
    status: text('status').$type<LeadStatus>().notNull().default('novo'),
    lostReason: text('lost_reason').$type<LeadLostReason>(),
    leadScore: integer('lead_score'),

    // TEMPORAIS
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    lastContactAt: timestamp('last_contact_at', { withTimezone: true }),
    convertedAt: timestamp('converted_at', { withTimezone: true }),
    // FK lógica para noro.clients — sem .references() para evitar dependência circular
    convertedTo: uuid('converted_to'),
  },
  (table) => [
    index('leads_tenant_id_idx').on(table.tenantId),
    index('leads_status_idx').on(table.status),
    index('leads_assigned_to_idx').on(table.assignedTo),
    index('leads_source_idx').on(table.source),
    index('leads_created_at_idx').on(table.createdAt),
  ],
);
