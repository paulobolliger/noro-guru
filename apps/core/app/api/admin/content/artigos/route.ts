import { createServerSupabaseClient } from '@noro/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createServerSupabaseClient();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'draft';
  const search = searchParams.get('search');
  const categoria = searchParams.get('categoria');

  let query = supabase
    .from('noro_ai_artigos')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (search) {
    query = query.ilike('titulo', `%${search}%`);
  }
  
  if (categoria) {
     query = query.eq('categoria', categoria);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const items = data.map(item => {
    const validation = {
        seo: { status: 'success', missing: [] },
        openGraph: { status: 'warning', missing: ['image'] },
        otherFields: { status: 'success', missing: [] }
    };

    return {
      id: item.id,
      titulo: item.titulo,
      categoria: item.categoria,
      created_at: item.created_at,
      resumo: item.titulo, // Placeholder
      validation,
      total_cost: 0 
    };
  });

  return NextResponse.json({ items });
}

export async function DELETE(request: Request) {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const { error } = await supabase.from('noro_ai_artigos').delete().eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
