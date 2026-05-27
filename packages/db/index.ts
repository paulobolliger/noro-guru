import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { getDatabaseUrl, NORO_DATABASE } from '@noro/config';

export type DatabaseClient = ReturnType<typeof createDatabaseClient>;

export function createPostgresClient(connectionString = getDatabaseUrl()) {
  return postgres(connectionString, {
    max: 5,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
  });
}

export function createDatabaseClient(connectionString = getDatabaseUrl()) {
  const client = createPostgresClient(connectionString);
  return {
    client,
    db: drizzle(client),
    async close() {
      await client.end();
    },
  };
}

export async function assertDatabaseConnection(connectionString = getDatabaseUrl()) {
  const sql = createPostgresClient(connectionString);

  try {
    const [result] = await sql<[{ current_database: string; current_user: string }]>`
      select current_database() as current_database, current_user as current_user
    `;

    return {
      ...result,
      expected: NORO_DATABASE,
    };
  } finally {
    await sql.end();
  }
}

export async function listDatabaseSchemas(connectionString = getDatabaseUrl()) {
  const sql = createPostgresClient(connectionString);

  try {
    return await sql<Array<{ schema_name: string }>>`
      select schema_name
      from information_schema.schemata
      where schema_name not like 'pg_%'
        and schema_name <> 'information_schema'
      order by schema_name
    `;
  } finally {
    await sql.end();
  }
}
