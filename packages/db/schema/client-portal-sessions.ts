import { index, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { noro } from './_schema';

// Sessões de magic link para o portal do viajante (apps/portal)
// Não usa Logto — autenticação separada por email
export const clientPortalSessions = noro.table(
  'client_portal_sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    // FK lógica — sem .references() para evitar acoplamento com clients/tenants
    tenantId: uuid('tenant_id').notNull(),
    // null se o email não corresponde a um cliente cadastrado (fluxo de erro)
    clientId: uuid('client_id'),

    clientEmail: text('client_email').notNull(),

    // Token único do magic link — invalidado após uso ou expiração
    token: text('token').notNull(),

    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    // Preenchido quando o cliente clica no link — sessão ativa a partir daqui
    verifiedAt: timestamp('verified_at', { withTimezone: true }),
    // Preenchido ao fazer logout
    revokedAt: timestamp('revoked_at', { withTimezone: true }),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('client_portal_sessions_token_uidx').on(table.token),
    index('client_portal_sessions_tenant_id_idx').on(table.tenantId),
    index('client_portal_sessions_client_id_idx').on(table.clientId),
    index('client_portal_sessions_client_email_idx').on(table.clientEmail),
    index('client_portal_sessions_expires_at_idx').on(table.expiresAt),
  ],
);
