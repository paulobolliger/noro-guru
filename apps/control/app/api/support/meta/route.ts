import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  const supabase = getSupabaseServer();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .schema('cp')
    .from('user_tenant_roles')
    .select('role, tenants!user_tenant_roles_tenant_fkey(id,name,slug)')
    .eq('user_id', auth.user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const tenants = (data || []).map((row: any) => ({
    id: row.tenants?.id,
    name: row.tenants?.name,
    slug: row.tenants?.slug,
    role: row.role || null,
  })).filter((t: any) => t.id);

  const cookieStore = cookies();
  const cookieTenant = cookieStore.get('active_tenant_id')?.value || null;
  const activeTenantId = cookieTenant && tenants.find((t: any) => t.id === cookieTenant)
    ? cookieTenant
    : tenants[0]?.id || null;

  return NextResponse.json({
    tenants,
    activeTenantId,
    userId: auth.user.id,
  });
}

