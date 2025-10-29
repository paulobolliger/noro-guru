"use server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import crypto from "node:crypto";

export type CreateApiKeyResult = { ok: true; plaintext: string; last4: string } | { ok: false; error: string };

export async function listApiKeys() {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .schema('cp')
    .from("api_keys")
    .select("id, name, last4, scope, expires_at, created_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

async function resolveActiveTenantId(supabase: ReturnType<typeof createAdminSupabaseClient>): Promise<string | null> {
  // 1) Tenta pelo vínculo do usuário (primeiro tenant)
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth?.user?.id;
  if (uid) {
    const { data: utr } = await supabase
      .schema('cp')
      .from("user_tenant_roles")
      .select("tenant_id")
      .eq("user_id", uid)
      .limit(1)
      .maybeSingle();
    if (utr?.tenant_id) return utr.tenant_id as string;
  }
  // 2) Fallback: tenant principal 'noro'
  const { data: tenantNoro } = await supabase.schema('cp').from("tenants").select("id").eq("slug", "noro").maybeSingle();
  return tenantNoro?.id ?? null;
}

export async function createApiKey(name: string, scope: string[] = ["visa:read"], expires_at: string | null = null): Promise<CreateApiKeyResult> {
  try {
    if (!name?.trim()) return { ok: false, error: "Nome obrigatório" };
    const plaintext = crypto.randomBytes(24).toString("base64url");
    const last4 = plaintext.slice(-4);
    const hash = crypto.createHash("sha256").update(plaintext).digest("hex");
    const supabase = createAdminSupabaseClient();
    const tenantId = await resolveActiveTenantId(supabase);
    if (!tenantId) return { ok: false, error: "Tenant não encontrado" };

    const { error } = await supabase.schema('cp').from("api_keys").insert({
      tenant_id: tenantId,
      name,
      hash,
      last4,
      scope,
      expires_at,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true, plaintext, last4 };
  } catch (e: any) {
    return { ok: false, error: e.message || String(e) };
  }
}

export async function revokeApiKey(id: string) {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.schema('cp').from("api_keys").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function loadUsageDaily(keyId?: string) {
  const supabase = createAdminSupabaseClient();
  const fromISO = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  let query = supabase
    .schema('cp')
    .from('api_key_logs')
    .select('key_id, elapsed_ms, status, created_at')
    .gte('created_at', fromISO)
    .order('created_at', { ascending: false });
  if (keyId) query = query.eq('key_id', keyId);
  const { data, error } = await query as any;
  if (error) throw new Error(error.message);
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
}
