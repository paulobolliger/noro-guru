import { NextResponse } from 'next/server';
import { createDatabaseClient } from '@noro/db';

export async function GET(req: Request) {
  const { client, close } = createDatabaseClient();
  try {
    const url = new URL(req.url);
    const page = Math.max(1, Number(url.searchParams.get('page') || '1'));
    const pageSize = Math.max(1, Math.min(100, Number(url.searchParams.get('pageSize') || '10')));
    const q = (url.searchParams.get('q') || '').trim();

    const offset = (page - 1) * pageSize;

    let items;
    let totalCount;

    if (q) {
      const searchPattern = `%${q}%`;
      items = await client`
        SELECT id, name, slug, plan, status, created_at
        FROM platform.tenants
        WHERE name ILIKE ${searchPattern} 
           OR slug ILIKE ${searchPattern} 
           OR plan ILIKE ${searchPattern}
        ORDER BY created_at DESC
        LIMIT ${pageSize} OFFSET ${offset}
      `;

      const countResult = await client`
        SELECT count(*)::int as count
        FROM platform.tenants
        WHERE name ILIKE ${searchPattern} 
           OR slug ILIKE ${searchPattern} 
           OR plan ILIKE ${searchPattern}
      `;
      totalCount = countResult[0]?.count ?? 0;
    } else {
      items = await client`
        SELECT id, name, slug, plan, status, created_at
        FROM platform.tenants
        ORDER BY created_at DESC
        LIMIT ${pageSize} OFFSET ${offset}
      `;

      const countResult = await client`
        SELECT count(*)::int as count
        FROM platform.tenants
      `;
      totalCount = countResult[0]?.count ?? 0;
    }

    return NextResponse.json({ items: items || [], total: totalCount, page, pageSize });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  } finally {
    await close();
  }
}
