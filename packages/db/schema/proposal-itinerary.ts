import { index, integer, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { noro } from './_schema';
import { proposals } from './proposals';
import { proposalDocuments } from './proposal-documents';

export const itineraryTipoValues = [
  'transporte',
  'hospedagem',
  'passeio',
  'refeicao',
  'livre',
  'outro',
] as const;

export type ItineraryTipo = (typeof itineraryTipoValues)[number];

export const proposalItineraryItems = noro.table(
  'proposal_itinerary_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    proposalId: uuid('proposal_id').notNull().references(() => proposals.id),
    data: text('data'), // YYYY-MM-DD como string — consulta e sort sem timezone ambiguity
    horaInicio: text('hora_inicio'), // HH:MM
    horaFim: text('hora_fim'), // HH:MM nullable
    tipo: text('tipo').$type<ItineraryTipo>().notNull().default('outro'),
    local: text('local'),
    titulo: text('titulo').notNull(),
    descricao: text('descricao'),
    endereco: text('endereco'), // endereço completo para integração futura com Maps
    documentId: uuid('document_id').references(() => proposalDocuments.id),
    ordem: integer('ordem').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('pii_tenant_id_idx').on(table.tenantId),
    index('pii_proposal_id_idx').on(table.proposalId),
    index('pii_data_ordem_idx').on(table.proposalId, table.data, table.ordem),
  ],
);
