"use server";
import { createServerSupabaseClient } from "@lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { getActiveTenantId } from "../../../tenants/actions";

export async function listLeadsByStage() {
  const supabase = createServerSupabaseClient();
  const tenantId = await getActiveTenantId();

  // Fetch stages via admin to avoid RLS blocking empty columns for new users
  const admin = createAdminSupabaseClient();
  const { data: stagesData } = await admin
    .schema("cp")
    .from("lead_stages")
    .select("slug,label,ord")
    .order("ord", { ascending: true });

  let stageSlugs = (stagesData || []).map((s: any) => s.slug);
  if (!stageSlugs.length) {
    // fallback defaults
    stageSlugs = ["novo","qualificado","proposta","ganho","perdido"];
  }
  const map: Record<string, any[]> = Object.fromEntries(stageSlugs.map((s: string) => [s, []]));

  let q = admin
    .schema("cp")
    .from("leads")
    .select("*")
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });
  if (tenantId) q = q.eq("tenant_id", tenantId);
  const { data, error } = await q;
  if (error) throw new Error(error.message);

  for (const l of data || []) {
    const st = (l as any).stage;
    const key = st && stageSlugs.includes(st) ? st : stageSlugs[0];
    if (key) map[key]?.push(l as any);
  }
  return map;
}

export async function moveLead(formData: FormData) {
  const supabase = createServerSupabaseClient();
  const id = String(formData.get("id") || "");
  const stage = String(formData.get("stage") || "");
  if (!id || !stage) throw new Error("Parametros invalidos");
  const { error } = await supabase.schema("cp").from("leads").update({ stage }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function convertLeadToTenant(formData: FormData) {
  const supabase = createServerSupabaseClient();
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Lead invalido");
  const { data: lead } = await supabase.schema("cp").from("leads").select("*").eq("id", id).maybeSingle();
  if (!lead) throw new Error("Lead nao encontrado");
  const slug = (lead.organization_name || "org")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);
  const { data: tenant, error: terr } = await supabase
    .schema("cp")
    .from("tenants")
    .insert({ name: lead.organization_name || slug, slug, status: "active" })
    .select("*")
    .maybeSingle();
  if (terr) throw new Error(terr.message);
  await supabase.schema("cp").from("leads").update({ tenant_id: tenant?.id, stage: "ganho" }).eq("id", id);
}

