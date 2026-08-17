import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getServerSession, getSessionClaims } from '@/lib/session';
import { createDatabaseClient } from '@noro/db';

async function resolveActiveTenantId() {
  // First try cookie
  const activeTenantId = cookies().get('active_tenant_id')?.value;
  if (activeTenantId) return activeTenantId;

  // Fallback to query
  const ctx = await getServerSession().then(s => ({ isAuthenticated: Boolean(s?.claims?.sub), claims: s?.claims }));
  const uid = ctx.claims?.sub;
  const { client, close } = createDatabaseClient();
  try {
    if (uid) {
      const [utr] = await client`
        SELECT tenant_id 
        FROM platform.user_tenant_roles 
        WHERE user_id = ${uid} 
        LIMIT 1
      `;
      if (utr?.tenant_id) return utr.tenant_id as string;
    }
    const [tenantNoro] = await client`
      SELECT id 
      FROM platform.tenants 
      WHERE slug = 'noro' 
      LIMIT 1
    `;
    return tenantNoro?.id ?? null;
  } catch (err) {
    console.error('Error resolving active tenant:', err);
    return null;
  } finally {
    await close();
  }
}

export async function POST(req: Request) {
  const form = await req.formData();
  const code = String(form.get('code') || '').trim();
  const url = String(form.get('url') || '').trim();
  const secret = String(form.get('secret') || '').trim() || null;
  const is_active = !!form.get('is_active');
  if (!code || !url) return NextResponse.json({ error: 'code and url required' }, { status: 400 });
  
  const tenant_id = await resolveActiveTenantId();
  if (!tenant_id) return NextResponse.json({ error: 'tenant_id could not be resolved' }, { status: 400 });

  const { client, close } = createDatabaseClient();
  try {
    await client`
      INSERT INTO platform.webhooks (tenant_id, code, url, secret, is_active)
      VALUES (${tenant_id}, ${code}, ${url}, ${secret}, ${is_active})
    `;
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || String(error) }, { status: 400 });
  } finally {
    await close();
  }
}

