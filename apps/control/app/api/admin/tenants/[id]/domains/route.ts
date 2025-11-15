// app/api/admin/tenants/[id]/domains/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@lib/supabase/admin';

/**
 * POST /api/admin/tenants/[id]/domains
 * Adiciona um domínio customizado ao tenant
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAdminSupabaseClient();
    const tenantId = params.id;
    const body = await request.json();
    const { domain, is_default } = body;

    if (!domain || typeof domain !== 'string') {
      return NextResponse.json(
        { error: 'Campo "domain" é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se domínio já existe
    const { data: existing } = await supabase
      .schema('cp')
      .from('domains')
      .select('id')
      .eq('domain', domain)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Este domínio já está em uso' },
        { status: 400 }
      );
    }

    // Se for domínio padrão, remover flag de outros domínios
    if (is_default) {
      await supabase
        .schema('cp')
        .from('domains')
        .update({ is_default: false })
        .eq('tenant_id', tenantId);
    }

    const { data: newDomain, error } = await supabase
      .schema('cp')
      .from('domains')
      .insert({
        tenant_id: tenantId,
        domain,
        is_default: is_default || false,
        verified: false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: `Erro ao adicionar domínio: ${error.message}` },
        { status: 500 }
      );
    }

    // Registrar evento
    await supabase
      .schema('cp')
      .from('system_events')
      .insert({
        tenant_id: tenantId,
        type: 'domain_added',
        message: `Domínio ${domain} adicionado`,
        data: { domain, is_default },
      });

    return NextResponse.json({
      success: true,
      domain: newDomain,
      message: 'Domínio adicionado com sucesso',
    });
  } catch (error: any) {
    console.error('[Add Domain] Error:', error);
    return NextResponse.json(
      { error: 'Erro ao adicionar domínio', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/tenants/[id]/domains
 * Remove um domínio do tenant
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createAdminSupabaseClient();
    const url = new URL(request.url);
    const domainId = url.searchParams.get('domainId');

    if (!domainId) {
      return NextResponse.json(
        { error: 'domainId é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar domínio
    const { data: domain } = await supabase
      .schema('cp')
      .from('domains')
      .select('*')
      .eq('id', domainId)
      .single();

    if (!domain) {
      return NextResponse.json(
        { error: 'Domínio não encontrado' },
        { status: 404 }
      );
    }

    // Não permitir deletar domínio padrão
    if (domain.is_default) {
      return NextResponse.json(
        { error: 'Não é possível remover o domínio padrão' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .schema('cp')
      .from('domains')
      .delete()
      .eq('id', domainId);

    if (error) {
      return NextResponse.json(
        { error: `Erro ao remover domínio: ${error.message}` },
        { status: 500 }
      );
    }

    // Registrar evento
    await supabase
      .schema('cp')
      .from('system_events')
      .insert({
        tenant_id: domain.tenant_id,
        type: 'domain_removed',
        message: `Domínio ${domain.domain} removido`,
        data: { domain: domain.domain },
      });

    return NextResponse.json({
      success: true,
      message: 'Domínio removido com sucesso',
    });
  } catch (error: any) {
    console.error('[Delete Domain] Error:', error);
    return NextResponse.json(
      { error: 'Erro ao remover domínio', message: error.message },
      { status: 500 }
    );
  }
}
