import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();
    const { id } = params;

    const { data, error } = await supabase
      .from('fin_contas_bancarias')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar conta bancária:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro no PUT /api/bancos/[id]:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient();
    const { id } = params;

    const { error } = await supabase
      .from('fin_contas_bancarias')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar conta bancária:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro no DELETE /api/bancos/[id]:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
