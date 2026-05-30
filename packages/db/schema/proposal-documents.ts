import { bigint, boolean, index, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { noro } from './_schema';
import { proposals } from './proposals';

export const proposalDocumentTipoValues = [
  'voucher',
  'bilhete',
  'visto',
  'seguro',
  'contrato',
  'recibo',
  'outro',
] as const;

export type ProposalDocumentTipo = (typeof proposalDocumentTipoValues)[number];

export const proposalDocuments = noro.table(
  'proposal_documents',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    proposalId: uuid('proposal_id').references(() => proposals.id),
    name: text('name').notNull(),
    tipo: text('tipo').$type<ProposalDocumentTipo>().notNull().default('outro'),
    fileUrl: text('file_url').notNull(),
    mimeType: text('mime_type'),
    sizeBytes: bigint('size_bytes', { mode: 'number' }),
    uploadedBy: uuid('uploaded_by'),
    visibleToClient: boolean('visible_to_client').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('pd_tenant_id_idx').on(table.tenantId),
    index('pd_proposal_id_idx').on(table.proposalId),
    index('pd_visible_to_client_idx').on(table.visibleToClient),
  ],
);
