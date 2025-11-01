import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from('fin_categorias')
      .insert([body])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar categoria:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro no POST /api/categorias:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
