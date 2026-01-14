'use server';

import { getSupabaseServer } from '@/lib/supabaseServer';
import { notFound } from 'next/navigation';

// ... previous imports

export type TenantContext = {
    tenant: {
        id: string;
        name: string;
        slug: string;
        status?: string;
    };
    empresa?: {
        // ... (existing fields)
        
        // Limites / Créditos (JSONB)
        limites?: {
            email_monthly_quota?: number;
            email_used?: number;
            max_users?: number; // New field
        };
    };
    // ... (rest of type)
    configuracoes?: {
        id: string;
        moeda_padrao: string;
        fuso_horario: string;
        idioma: string;
        formato_data: string;
        logo_url_admin: string;
        topbar_color: string;
    };
    users: {
        id: string;
        email: string;
        nome: string | null;
        role: string;
    }[];
    stats: {
        usersCount: number;
    }
}

// ... (getTenantContext function remains same, just Type updated implicitly)

// ... (getTenantAiBalance ... updateTenantCompany ... updateTenantModules ... updateTenantCredits ... updateTenantSettings)

export async function inviteTenantUser(tenantId: string, email: string, role: string) {
    const supabase = getSupabaseServer();

    // 1. Check Limits
    const { empresa } = await getTenantContext(tenantId);
    const maxUsers = empresa?.limites?.max_users || 1; // Default to 1 user if not set
    const currentUsers = empresa?.limites?.max_users ? await getCurrentUserCount(tenantId) : 1; // Need a helper or reuse getTenantContext details
    // Re-fetching context might be heavy, let's optimize:
    
    // Better: Fetch just count and limits
    const { count } = await supabase
        .from('user_tenants')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenantId);
        
    const { data: companyData } = await supabase
        .from('noro_empresa')
        .select('limites')
        .eq('tenant_id', tenantId)
        .single();
        
    const limit = companyData?.limites?.max_users || 1;
    
    if ((count || 0) >= limit) {
        return { success: false, error: `Limite de usuários atingido (${limit}). Faça um upgrade para adicionar mais.` };
    }

    // 2. "Invite" User (Mock)
    // In real world: supabase.auth.admin.inviteUserByEmail() or similar, then insert into user_tenants
    // Since we don't have Supabase SMTP set up, we'll just mock success for now or log it.
    // However, to make it show up in the list, we need an insert.
    // We cannot insert into 'users' table directly from here without Service Role if referencing auth.users.
    // For this prototype, let's assume we can't create real auth users yet without invite flow.
    // We will return a success message but maybe trigger a "Pending Invites" table if we had one.
    
    // Simulating:
    console.log(`Convite enviado para ${email} (${role}) no tenant ${tenantId}`);
    
    return { success: true, message: 'Convite enviado (Simulado)' };
}

export async function updateTenantMaxUsers(tenantId: string, newLimit: number) {
    const supabase = getSupabaseServer();
    
    // 1. Get current limit
    const { data: existingCompany } = await supabase
        .from('noro_empresa')
        .select('id, limites')
        .eq('tenant_id', tenantId)
        .maybeSingle();

    if (!existingCompany) return { success: false, error: 'Empresa não encontrada' };
    
    const newLimites = {
        ...(existingCompany.limites || {}),
        max_users: newLimit
    };

    // 2. Update limit
    await supabase
        .from('noro_empresa')
        .update({ limites: newLimites })
        .eq('id', existingCompany.id);

    revalidatePath(`/tenants/${tenantId}/usuarios`);
    return { success: true };
}

async function getCurrentUserCount(tenantId: string) {
    const supabase = getSupabaseServer();
    const { count } = await supabase
        .from('user_tenants')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenantId);
    return count || 0;
}

export async function getTenantContext(tenantId: string): Promise<TenantContext> {
    const supabase = getSupabaseServer();

    // 1. Fetch Tenant Base Info
    const { data: tenant, error: tenantError } = await supabase
        .schema('cp')
        .from('tenants')
        .select('*')
        .eq('id', tenantId)
        .single();

    if (tenantError || !tenant) {
        console.error('Error fetching tenant:', tenantError);
        notFound();
    }

    // 2. Fetch Company Data
    const { data: empresa } = await supabase
        .from('noro_empresa')
        .select('*')
        // @ts-ignore
        .eq('tenant_id', tenantId) 
        .maybeSingle();

    // 3. Fetch System Settings
     const { data: config } = await supabase
        .from('noro_configuracoes')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('tipo', 'sistema')
        .maybeSingle();
        
    // 4. Fetch Users
    const { data: userRoles } = await supabase
        .from('user_tenants')
        .select('role, user:user_id(id, email, nome)')
        .eq('tenant_id', tenantId);

    const users = (userRoles || []).map((r: any) => ({
        id: r.user.id,
        email: r.user.email,
        nome: r.user.nome,
        role: r.role
    }));

    return {
        tenant: {
            id: tenant.id,
            name: tenant.name,
            slug: tenant.slug,
            status: tenant.status
        },
        empresa: empresa || undefined,
        configuracoes: config || undefined,
        users: users,
        stats: {
            usersCount: users.length
        }
    };
}

export async function getTenantAiBalance(tenantId: string) {
    const supabase = getSupabaseServer();
    const { data } = await supabase
        .from('noro_ai_wallets')
        .select('balance_cents')
        .eq('tenant_id', tenantId)
        .maybeSingle();
    
    return (data?.balance_cents || 0) / 100; // Return in currency unit (R$)
}

export async function updateTenantCompany(tenantId: string, formData: FormData) {
    const supabase = getSupabaseServer();
    
    // Construct JSON objects from flat form data
    const endereco_sede = {
        cep: formData.get('sede_cep'),
        logradouro: formData.get('sede_logradouro'),
        numero: formData.get('sede_numero'),
        complemento: formData.get('sede_complemento'),
        bairro: formData.get('sede_bairro'),
        cidade: formData.get('sede_cidade'),
        estado: formData.get('sede_estado'),
    };

    const endereco_cobranca = formData.get('same_address') === 'on' ? endereco_sede : {
        cep: formData.get('cobranca_cep'),
        logradouro: formData.get('cobranca_logradouro'),
        numero: formData.get('cobranca_numero'),
        complemento: formData.get('cobranca_complemento'),
        bairro: formData.get('cobranca_bairro'),
        cidade: formData.get('cobranca_cidade'),
        estado: formData.get('cobranca_estado'),
    };

    const representante_legal = {
        nome: formData.get('rep_nome'),
        nacionalidade: formData.get('rep_nacionalidade'),
        estado_civil: formData.get('rep_estado_civil'),
        profissao: formData.get('rep_profissao'),
        rg: formData.get('rep_rg'),
        cpf: formData.get('rep_cpf'),
        email: formData.get('rep_email'),
        endereco_residencial: {
            cep: formData.get('rep_res_cep'),
            logradouro: formData.get('rep_res_logradouro'),
            numero: formData.get('rep_res_numero'),
            complemento: formData.get('rep_res_complemento'),
            bairro: formData.get('rep_res_bairro'),
            cidade: formData.get('rep_res_cidade'),
            estado: formData.get('rep_res_estado'),
        }
    };

    const contatos = {
        financeiro: {
            nome: formData.get('fin_nome'),
            email: formData.get('fin_email'),
            telefone: formData.get('fin_telefone'),
        },
        tecnico: {
            nome: formData.get('tec_nome'),
            email: formData.get('tec_email'),
        }
    };

    const dados_bancarios = {
        banco: formData.get('banco_nome'),
        agencia: formData.get('banco_agencia'),
        conta: formData.get('banco_conta'),
        tipo_conta: formData.get('banco_tipo'),
        chave_pix: formData.get('banco_pix'),
    };

    // Helper to process file input for docs map
    // Check if record exists for existing docs preservation
    const { data: existingRecord } = await supabase
        .from('noro_empresa')
        .select('id, documentos')
        .eq('tenant_id', tenantId)
        .maybeSingle();

    const getDocData = (key: string, file: File | null) => {
        const existingDoc = existingRecord?.documentos?.[key];
        if (file && file.size > 0) {
            return {
                nome: file.name,
                url: null, // Placeholder
                status: 'pending_upload',
                uploaded_at: new Date().toISOString()
            };
        }
        return existingDoc || null;
    };

    const documentos = {
        contrato_social: getDocData('contrato_social', formData.get('contrato_social') as File),
        cartao_cnpj: getDocData('cartao_cnpj', formData.get('cartao_cnpj') as File),
        documento_identidade: getDocData('documento_identidade', formData.get('documento_identidade') as File),
        comprovante_endereco_empresa: getDocData('comprovante_endereco_empresa', formData.get('comprovante_endereco_empresa') as File),
        comprovante_endereco_socio: getDocData('comprovante_endereco_socio', formData.get('comprovante_endereco_socio') as File),
        comprovante_inscricao_municipal: getDocData('comprovante_inscricao_municipal', formData.get('comprovante_inscricao_municipal') as File),
        procuracao: getDocData('procuracao', formData.get('procuracao') as File),
        comprovante_bancario: getDocData('comprovante_bancario', formData.get('comprovante_bancario') as File),
    };
    
    // Logo processing (mock)
    const logoFile = formData.get('logo_file') as File;
    let logo_url = existingRecord?.logo_url; // Keep existing if not changed
    if (logoFile && logoFile.size > 0) {
        // Mock upload url
        // logo_url = await uploadLogo(logoFile); 
        console.log('Logo file received:', logoFile.name);
    }
    // Note: If using a real URL input or existing one, we might want to capture it too.

    const data = {
        nome_empresa: formData.get('nome_empresa'),
        razao_social: formData.get('razao_social'),
        documento: formData.get('documento'),
        inscricao_estadual: formData.get('inscricao_estadual'),
        inscricao_municipal: formData.get('inscricao_municipal'),
        email_principal: formData.get('email_principal'),
        telefone_comercial: formData.get('telefone_comercial'),
        website: formData.get('website'),
        endereco_sede,
        endereco_cobranca,
        representante_legal,
        contatos,
        dados_bancarios,
        documentos
        // logo_url // We aren't really saving a new URL yet without bucket logic
    };

    if (existingRecord) {
        await supabase
            .from('noro_empresa')
            .update(data)
            .eq('id', existingRecord.id);
    } else {
        // Create new if missing
        await supabase
            .from('noro_empresa')
            .insert({
                tenant_id: tenantId,
                ...data
            });
    }

    return { success: true };
}

export async function updateTenantModules(tenantId: string, modulos: any) {
    const supabase = getSupabaseServer();
    
    // Check if record exists
    const { data: existing } = await supabase
        .from('noro_empresa')
        .select('id')
        .eq('tenant_id', tenantId)
        .maybeSingle();

    if (existing) {
        await supabase
            .from('noro_empresa')
            .update({ modulos_contratados: modulos })
            .eq('id', existing.id);
    } else {
        await supabase
            .from('noro_empresa')
            .insert({
                tenant_id: tenantId,
                modulos_contratados: modulos,
                nome_empresa: 'Nova Empresa' // Require minimum field
            });
    }
    
    revalidatePath(`/tenants/${tenantId}/assinatura`);
    return { success: true };
}

export async function updateTenantCredits(tenantId: string, data: { aiBalance: number, emailLimit: number }) {
    const supabase = getSupabaseServer();
    
    // 1. Update Email Limits (in noro_empresa)
    // We fetch existing first to merge or create 'limites'
    const { data: existingCompany } = await supabase
        .from('noro_empresa')
        .select('id, limites')
        .eq('tenant_id', tenantId)
        .maybeSingle();
        
    const newLimites = {
        ...(existingCompany?.limites || {}),
        email_monthly_quota: data.emailLimit
    };
    
    if (existingCompany) {
        await supabase
            .from('noro_empresa')
            .update({ limites: newLimites })
            .eq('id', existingCompany.id);
    } else {
         await supabase
            .from('noro_empresa')
            .insert({ 
                tenant_id: tenantId,
                limites: newLimites,
                nome_empresa: 'Nova Empresa'
            });
    }

    // 2. Update AI Balance (Transaction + Wallet)
    // Get current balance to calculate diff (or just add 'adjustment' if we assumed the input WAS the adjustment... 
    // but the UI typically shows "Set Balance" or "Add Credits". Let's assume input is TARGET BALANCE for simplicity, 
    // or ADDITION? User said "credits relative to AI". Let's assume input is Current Desired Balance.)
    // Actually, setting absolute balance is easier for admin.
    
    const { data: currentWallet } = await supabase
        .from('noro_ai_wallets')
        .select('balance_cents')
        .eq('tenant_id', tenantId)
        .maybeSingle();
        
    const currentCents = currentWallet?.balance_cents || 0;
    const targetCents = Math.round(data.aiBalance * 100);
    const diffCents = targetCents - currentCents;

    if (diffCents !== 0) {
        await supabase
            .from('noro_ai_transactions')
            .insert({
                tenant_id: tenantId,
                amount_cents: diffCents,
                type: 'adjustment',
                description: 'Ajuste manual via Painel Administrativo',
                metadata: { admin_action: true }
            });
            // The trigger in SQL updates the wallet automatically
    }

    revalidatePath(`/tenants/${tenantId}/assinatura`);
    return { success: true };
}

export async function updateTenantSettings(tenantId: string, formData: FormData) {
    const supabase = getSupabaseServer();
    
    // Extract settings from formData
    const data = {
        moeda_padrao: formData.get('moeda_padrao'),
        fuso_horario: formData.get('fuso_horario'),
        idioma: formData.get('idioma'),
        formato_data: formData.get('formato_data'),
        logo_url_admin: formData.get('logo_url_admin'),
        topbar_color: formData.get('topbar_color'),
        // Ensure type is set to system
        tipo: 'sistema',
    };

    // Check if configuration record exists for this tenant
    const { data: existing } = await supabase
        .from('noro_configuracoes')
        .select('id')
        .eq('tenant_id', tenantId)
        .eq('tipo', 'sistema')
        .single();

    if (existing) {
        await supabase
            .from('noro_configuracoes')
            .update(data)
            .eq('id', existing.id);
    } else {
        // Create new if missing
        await supabase
            .from('noro_configuracoes')
            .insert({
                tenant_id: tenantId,
                ...data
            });
    }

    return { success: true };
}
