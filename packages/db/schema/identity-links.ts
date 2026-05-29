import { index, uniqueIndex } from 'drizzle-orm/pg-core';
import { jsonb, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { noro } from './_schema';
import { users } from './users';

export const identityProviderValues = ['logto', 'supabase'] as const;
export type IdentityProvider = (typeof identityProviderValues)[number];

export const identityLinks = noro.table(
  'identity_links',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    provider: text('provider').$type<IdentityProvider>().notNull(),
    providerSubject: text('provider_subject').notNull(),
    providerEmail: text('provider_email'),
    legacySupabaseUserId: uuid('legacy_supabase_user_id'),
    metadata: jsonb('metadata').$type<Record<string, unknown>>(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('identity_links_provider_subject_uidx').on(table.provider, table.providerSubject),
    index('identity_links_user_id_idx').on(table.userId),
    index('identity_links_legacy_supabase_user_id_idx').on(table.legacySupabaseUserId),
  ],
);
