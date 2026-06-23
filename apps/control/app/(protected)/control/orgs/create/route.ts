import { NextResponse } from 'next/server';
import { createDatabaseClient } from '@noro/db';
import { getLogtoContext } from '@logto/next/server-actions';
import { logtoConfig } from '@/lib/logto';

function slugify(input: string) {
  return input
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export async function POST(req: Request) {
  const { client, close } = createDatabaseClient();
  try {
    const form = await req.formData();
    const name = String(form.get('name') || '').trim();
    const slugIn = String(form.get('slug') || '').trim();
    const plan = String(form.get('plan') || 'pro');
    const status = String(form.get('status') || 'active');

    if (!name) {
      return NextResponse.json({ error: 'name required' }, { status: 400 });
    }
    const slug = slugIn || slugify(name);

    const rows = await client`
      INSERT INTO platform.tenants (name, slug, plan, status)
      VALUES (${name}, ${slug}, ${plan}, ${status})
      RETURNING id
    `;

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Failed to create tenant' }, { status: 400 });
    }
    const insertedId = rows[0].id;

    // Vincula o usuário atual como owner do tenant criado e define como ativo
    try {
      const ctx = await getLogtoContext(logtoConfig);
      const userId = ctx.claims?.sub;
      if (userId && insertedId) {
        await client`
          INSERT INTO platform.user_tenant_roles (user_id, tenant_id, role)
          VALUES (${userId}, ${insertedId}, 'owner')
          ON CONFLICT (user_id, tenant_id)
          DO UPDATE SET role = EXCLUDED.role
        `;
        const res = NextResponse.redirect(new URL('/control/orgs', req.url));
        res.cookies.set('active_tenant_id', String(insertedId), { path: '/', httpOnly: true, sameSite: 'lax' });
        return res;
      }
    } catch {}
    return NextResponse.redirect(new URL('/control/orgs', req.url));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  } finally {
    await close();
  }
}
