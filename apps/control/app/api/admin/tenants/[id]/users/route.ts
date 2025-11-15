// app/api/admin/tenants/[id]/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@lib/supabase/admin';

/**
 * POST /api/admin/tenants/[id]/users
 * Adiciona um usuário ao tenant
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAdminSupabaseClient();
    const tenantId = params.id;
    const body = await request.json();
    const { email, name, role = 'user' } = body;

    if (!email || !name) {
      return NextResponse.json(
        { error: 'email e name são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se tenant existe
    const { data: tenant } = await supabase
      .schema('cp')
      .from('tenants')
      .select('id, name')
      .eq('id', tenantId)
      .single();

    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant não encontrado' },
        { status: 404 }
      );
    }

    // Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        name,
      },
    });

    if (authError) {
      // Verificar se usuário já existe
      if (authError.message.includes('already registered')) {
        // Buscar usuário existente
        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        const existingUser = existingUsers?.users.find((u) => u.email === email);

        if (existingUser) {
          // Associar usuário existente ao tenant
          const { error: roleError } = await supabase
            .schema('cp')
            .from('user_tenant_roles')
            .insert({
              user_id: existingUser.id,
              tenant_id: tenantId,
              role,
            });

          if (roleError) {
            if (roleError.message.includes('duplicate')) {
              return NextResponse.json(
                { error: 'Usuário já está associado a este tenant' },
                { status: 400 }
              );
            }
            throw roleError;
          }

          // Registrar evento
          await supabase
            .schema('cp')
            .from('system_events')
            .insert({
              tenant_id: tenantId,
              type: 'user_added',
              message: `Usuário ${email} adicionado ao tenant`,
              data: { email, role },
            });

          return NextResponse.json({
            success: true,
            message: 'Usuário existente associado ao tenant',
            user_id: existingUser.id,
          });
        }
      }

      throw authError;
    }

    // Associar usuário ao tenant
    const { error: roleError } = await supabase
      .schema('cp')
      .from('user_tenant_roles')
      .insert({
        user_id: authData.user.id,
        tenant_id: tenantId,
        role,
      });

    if (roleError) {
      throw roleError;
    }

    // Registrar evento
    await supabase
      .schema('cp')
      .from('system_events')
      .insert({
        tenant_id: tenantId,
        type: 'user_added',
        message: `Usuário ${email} adicionado ao tenant`,
        data: { email, role },
      });

    return NextResponse.json({
      success: true,
      message: 'Usuário adicionado com sucesso',
      user_id: authData.user.id,
    });
  } catch (error: any) {
    console.error('[Add User to Tenant] Error:', error);
    return NextResponse.json(
      { error: 'Erro ao adicionar usuário', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/tenants/[id]/users
 * Remove um usuário do tenant
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createAdminSupabaseClient();
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const tenantId = url.pathname.split('/')[4]; // Extract tenant ID from path

    if (!userId) {
      return NextResponse.json(
        { error: 'userId é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar associação
    const { data: association } = await supabase
      .schema('cp')
      .from('user_tenant_roles')
      .select('*, user:user_id(email)')
      .eq('user_id', userId)
      .eq('tenant_id', tenantId)
      .single();

    if (!association) {
      return NextResponse.json(
        { error: 'Usuário não está associado a este tenant' },
        { status: 404 }
      );
    }

    // Remover associação
    const { error } = await supabase
      .schema('cp')
      .from('user_tenant_roles')
      .delete()
      .eq('user_id', userId)
      .eq('tenant_id', tenantId);

    if (error) {
      throw error;
    }

    // Registrar evento
    await supabase
      .schema('cp')
      .from('system_events')
      .insert({
        tenant_id: tenantId,
        type: 'user_removed',
        message: `Usuário ${(association as any).user?.email || userId} removido do tenant`,
        data: { user_id: userId },
      });

    return NextResponse.json({
      success: true,
      message: 'Usuário removido com sucesso',
    });
  } catch (error: any) {
    console.error('[Remove User from Tenant] Error:', error);
    return NextResponse.json(
      { error: 'Erro ao remover usuário', message: error.message },
      { status: 500 }
    );
  }
}
