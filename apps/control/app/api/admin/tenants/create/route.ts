// app/api/admin/tenants/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createTenantSchema, type CreateTenantInput } from '@/lib/schemas/tenant.schema';
import { createTenantSchema as provisionSchema } from '@/lib/provisioning/tenant-provisioner';

/**
 * POST /api/admin/tenants/create
 *
 * Cria um novo tenant no sistema
 *
 * Processo:
 * 1. Validar dados de entrada
 * 2. Criar registro em cp.tenants
 * 3. Criar domínio padrão (slug.noro.guru)
 * 4. Criar usuário admin no auth.users
 * 5. Associar admin ao tenant (cp.user_tenant_roles)
 * 6. Provisionar schema do tenant (opcional)
 * 7. Enviar email de boas-vindas
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Verificar autenticação e permissões
    // TODO: Verificar se usuário é super_admin

    // 2. Parsear e validar body
    const body = await request.json();
    const validated = createTenantSchema.parse(body) as CreateTenantInput;

    // 3. Criar cliente Supabase com service role
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    // 4. Verificar se slug já existe
    const { data: existingTenant } = await supabase
      .schema('cp')
      .from('tenants')
      .select('id')
      .eq('slug', validated.slug)
      .single();

    if (existingTenant) {
      return NextResponse.json(
        { error: 'Slug já está em uso. Escolha outro.' },
        { status: 400 }
      );
    }

    // 5. Criar tenant
    console.log('[Create Tenant] Creating tenant:', validated.slug);

    const { data: tenant, error: tenantError } = await supabase
      .schema('cp')
      .from('tenants')
      .insert({
        name: validated.name,
        slug: validated.slug,
        plan: validated.plan,
        billing_email: validated.billing_email,
        status: 'provisioning',
        notes: `Created via Control Plane API`,
      })
      .select()
      .single();

    if (tenantError) {
      console.error('[Create Tenant] Error creating tenant:', tenantError);
      return NextResponse.json(
        { error: `Erro ao criar tenant: ${tenantError.message}` },
        { status: 500 }
      );
    }

    console.log('[Create Tenant] Tenant created:', tenant.id);

    // 6. Criar domínio padrão
    const defaultDomain = `${validated.slug}.noro.guru`;

    const { error: domainError } = await supabase
      .schema('cp')
      .from('domains')
      .insert({
        tenant_id: tenant.id,
        domain: defaultDomain,
        is_default: true,
      });

    if (domainError) {
      console.error('[Create Tenant] Error creating domain:', domainError);
      // Não falhar, apenas logar
    } else {
      console.log('[Create Tenant] Domain created:', defaultDomain);
    }

    // 7. Criar usuário admin
    console.log('[Create Tenant] Creating admin user:', validated.admin_email);

    const { data: adminUser, error: adminError } = await supabase.auth.admin.createUser({
      email: validated.admin_email,
      email_confirm: true,
      user_metadata: {
        name: validated.admin_name,
        tenant_id: tenant.id,
        role: 'admin',
      },
    });

    if (adminError) {
      console.error('[Create Tenant] Error creating admin user:', adminError);

      // Se falhar, tentar encontrar usuário existente
      const { data: existingUser } = await supabase
        .from('auth.users')
        .select('id')
        .eq('email', validated.admin_email)
        .single();

      if (existingUser) {
        console.log('[Create Tenant] Using existing user:', existingUser.id);

        // Associar usuário existente ao tenant
        await supabase
          .schema('cp')
          .from('user_tenant_roles')
          .insert({
            user_id: existingUser.id,
            tenant_id: tenant.id,
            role: 'admin',
          });
      } else {
        // Falhou criar e não encontrou existente
        return NextResponse.json(
          { error: `Erro ao criar usuário admin: ${adminError.message}` },
          { status: 500 }
        );
      }
    } else {
      console.log('[Create Tenant] Admin user created:', adminUser.user.id);

      // 8. Associar admin ao tenant
      const { error: roleError } = await supabase
        .schema('cp')
        .from('user_tenant_roles')
        .insert({
          user_id: adminUser.user.id,
          tenant_id: tenant.id,
          role: 'admin',
        });

      if (roleError) {
        console.error('[Create Tenant] Error assigning admin role:', roleError);
      } else {
        console.log('[Create Tenant] Admin role assigned');
      }
    }

    // 9. Provisionar schema (opcional, pode ser feito depois)
    // const provisionResult = await provisionSchema({
    //   tenant_id: tenant.id,
    //   slug: tenant.slug,
    //   copy_from_core: true,
    // });

    // if (!provisionResult.success) {
    //   console.error('[Create Tenant] Provisioning failed:', provisionResult.error);
    // }

    // 10. Atualizar status do tenant para 'active'
    await supabase
      .schema('cp')
      .from('tenants')
      .update({ status: 'active' })
      .eq('id', tenant.id);

    // 11. Registrar evento no sistema
    await supabase
      .schema('cp')
      .from('system_events')
      .insert({
        tenant_id: tenant.id,
        type: 'tenant_created',
        message: `Tenant ${tenant.name} created`,
        data: {
          slug: tenant.slug,
          plan: tenant.plan,
          admin_email: validated.admin_email,
        },
      });

    // 12. TODO: Enviar email de boas-vindas
    // await sendWelcomeEmail({
    //   to: validated.admin_email,
    //   tenantName: tenant.name,
    //   loginUrl: `https://${defaultDomain}/login`,
    // });

    console.log('[Create Tenant] Tenant creation completed:', tenant.id);

    return NextResponse.json({
      success: true,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        plan: tenant.plan,
        status: 'active',
        domain: defaultDomain,
      },
      message: 'Tenant criado com sucesso!',
    });

  } catch (error: any) {
    console.error('[Create Tenant] Unexpected error:', error);

    // Se for erro de validação Zod
    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          error: 'Dados inválidos',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Erro interno do servidor',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
