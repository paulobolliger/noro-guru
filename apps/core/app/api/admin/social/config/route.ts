// app/api/admin/social/config/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getCurrentTenantId } from '@/lib/tenant';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const tenantId = await getCurrentTenantId();

    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // Buscar configurações de redes sociais
    const { data: configs, error } = await supabase
      .from('social_network_configs')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar configurações:', error);
      return NextResponse.json({
        success: false,
        error: 'Erro ao buscar configurações',
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      configs: configs || [],
    });

  } catch (error) {
    console.error('Erro na API de configuração social:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const tenantId = await getCurrentTenantId();

    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // Obter dados do body
    const body = await request.json();
    const { provider, credentials } = body;

    if (!provider || !credentials) {
      return NextResponse.json({
        success: false,
        error: 'Provider e credentials são obrigatórios',
      }, { status: 400 });
    }

    // Criar ou atualizar configuração
    const configData = {
      tenant_id: tenantId,
      provider,
      credentials,
      active_provider: provider,
      status: 'connected',
      created_by: user.id,
      updated_at: new Date().toISOString(),
    };

    // Verificar se já existe configuração para este provider
    const { data: existing } = await supabase
      .from('social_network_configs')
      .select('id')
      .eq('tenant_id', tenantId)
      .eq('provider', provider)
      .single();

    let result;
    if (existing) {
      // Atualizar existente
      result = await supabase
        .from('social_network_configs')
        .update(configData)
        .eq('id', existing.id)
        .select()
        .single();
    } else {
      // Criar novo
      result = await supabase
        .from('social_network_configs')
        .insert({
          ...configData,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();
    }

    if (result.error) {
      console.error('Erro ao salvar configuração:', result.error);
      return NextResponse.json({
        success: false,
        error: 'Erro ao salvar configuração',
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      config: result.data,
    });

  } catch (error) {
    console.error('Erro na API de configuração social:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
    }, { status: 500 });
  }
}
