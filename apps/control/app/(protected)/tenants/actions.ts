"use server";
import { cookies } from "next/headers";
import { createServerSupabaseClient } from "@lib/supabase/server";

export type Tenant = { id: string; name: string; slug: string; role?: string };

export async function getUserTenants(): Promise<Tenant[]> {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .schema('cp')
    .from("user_tenant_roles")
    .select("role, tenants!user_tenant_roles_tenant_fkey(id, name, slug)")
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);
  return (data || []).map((r: any) => ({ id: r.tenants.id, name: r.tenants.name, slug: r.tenants.slug, role: r.role }));
}

export async function getActiveTenantId(): Promise<string | null> {
  const supabase = createServerSupabaseClient();
  const all = await getUserTenants();
  if (!all.length) return null;
  const c = cookies();
  const cookieId = c.get("active_tenant_id")?.value;
  if (cookieId && all.find(t => t.id === cookieId)) return cookieId;
  // default to first membership
  return all[0].id;
}

export async function setActiveTenant(formData: FormData) {
  const tenantId = String(formData.get("tenant_id") || "");
  const all = await getUserTenants();
  if (!tenantId || !all.find(t => t.id === tenantId)) return;
  const c = cookies();
  c.set("active_tenant_id", tenantId, { path: "/", httpOnly: true, sameSite: "lax" });
}
