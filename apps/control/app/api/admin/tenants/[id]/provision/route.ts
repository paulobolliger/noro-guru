// app/api/admin/tenants/[id]/provision/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { createTenantSchema, deleteTenantSchema } from '@/lib/provisioning/tenant-provisioner';

/**
 * POST /api/admin/tenants/[id]/provision
 * Provisiona o schema dedicado do tenant
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAdminSupabaseClient();
    const tenantId = params.id;

    // Buscar tenant
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

    // Verificar se já foi provisionado
    if (tenant.schema_provisioned) {
      return NextResponse.json(
        { error: 'Schema já foi provisionado para este tenant' },
        { status: 400 }
      );
    }

    // Provisionar schema
    const result = await createTenantSchema({
      tenant_id: tenantId,
      slug: tenant.slug,
      name: tenant.name,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Erro ao provisionar schema' },
        { status: 500 }
      );
    }

    // Atualizar flag no tenant
    await supabase
      .schema('cp')
      .from('tenants')
      .update({ schema_provisioned: true })
      .eq('id', tenantId);

    // Registrar evento
    await supabase
      .schema('cp')
      .from('system_events')
      .insert({
        tenant_id: tenantId,
        type: 'schema_provisioned',
        message: `Schema ${result.schemaName} provisionado com sucesso`,
        data: { schema_name: result.schemaName },
      });

    return NextResponse.json({
      success: true,
      message: 'Schema provisionado com sucesso',
      schema_name: result.schemaName,
    });
  } catch (error: any) {
    console.error('[Provision Tenant] Error:', error);
    return NextResponse.json(
      { error: 'Erro ao provisionar tenant', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/tenants/[id]/provision
 * Remove o schema dedicado do tenant (PERIGOSO!)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAdminSupabaseClient();
    const tenantId = params.id;

    // Buscar tenant
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

    // Verificar se foi provisionado
    if (!tenant.schema_provisioned) {
      return NextResponse.json(
        { error: 'Schema não foi provisionado para este tenant' },
        { status: 400 }
      );
    }

    // Remover schema (PERIGOSO!)
    const result = await deleteTenantSchema(tenant.slug);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Erro ao remover schema' },
        { status: 500 }
      );
    }

    // Atualizar flag no tenant
    await supabase
      .schema('cp')
      .from('tenants')
      .update({ schema_provisioned: false })
      .eq('id', tenantId);

    // Registrar evento
    await supabase
      .schema('cp')
      .from('system_events')
      .insert({
        tenant_id: tenantId,
        type: 'schema_deprovisioned',
        message: `Schema tenant_${tenant.slug} removido`,
        data: { schema_name: `tenant_${tenant.slug}` },
      });

    return NextResponse.json({
      success: true,
      message: 'Schema removido com sucesso',
    });
  } catch (error: any) {
    console.error('[Deprovision Tenant] Error:', error);
    return NextResponse.json(
      { error: 'Erro ao remover schema', message: error.message },
      { status: 500 }
    );
  }
}
