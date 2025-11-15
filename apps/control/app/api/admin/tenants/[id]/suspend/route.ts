// app/api/admin/tenants/[id]/suspend/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

/**
 * POST /api/admin/tenants/[id]/suspend
 * Suspende ou reativa um tenant
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAdminSupabaseClient();
    const tenantId = params.id;
    const body = await request.json();
    const { suspend, reason } = body;

    if (typeof suspend !== 'boolean') {
      return NextResponse.json(
        { error: 'Campo "suspend" é obrigatório (boolean)' },
        { status: 400 }
      );
    }

    const newStatus = suspend ? 'suspended' : 'active';

    const { data: tenant, error } = await supabase
      .schema('cp')
      .from('tenants')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', tenantId)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: `Erro ao atualizar status: ${error.message}` },
        { status: 500 }
      );
    }

    // Registrar evento
    await supabase
      .schema('cp')
      .from('system_events')
      .insert({
        tenant_id: tenantId,
        type: suspend ? 'tenant_suspended' : 'tenant_activated',
        message: suspend
          ? `Tenant ${tenant.name} suspenso`
          : `Tenant ${tenant.name} reativado`,
        data: { reason: reason || null },
      });

    return NextResponse.json({
      success: true,
      tenant,
      message: suspend ? 'Tenant suspenso com sucesso' : 'Tenant reativado com sucesso',
    });
  } catch (error: any) {
    console.error('[Suspend Tenant] Error:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar status do tenant', message: error.message },
      { status: 500 }
    );
  }
}
