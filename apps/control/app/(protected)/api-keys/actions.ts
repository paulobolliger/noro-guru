"use server";
import { createDatabaseClient } from "@noro/db";
import crypto from "node:crypto";
import { getServerSession, getSessionClaims } from '@/lib/session';

export type CreateApiKeyResult = { ok: true; plaintext: string; last4: string } | { ok: false; error: string };

export async function listApiKeys() {
  const { client, close } = createDatabaseClient();
  try {
    const keys = await client`
      SELECT id, name, last4, scope, expires_at, created_at 
      FROM platform.api_keys
      ORDER BY created_at DESC
    `;
    return keys.map(row => ({
      ...row,
      created_at: row.created_at ? new Date(row.created_at).toISOString() : null,
      expires_at: row.expires_at ? new Date(row.expires_at).toISOString() : null,
    })) as any[];
  } finally {
    await close();
  }
}

async function resolveActiveTenantId(client: any, userId: string): Promise<string | null> {
  // 1) Tenta pelo vínculo do usuário (primeiro tenant)
  if (userId) {
    const rows = await client`
      SELECT tenant_id 
      FROM platform.user_tenant_roles
      WHERE user_id = ${userId}
      LIMIT 1
    `;
    if (rows && rows.length > 0) return rows[0].tenant_id as string;
  }
  // 2) Fallback: tenant principal 'noro'
  const rowsNoro = await client`
    SELECT id 
    FROM platform.tenants 
    WHERE slug = 'noro'
    LIMIT 1
  `;
  return rowsNoro[0]?.id ?? null;
}

export async function createApiKey(name: string, scope: string[] = ["visa:read"], expires_at: string | null = null): Promise<CreateApiKeyResult> {
  const { client, close } = createDatabaseClient();
  try {
    if (!name?.trim()) return { ok: false, error: "Nome obrigatório" };
    const plaintext = crypto.randomBytes(24).toString("base64url");
    const last4 = plaintext.slice(-4);
    const hash = crypto.createHash("sha256").update(plaintext).digest("hex");
    
    const ctx = await getServerSession().then(s => ({ isAuthenticated: Boolean(s?.claims?.sub), claims: s?.claims }));
    const userId = ctx.claims?.sub;
    if (!userId) return { ok: false, error: "Usuário não autenticado" };

    const tenantId = await resolveActiveTenantId(client, userId);
    if (!tenantId) return { ok: false, error: "Tenant não encontrado" };

    await client`
      INSERT INTO platform.api_keys (tenant_id, name, hash, last4, scope, expires_at)
      VALUES (${tenantId}, ${name}, ${hash}, ${last4}, ${scope}, ${expires_at})
    `;
    return { ok: true, plaintext, last4 };
  } catch (e: any) {
    return { ok: false, error: e.message || String(e) };
  } finally {
    await close();
  }
}

export async function revokeApiKey(id: string) {
  const { client, close } = createDatabaseClient();
  try {
    await client`
      DELETE FROM platform.api_keys
      WHERE id = ${id}
    `;
  } finally {
    await close();
  }
}

export async function loadUsageDaily(keyId?: string) {
  const { client, close } = createDatabaseClient();
  try {
    const fromISO = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    let data;
    if (keyId) {
      data = await client`
        SELECT key_id, elapsed_ms, status, created_at 
        FROM platform.api_key_logs
        WHERE created_at >= ${fromISO} AND key_id = ${keyId}
        ORDER BY created_at DESC
      `;
    } else {
      data = await client`
        SELECT key_id, elapsed_ms, status, created_at 
        FROM platform.api_key_logs
        WHERE created_at >= ${fromISO}
        ORDER BY created_at DESC
      `;
    }

    const byKey: Record<string, Record<string, { calls: number; sumMs: number; cntMs: number; errors: number }>> = {};
    for (const row of data || []) {
      const kid = String(row.key_id);
      const day = new Date(row.created_at).toISOString().slice(0, 10); // YYYY-MM-DD
      byKey[kid] = byKey[kid] || {};
      byKey[kid][day] = byKey[kid][day] || { calls: 0, sumMs: 0, cntMs: 0, errors: 0 };
      byKey[kid][day].calls += 1;
      const ms = typeof row.elapsed_ms === 'number' ? row.elapsed_ms : null;
      if (ms !== null) { byKey[kid][day].sumMs += ms; byKey[kid][day].cntMs += 1; }
      if ((row.status ?? 0) >= 500) byKey[kid][day].errors += 1;
    }
    const out: Array<{ key_id: string; day: string; calls: number; avg_ms: number; errors: number }> = [];
    for (const [kid, days] of Object.entries(byKey)) {
      for (const [day, agg] of Object.entries(days)) {
        const avg = agg.cntMs ? Math.round(agg.sumMs / agg.cntMs) : 0;
        out.push({ key_id: kid, day: new Date(`${day}T00:00:00.000Z`).toISOString(), calls: agg.calls, avg_ms: avg, errors: agg.errors });
      }
    }
    out.sort((a, b) => (a.day < b.day ? 1 : -1));
    return out;
  } finally {
    await close();
  }
}
