import { boolean, index, integer, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { noro } from './_schema';
import { proposals } from './proposals';

export const emergencyContactTipoValues = [
  'agencia',
  'seguradora',
  'consulado',
  'hospital',
  'outro',
] as const;

export type EmergencyContactTipo = (typeof emergencyContactTipoValues)[number];

export const emergencyContacts = noro.table(
  'emergency_contacts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    // NULL = contato global do tenant; preenchido = override por proposta
    proposalId: uuid('proposal_id').references(() => proposals.id),
    tipo: text('tipo').$type<EmergencyContactTipo>().notNull().default('outro'),
    nome: text('nome').notNull(),
    telefone: text('telefone'),
    whatsapp: text('whatsapp'), // canal preferencial no Brasil, separado de telefone
    email: text('email'),
    observacoes: text('observacoes'),
    ordem: integer('ordem').notNull().default(0),
    ativo: boolean('ativo').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('ec_tenant_id_idx').on(table.tenantId),
    index('ec_proposal_id_idx').on(table.proposalId),
    index('ec_ativo_idx').on(table.tenantId, table.ativo),
  ],
);
