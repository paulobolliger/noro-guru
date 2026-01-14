import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const tenantId = '00000000-0000-0000-0000-000000000000'; // TODO: Get from context


export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { id } = params;

    console.log('🗑️ Deletando alocação:', id);

    const { error } = await supabase
      .from('fin_alocacoes')
      .delete()
      .eq('id', id)
      .eq('tenant_id', tenantId);

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
    const supabase = createClient();
    const { id } = params;
    const body = await request.json();

    console.log('📝 Atualizando alocação:', id);

    const { data, error } = await supabase
      .from('fin_alocacoes')
      .update(body)
      .eq('id', id)
      .eq('tenant_id', tenantId)
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
