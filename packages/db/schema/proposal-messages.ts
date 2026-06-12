import { index, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { noro } from './_schema';
import { proposals } from './proposals';

export const messageSenderTypeValues = ['agent', 'client'] as const;
export type MessageSenderType = (typeof messageSenderTypeValues)[number];

export const proposalMessages = noro.table(
  'proposal_messages',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    proposalId: uuid('proposal_id').notNull().references(() => proposals.id),
    senderType: text('sender_type').$type<MessageSenderType>().notNull(),
    senderUserId: uuid('sender_user_id'),
    senderClientId: uuid('sender_client_id'),
    content: text('content').notNull(),
    readAt: timestamp('read_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('pm_tenant_id_idx').on(table.tenantId),
    index('pm_proposal_id_idx').on(table.proposalId),
    index('pm_created_at_idx').on(table.proposalId, table.createdAt),
  ],
);
