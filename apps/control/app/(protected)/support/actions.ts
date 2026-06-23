"use server";

import { createDatabaseClient } from "@noro/db";

export async function getTickets() {
  const { client, close } = createDatabaseClient();
  try {
    const rows = await client`
      SELECT *
      FROM platform.support_tickets
      ORDER BY created_at DESC
    `;
    return rows.map(row => ({
      ...row,
      created_at: row.created_at ? new Date(row.created_at).toISOString() : null,
      updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : null,
    })) as any[];
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return [];
  } finally {
    await close();
  }
}
