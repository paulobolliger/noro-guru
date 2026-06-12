/**
 * Drizzle migration runner para o schema `noro` (banco de produção no VPS).
 * Uso: DATABASE_URL=... node scripts/migrate.mjs
 * Ou:  node scripts/migrate.mjs   (lê DATABASE_URL de apps/control/.env.local)
 */
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

if (!process.env.DATABASE_URL) {
  config({ path: join(__dirname, '../apps/control/.env.local') });
}

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL não encontrada');
  process.exit(1);
}

const client = postgres(DATABASE_URL, { ssl: false, max: 1 });
const db = drizzle(client);
const migrationsFolder = join(__dirname, '../packages/db/migrations');

console.log('\n🚀 Rodando migrations Drizzle (schema noro)...\n');

try {
  await migrate(db, { migrationsFolder });
  console.log('✅ Migrations aplicadas com sucesso!\n');
} catch (err) {
  console.error('\n❌ Erro:', err.message);
  process.exit(1);
} finally {
  await client.end();
}
