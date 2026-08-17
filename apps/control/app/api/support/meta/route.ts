import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServerSession, getSessionClaims } from '@/lib/session';
import { createDatabaseClient } from '@noro/db';

export async function GET() {
  const ctx = await getServerSession().then(s => ({ isAuthenticated: Boolean(s?.claims?.sub), claims: s?.claims }));
  const userId = ctx.claims?.sub;
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { client, close } = createDatabaseClient();
  try {
    const data = await client`
      SELECT utr.role, t.id, t.name, t.slug
      FROM platform.user_tenant_roles utr
      JOIN platform.tenants t ON t.id = utr.tenant_id
      WHERE utr.user_id = ${userId}
    `;

    const tenants = data.map((row: any) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      role: row.role || null,
    }));

    const cookieStore = cookies();
    const cookieTenant = cookieStore.get('active_tenant_id')?.value || null;
    const activeTenantId = cookieTenant && tenants.find((t: any) => t.id === cookieTenant)
      ? cookieTenant
      : tenants[0]?.id || null;

    return NextResponse.json({
      tenants,
      activeTenantId,
      userId,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || String(error) }, { status: 400 });
  } finally {
    await close();
  }
}
