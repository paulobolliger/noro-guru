// app/api/admin/tenants/[id]/settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

/**
 * PATCH /api/admin/tenants/[id]/settings
 * Atualiza configurações avançadas do tenant
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAdminSupabaseClient();
    const tenantId = params.id;
    const settings = await request.json();

    // Verificar se tenant existe
    const { data: tenant, error: tenantError } = await supabase
      .schema('cp')
      .from('tenants')
      .select('id, name')
      .eq('id', tenantId)
      .single();

    if (tenantError || !tenant) {
      return NextResponse.json(
        { error: 'Tenant não encontrado' },
        { status: 404 }
      );
    }

    // Salvar configurações como JSONB no campo settings
    const { data, error } = await supabase
      .schema('cp')
      .from('tenants')
      .update({
        settings: settings,
        updated_at: new Date().toISOString(),
      })
      .eq('id', tenantId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Registrar evento
    await supabase
      .schema('cp')
      .from('system_events')
      .insert({
        tenant_id: tenantId,
        type: 'settings_updated',
        message: `Configurações do tenant ${tenant.name} atualizadas`,
        data: { settings },
      });

    return NextResponse.json({
      success: true,
      message: 'Configurações atualizadas com sucesso',
      tenant: data,
    });
  } catch (error: any) {
    console.error('[Update Tenant Settings] Error:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar configurações', message: error.message },
      { status: 500 }
    );
  }
}
