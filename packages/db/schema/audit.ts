import { index } from 'drizzle-orm/pg-core';
import { jsonb, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { noro } from './_schema';
import { tenants } from './tenants';
import { users } from './users';

export const auditEvents = noro.table(
  'audit_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    actorUserId: uuid('actor_user_id').references(() => users.id),
    tenantId: uuid('tenant_id').references(() => tenants.id),
    eventType: text('event_type').notNull(),
    targetType: text('target_type'),
    targetId: uuid('target_id'),
    metadata: jsonb('metadata').$type<Record<string, unknown>>(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('audit_events_actor_user_id_idx').on(table.actorUserId),
    index('audit_events_tenant_id_idx').on(table.tenantId),
    index('audit_events_event_type_idx').on(table.eventType),
    index('audit_events_created_at_idx').on(table.createdAt),
  ],
);
