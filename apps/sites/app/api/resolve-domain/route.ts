import { NextResponse } from 'next/server';
import { createDatabaseClient } from '@noro/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const domain = searchParams.get('domain');

  if (!domain) {
    return NextResponse.json({ slug: null }, { status: 400 });
  }

  const { client, close } = createDatabaseClient();
  try {
    // 1. Find the tenant_id for this domain from sites.domains
    const domainRows = await client`
      SELECT tenant_id FROM sites.domains
      WHERE domain = ${domain} AND status = 'active'
      LIMIT 1
    `;

    if (!domainRows || domainRows.length === 0) {
      return NextResponse.json({ slug: null });
    }

    const tenantId = domainRows[0].tenant_id;

    // 2. Find the agency site slug for this tenant_id
    const siteRows = await client`
      SELECT slug FROM sites.agency_sites
      WHERE tenant_id = ${tenantId} AND status = 'published'
      LIMIT 1
    `;

    if (!siteRows || siteRows.length === 0) {
      return NextResponse.json({ slug: null });
    }

    return NextResponse.json({ slug: siteRows[0].slug });
  } catch (error) {
    console.error('[resolve-domain] Error:', error);
    return NextResponse.json({ slug: null }, { status: 500 });
  } finally {
    await close();
  }
}
