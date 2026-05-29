// SEGURANCA: nao rode `drizzle push` ou migrations contra o banco da VPS/producao.
// Use apenas banco dev/staging isolado apos aprovacao explicita, backup/dump e revisao da migration.

const databaseUrl = process.env.DATABASE_URL;

export default {
  schema: './packages/db/schema/index.ts',
  out: './packages/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl ?? '',
  },
  strict: true,
  verbose: true,
} as const;
