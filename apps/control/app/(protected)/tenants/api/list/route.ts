import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@lib/supabase/server';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = Math.max(1, Number(url.searchParams.get('page') || '1'));
    const pageSize = Math.max(1, Math.min(100, Number(url.searchParams.get('pageSize') || '10')));
    const q = (url.searchParams.get('q') || '').trim();

    const supabase = createServerSupabaseClient();

    let query = supabase
      .schema('cp')
      .from('tenants')
      .select('id, name, slug, plan, status, created_at', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (q) {
      // busca básica em name, slug e plan
      const escaped = q.replace(/%/g, '\\%');
      query = query.or(`name.ilike.%${escaped}%,slug.ilike.%${escaped}%,plan.ilike.%${escaped}%`);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await query.range(from, to);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ items: data || [], total: count || 0, page, pageSize });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
