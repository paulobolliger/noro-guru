import { createDatabaseClient } from '@noro/db';
import type { SQL } from 'drizzle-orm';

export const db = {
  async execute<T = unknown>(query: SQL<T>) {
    const database = createDatabaseClient();

    try {
      return await database.db.execute(query);
    } finally {
      await database.close();
    }
  },
};
