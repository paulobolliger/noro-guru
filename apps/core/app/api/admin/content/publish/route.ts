import { createServerSupabaseClient } from '@noro/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
  const supabase = createServerSupabaseClient();
  const body = await request.json();
  const { id, type, status } = body;

  if (!id || !type || !status) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const table = type === 'roteiro' ? 'noro_ai_roteiros' : 'noro_ai_artigos';

  const { error } = await supabase
    .from(table)
    .update({ status })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
