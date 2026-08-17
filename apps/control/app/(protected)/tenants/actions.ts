"use server";
import { cookies } from "next/headers";
import { getServerSession, getSessionClaims } from '@/lib/session';
import { createDatabaseClient } from '@noro/db';

export type Tenant = { id: string; name: string; slug: string; role?: string };

export async function getUserTenants(): Promise<Tenant[]> {
  const { client, close } = createDatabaseClient();
  try {
    const ctx = await getServerSession().then(s => ({ isAuthenticated: Boolean(s?.claims?.sub), claims: s?.claims }));
    const userId = ctx.claims?.sub;
    
    if (!userId) {
      return [];
    }
    
    const rows = await client`
      SELECT utr.role, t.id, t.name, t.slug
      FROM platform.user_tenant_roles utr
      JOIN platform.tenants t ON t.id = utr.tenant_id
      WHERE utr.user_id = ${userId}
    `;
    
    return rows.map((r: any) => ({ 
      id: r.id, 
      name: r.name, 
      slug: r.slug, 
      role: r.role 
    }));
  } catch (err) {
    console.error('[getUserTenants] Exception:', err);
    return [];
  } finally {
    await close();
  }
}

export async function getActiveTenantId(): Promise<string | null> {
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
