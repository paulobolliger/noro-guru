"use server";
import { cookies } from "next/headers";
import { getSupabaseServer } from "@/lib/supabaseServer";

export type Tenant = { id: string; name: string; slug: string; role?: string };

export async function getUserTenants(): Promise<Tenant[]> {
  try {
    const supabase = getSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }
    
    const { data, error } = await supabase
      .schema('cp')
      .from("user_tenant_roles")
      .select("role, tenants!user_tenant_roles_tenant_fkey(id, name, slug)")
      .eq("user_id", user.id);
    
    if (error) {
      console.error('[getUserTenants] Error:', error);
      throw new Error(error.message);
    }
    
    const tenants = (data || []).map((r: any) => ({ 
      id: r.tenants.id, 
      name: r.tenants.name, 
      slug: r.tenants.slug, 
      role: r.role 
    }));
    
    return tenants;
  } catch (err) {
    console.error('[getUserTenants] Exception:', err);
    return [];
  }
}

export async function getActiveTenantId(): Promise<string | null> {
  const supabase = getSupabaseServer();
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
