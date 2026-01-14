import { createServerSupabaseClient } from '@noro/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createServerSupabaseClient();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'draft';
  const search = searchParams.get('search');
  const categoria = searchParams.get('categoria');

  let query = supabase
    .from('noro_ai_roteiros')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (search) {
    query = query.ilike('titulo', `%${search}%`);
  }
  
  // Note: categoria filtering might require JSONB filtering if it's inside 'conteudo' or a real column
  // Assuming 'conteudo'->'tags' contains category for now, or just skipping specific filter if column doesn't exist
  // My migration didn't add 'categoria' column to roteiros table, only 'tipo'.
  if (categoria) {
     query = query.eq('tipo', categoria);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Transform data to match ContentListTable expectations
  const items = data.map(item => {
    // Mock validation logic
    const validation = {
        seo: { status: 'success', missing: [] },
        openGraph: { status: 'warning', missing: ['image'] },
        otherFields: { status: 'success', missing: [] }
    };

    return {
      id: item.id,
      titulo: item.titulo,
      categoria: item.tipo || 'Geral', // Mapping 'tipo' to 'categoria' for display
      created_at: item.created_at,
      descricao_curta: item.destino, // Using 'destino' as short description
      validation,
      total_cost: 0 // Placeholder
    };
  });

  return NextResponse.json({ items });
}

export async function DELETE(request: Request) {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const { error } = await supabase.from('noro_ai_roteiros').delete().eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
