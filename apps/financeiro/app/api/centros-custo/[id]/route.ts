import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient();
    const { id } = params;

    const { data, error } = await supabase
      .from('fin_centros_custo')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .single();

    if (error) {
      console.error('❌ Erro ao buscar centro de custo:', error);
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(data);
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

    console.log('📝 Atualizando centro de custo:', id);

    const { data, error } = await supabase
      .from('fin_centros_custo')
      .update(body)
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao atualizar centro de custo:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log('✅ Centro de custo atualizado');
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('❌ Erro inesperado:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient();
    const { id } = params;

    console.log('🗑️ Deletando centro de custo:', id);

    // Verificar se tem alocações
    const { data: alocacoes } = await supabase
      .from('fin_alocacoes')
      .select('id')
      .eq('centro_custo_id', id)
      .eq('tenant_id', tenantId);

    if (alocacoes && alocacoes.length > 0) {
      return NextResponse.json(
        { error: 'Não é possível deletar. Centro de custo possui alocações vinculadas.' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('fin_centros_custo')
      .delete()
      .eq('id', id)
      .eq('tenant_id', tenantId);

    if (error) {
      console.error('❌ Erro ao deletar centro de custo:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log('✅ Centro de custo deletado');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('❌ Erro inesperado:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
