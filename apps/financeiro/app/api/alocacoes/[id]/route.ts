import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const TENANT_ID = 'd43ef2d2-cbf1-4133-b805-77c3f6444bc2'; // NORO

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient();
    const { id } = params;

    console.log('🗑️ Deletando alocação:', id);

    const { error } = await supabase
      .from('fin_alocacoes')
      .delete()
      .eq('id', id)
      .eq('tenant_id', TENANT_ID);

    if (error) {
      console.error('❌ Erro ao deletar alocação:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log('✅ Alocação deletada');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('❌ Erro inesperado:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient();
    const { id } = params;
    const body = await request.json();

    console.log('📝 Atualizando alocação:', id);

    const { data, error } = await supabase
      .from('fin_alocacoes')
      .update(body)
      .eq('id', id)
      .eq('tenant_id', TENANT_ID)
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao atualizar alocação:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log('✅ Alocação atualizada');
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('❌ Erro inesperado:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
