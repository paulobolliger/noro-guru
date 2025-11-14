import { createClient } from '@/lib/supabase/server';
import { getCurrentTenantId } from '@/lib/tenant';
import { NextResponse } from 'next/server';


export async function GET(request: Request) {
  try {
    const supabase = createClient();
    const tenantId = await getCurrentTenantId();
    const { searchParams } = new URL(request.url);
    
    const status = searchParams.get('status');
    const tipo = searchParams.get('tipo');
    const marca = searchParams.get('marca');

    let query = supabase
      .from('fin_centros_custo')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);
    if (tipo) query = query.eq('tipo', tipo);
    if (marca) query = query.eq('marca', marca);

    const { data, error } = await query;

    if (error) {
      console.error('❌ Erro ao buscar centros de custo:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`✅ ${data.length} centros de custo encontrados`);
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

    console.log('📥 Criando centro de custo:', body);

    const dados = {
      ...body,
      tenant_id: tenantId,
    };

    const { data, error } = await supabase
      .from('fin_centros_custo')
      .insert(dados)
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao criar centro de custo:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log('✅ Centro de custo criado:', data.id);
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('❌ Erro inesperado:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
