// app/api/admin/tenants/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@lib/supabase/admin';

/**
 * GET /api/admin/tenants/[id]
 * Retorna detalhes completos de um tenant
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAdminSupabaseClient();
    const tenantId = params.id;

    // Buscar dados do tenant
    const { data: tenant, error: tenantError } = await supabase
      .schema('cp')
      .from('tenants')
      .select('*')
      .eq('id', tenantId)
      .single();

    if (tenantError || !tenant) {
      return NextResponse.json(
        { error: 'Tenant não encontrado' },
        { status: 404 }
      );
    }

    // Buscar domínios
    const { data: domains } = await supabase
      .schema('cp')
      .from('domains')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('is_default', { ascending: false });

    // Buscar usuários e roles
    const { data: users } = await supabase
      .schema('cp')
      .from('user_tenant_roles')
      .select(`
        role,
        created_at,
        user:user_id (
          id,
          email,
          raw_user_meta_data
        )
      `)
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });

    // Buscar eventos recentes
    const { data: events } = await supabase
      .schema('cp')
      .from('system_events')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .limit(20);

    return NextResponse.json({
      tenant,
      domains: domains || [],
      users: users || [],
      events: events || [],
    });
  } catch (error: any) {
    console.error('[Get Tenant Details] Error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar detalhes do tenant', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/tenants/[id]
 * Atualiza dados do tenant
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAdminSupabaseClient();
    const tenantId = params.id;
    const body = await request.json();

    const allowedFields = ['name', 'plan', 'billing_email', 'notes'];
    const updates: any = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'Nenhum campo para atualizar' },
        { status: 400 }
      );
    }

    updates.updated_at = new Date().toISOString();

    const { data: tenant, error } = await supabase
      .schema('cp')
      .from('tenants')
      .update(updates)
      .eq('id', tenantId)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: `Erro ao atualizar tenant: ${error.message}` },
        { status: 500 }
      );
    }

    // Registrar evento
    await supabase
      .schema('cp')
      .from('system_events')
      .insert({
        tenant_id: tenantId,
        type: 'tenant_updated',
        message: `Tenant ${tenant.name} atualizado`,
        data: updates,
      });

    return NextResponse.json({ success: true, tenant });
  } catch (error: any) {
    console.error('[Update Tenant] Error:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar tenant', message: error.message },
      { status: 500 }
    );
  }
}
