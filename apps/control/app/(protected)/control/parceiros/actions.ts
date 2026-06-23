"use server";

import { createDatabaseClient } from "@noro/db";
import { requireUser, logtoSessionAdapter } from "@noro/auth";
import { logtoConfig } from "@/lib/logto";
import { revalidatePath } from "next/cache";

export async function listB2BPartners(search?: string) {
  const { client, close } = createDatabaseClient();
  try {
    let rows;
    if (search) {
      const searchPattern = `%${search}%`;
      rows = await client`
        SELECT 
          id, company_name as "companyName", document, 
          status, rate_limit_per_minute as "rateLimitPerMinute", 
          created_at as "createdAt", updated_at as "updatedAt", 
          expires_at as "expiresAt"
        FROM noro.partner_api_keys
        WHERE company_name ILIKE ${searchPattern} 
          OR document ILIKE ${searchPattern}
        ORDER BY created_at DESC
      `;
    } else {
      rows = await client`
        SELECT 
          id, company_name as "companyName", document, 
          status, rate_limit_per_minute as "rateLimitPerMinute", 
          created_at as "createdAt", updated_at as "updatedAt", 
          expires_at as "expiresAt"
        FROM noro.partner_api_keys
        ORDER BY created_at DESC
      `;
    }

    return rows.map((r: any) => ({
      ...r,
      rateLimitPerMinute: Number(r.rateLimitPerMinute),
      createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : null,
      updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : null,
      expiresAt: r.expiresAt ? new Date(r.expiresAt).toISOString() : null,
    }));
  } finally {
    await close();
  }
}

export async function updatePartnerAction(
  id: string,
  updates: {
    status: "pending_approval" | "active" | "suspended";
    rateLimitPerMinute: number;
    expiresAt: string | null;
  }
) {
  const { db, client, close } = createDatabaseClient();
  try {
    // Auth guard
    await requireUser({
      db,
      sessionAdapter: logtoSessionAdapter(logtoConfig),
    });

    const parsedExpiresAt = updates.expiresAt ? new Date(updates.expiresAt) : null;

    await client`
      UPDATE noro.partner_api_keys
      SET 
        status = ${updates.status},
        rate_limit_per_minute = ${Number(updates.rateLimitPerMinute)},
        expires_at = ${parsedExpiresAt},
        updated_at = now()
      WHERE id = ${id}
    `;

    revalidatePath("/control/parceiros");
    return { success: true };
  } catch (err: any) {
    console.error("Error updating B2B partner:", err);
    return { success: false, error: err.message || "Erro interno" };
  } finally {
    await close();
  }
}
