// app/api/admin/tenants/[id]/metrics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@lib/supabase/admin';

/**
 * GET /api/admin/tenants/[id]/metrics
 * Retorna métricas e estatísticas do tenant
 */
export async function GET(
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
      .select('slug')
      .eq('id', tenantId)
      .single();

    if (tenantError || !tenant) {
      return NextResponse.json(
        { error: 'Tenant não encontrado' },
        { status: 404 }
      );
    }

    const schemaName = `tenant_${tenant.slug}`;

    // Verificar se schema existe
    const { data: schemaExists } = await supabase
      .rpc('schema_exists', { p_schema_name: schemaName })
      .single();

    if (!schemaExists) {
      // Schema não provisionado, retornar métricas zeradas
      return NextResponse.json({
        metrics: {
          total_users: 0,
          total_clients: 0,
          total_orders: 0,
          total_quotes: 0,
          total_revenue: 0,
          schema_provisioned: false,
        },
      });
    }

    // Contar usuários do tenant
    const { count: usersCount } = await supabase
      .schema('cp')
      .from('user_tenant_roles')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId);

    // TODO: Implementar queries para contar dados do schema do tenant
    // Isso requer função RPC ou query dinâmica para acessar o schema do tenant

    return NextResponse.json({
      metrics: {
        total_users: usersCount || 0,
        total_clients: 0, // TODO: Implementar
        total_orders: 0, // TODO: Implementar
        total_quotes: 0, // TODO: Implementar
        total_revenue: 0, // TODO: Implementar
        schema_provisioned: true,
      },
    });
  } catch (error: any) {
    console.error('[Get Tenant Metrics] Error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar métricas', message: error.message },
      { status: 500 }
    );
  }
}
