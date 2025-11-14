import { createClient } from '@/lib/supabase/server';
import { getCurrentTenantId } from '@/lib/tenant';
import { NextResponse } from 'next/server';


export async function GET(request: Request) {
  try {
    const supabase = createClient();
    const tenantId = await getCurrentTenantId();
    const { searchParams } = new URL(request.url);
    
    const centro_custo_id = searchParams.get('centro_custo_id');
    const receita_id = searchParams.get('receita_id');
    const despesa_id = searchParams.get('despesa_id');

    let query = supabase
      .from('fin_alocacoes')
      .select(`
        *,
        centro_custo:fin_centros_custo(id, codigo, nome),
        receita:fin_receitas(id, descricao, valor_brl),
        despesa:fin_despesas(id, descricao, valor_brl)
      `)
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });

    if (centro_custo_id) query = query.eq('centro_custo_id', centro_custo_id);
    if (receita_id) query = query.eq('receita_id', receita_id);
    if (despesa_id) query = query.eq('despesa_id', despesa_id);

    const { data, error } = await query;

    if (error) {
      console.error('❌ Erro ao buscar alocações:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`✅ ${data.length} alocações encontradas`);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('❌ Erro inesperado:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const tenantId = await getCurrentTenantId();
    const body = await request.json();

    console.log('📥 Criando alocação:', body);

    // Validar que tem receita OU despesa
    if ((!body.receita_id && !body.despesa_id) || (body.receita_id && body.despesa_id)) {
      return NextResponse.json(
        { error: 'Deve ter receita_id OU despesa_id, não ambos' },
        { status: 400 }
      );
    }

    const dados = {
      ...body,
      tenant_id: tenantId,
    };

    const { data, error } = await supabase
      .from('fin_alocacoes')
      .insert(dados)
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao criar alocação:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log('✅ Alocação criada:', data.id);
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('❌ Erro inesperado:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
