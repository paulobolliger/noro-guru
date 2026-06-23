'use server';

import { createDatabaseClient } from '@noro/db';
import { notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createHash } from 'crypto';

export type TenantContext = {
    tenant: {
        id: string;
        name: string;
        slug: string;
        status?: string;
    };
    empresa?: {
        id: string;
        tenant_id: string;
        nome_empresa: string | null;
        razao_social: string | null;
        documento: string | null;
        inscricao_estadual: string | null;
        inscricao_municipal: string | null;
        email_principal?: string | null;
        telefone_comercial: string | null;
        website: string | null;
        endereco_sede: any;
        endereco_cobranca: any;
        representante_legal: any;
        contatos: any;
        dados_bancarios: any;
        documentos: any;
        logo_url: string | null;
        limites?: {
            email_monthly_quota?: number;
            email_used?: number;
            max_users?: number;
        } | null;
        modulos_contratados?: Record<string, boolean> | null;
    };
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

async function uploadToCloudinary(file: File, folder: string): Promise<string | null> {
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!apiKey || !apiSecret || !cloudName) {
        console.warn('Cloudinary credentials missing. Skipping logo upload.');
        return null;
    }

    try {
        const timestamp = Math.floor(Date.now() / 1000);
        const toSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
        const signature = createHash('sha1').update(toSign).digest('hex');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);
        formData.append('timestamp', timestamp.toString());
        formData.append('api_key', apiKey);
        formData.append('signature', signature);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errBody = await response.text();
            console.error('Cloudinary upload error response:', errBody);
            return null;
        }

        const data = await response.json();
        return data.secure_url || data.url || null;
    } catch (err) {
        console.error('Error uploading to Cloudinary:', err);
        return null;
    }
}

export async function inviteTenantUser(tenantId: string, email: string, role: string) {
    const { client, close } = createDatabaseClient();
    try {
        const { empresa } = await getTenantContext(tenantId);
        const maxUsers = empresa?.limites?.max_users || 1;

        const [countRow] = await client`
            SELECT COUNT(*)::int as count
            FROM platform.user_tenant_roles
            WHERE tenant_id = ${tenantId}
        `;
        const count = countRow?.count || 0;

        if (count >= maxUsers) {
            return { success: false, error: `Limite de usuários atingido (${maxUsers}). Faça um upgrade para adicionar mais.` };
        }

        // Convite simulado (Logto resolveria isso no futuro)
        return { success: true, message: 'Convite enviado (Simulado)' };
    } catch (err: any) {
        console.error('[inviteTenantUser] Exception:', err);
        return { success: false, error: err.message || 'Erro ao convidar usuário' };
    } finally {
        await close();
    }
}

export async function updateTenantMaxUsers(tenantId: string, newLimit: number) {
    const { client, close } = createDatabaseClient();
    try {
        const [existingCompany] = await client`
            SELECT id, limites
            FROM sites.empresa
            WHERE tenant_id = ${tenantId}
            LIMIT 1
        `;

        if (!existingCompany) return { success: false, error: 'Empresa não encontrada' };

        const newLimites = {
            ...(existingCompany.limites || {}),
            max_users: newLimit
        };

        await client`
            UPDATE sites.empresa
            SET limites = ${newLimites}
            WHERE id = ${existingCompany.id}
        `;

        revalidatePath(`/tenants/${tenantId}/usuarios`);
        return { success: true };
    } catch (err: any) {
        console.error('[updateTenantMaxUsers] Exception:', err);
        return { success: false, error: err.message || 'Erro ao atualizar limite de usuários' };
    } finally {
        await close();
    }
}

export async function getTenantContext(tenantId: string): Promise<TenantContext> {
    const { client, close } = createDatabaseClient();
    try {
        // 1. Fetch Tenant Base Info
        const [tenant] = await client`
            SELECT id, name, slug, status
            FROM platform.tenants
            WHERE id = ${tenantId}
            LIMIT 1
        `;

        if (!tenant) {
            notFound();
        }

        // 2. Fetch Company Data
        const [empresa] = await client`
            SELECT *
            FROM sites.empresa
            WHERE tenant_id = ${tenantId}
            LIMIT 1
        `;

        // 3. Fetch System Settings
        const [config] = await client`
            SELECT id, moeda_padrao, fuso_horario, idioma, formato_data, logo_url_admin, topbar_color
            FROM sites.configuracoes
            WHERE tenant_id = ${tenantId} AND tipo = 'sistema'
            LIMIT 1
        `;

        // 4. Fetch Users
        const userRoles = await client`
            SELECT utr.role, u.id, u.email, u.nome
            FROM platform.user_tenant_roles utr
            JOIN platform.users u ON u.id = utr.user_id
            WHERE utr.tenant_id = ${tenantId}
        `;

        const users = userRoles.map((r: any) => ({
            id: r.id,
            email: r.email,
            nome: r.nome,
            role: r.role
        }));

        return {
            tenant: {
                id: tenant.id,
                name: tenant.name,
                slug: tenant.slug,
                status: tenant.status
            },
            empresa: empresa ? {
                id: empresa.id,
                tenant_id: empresa.tenant_id,
                nome_empresa: empresa.nome_empresa,
                razao_social: empresa.razao_social,
                documento: empresa.documento,
                inscricao_estadual: empresa.inscricao_estadual,
                inscricao_municipal: empresa.inscricao_municipal,
                email_principal: empresa.email_principal,
                telefone_comercial: empresa.telefone_comercial,
                website: empresa.website,
                endereco_sede: empresa.endereco_sede,
                endereco_cobranca: empresa.endereco_cobranca,
                representante_legal: empresa.representante_legal,
                contatos: empresa.contatos,
                dados_bancarios: empresa.dados_bancarios,
                documentos: empresa.documentos,
                logo_url: empresa.logo_url,
                limites: empresa.limites,
                modulos_contratados: empresa.modulos_contratados,
            } : undefined,
            configuracoes: config ? {
                id: config.id,
                moeda_padrao: config.moeda_padrao,
                fuso_horario: config.fuso_horario,
                idioma: config.idioma,
                formato_data: config.formato_data,
                logo_url_admin: config.logo_url_admin || '',
                topbar_color: config.topbar_color || '',
            } : undefined,
            users: users,
            stats: {
                usersCount: users.length
            }
        };
    } catch (err) {
        console.error('[getTenantContext] Exception:', err);
        notFound();
    } finally {
        await close();
    }
}

export async function getTenantAiBalance(tenantId: string) {
    const { client, close } = createDatabaseClient();
    try {
        const [data] = await client`
            SELECT balance_cents
            FROM public.noro_ai_wallets
            WHERE tenant_id = ${tenantId}
            LIMIT 1
        `;
        return (data?.balance_cents || 0) / 100;
    } catch (err) {
        console.error('[getTenantAiBalance] Exception:', err);
        return 0;
    } finally {
        await close();
    }
}

export async function updateTenantCompany(tenantId: string, formData: FormData) {
    const { client, close } = createDatabaseClient();
    try {
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

        // Check if record exists
        const [existingRecord] = await client`
            SELECT id, documentos, logo_url
            FROM sites.empresa
            WHERE tenant_id = ${tenantId}
            LIMIT 1
        `;

        const getDocData = (key: string, file: File | null) => {
            const existingDoc = existingRecord?.documentos?.[key];
            if (file && file.size > 0) {
                return {
                    nome: file.name,
                    url: null,
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

        // Logo upload para Cloudinary
        const logoFile = formData.get('logo_file') as File;
        let logo_url = existingRecord?.logo_url || null;
        if (logoFile && logoFile.size > 0) {
            const uploadedUrl = await uploadToCloudinary(logoFile, `tenants/${tenantId}`);
            if (uploadedUrl) {
                logo_url = uploadedUrl;
            }
        }

        const data = {
            nome_empresa: formData.get('nome_empresa') ? String(formData.get('nome_empresa')) : null,
            razao_social: formData.get('razao_social') ? String(formData.get('razao_social')) : null,
            documento: formData.get('documento') ? String(formData.get('documento')) : null,
            inscricao_estadual: formData.get('inscricao_estadual') ? String(formData.get('inscricao_estadual')) : null,
            inscricao_municipal: formData.get('inscricao_municipal') ? String(formData.get('inscricao_municipal')) : null,
            email_principal: formData.get('email_principal') ? String(formData.get('email_principal')) : null,
            telefone_comercial: formData.get('telefone_comercial') ? String(formData.get('telefone_comercial')) : null,
            website: formData.get('website') ? String(formData.get('website')) : null,
            endereco_sede,
            endereco_cobranca,
            representante_legal,
            contatos,
            dados_bancarios,
            documentos,
            logo_url,
        };

        if (existingRecord) {
            await client`
                UPDATE sites.empresa
                SET
                    nome_empresa = ${data.nome_empresa},
                    razao_social = ${data.razao_social},
                    documento = ${data.documento},
                    inscricao_estadual = ${data.inscricao_estadual},
                    inscricao_municipal = ${data.inscricao_municipal},
                    email_principal = ${data.email_principal},
                    telefone_comercial = ${data.telefone_comercial},
                    website = ${data.website},
                    endereco_sede = ${client.json(data.endereco_sede as any)},
                    endereco_cobranca = ${client.json(data.endereco_cobranca as any)},
                    representante_legal = ${client.json(data.representante_legal as any)},
                    contatos = ${client.json(data.contatos as any)},
                    dados_bancarios = ${client.json(data.dados_bancarios as any)},
                    documentos = ${client.json(data.documentos as any)},
                    logo_url = ${data.logo_url}
                WHERE id = ${existingRecord.id}
            `;
        } else {
            await client`
                INSERT INTO sites.empresa (
                    tenant_id, nome_empresa, razao_social, documento, inscricao_estadual, inscricao_municipal,
                    email_principal, telefone_comercial, website, endereco_sede, endereco_cobranca,
                    representante_legal, contatos, dados_bancarios, documentos, logo_url
                ) VALUES (
                    ${tenantId}, ${data.nome_empresa}, ${data.razao_social}, ${data.documento}, ${data.inscricao_estadual}, ${data.inscricao_municipal},
                    ${data.email_principal}, ${data.telefone_comercial}, ${data.website}, ${client.json(data.endereco_sede as any)}, ${client.json(data.endereco_cobranca as any)},
                    ${client.json(data.representante_legal as any)}, ${client.json(data.contatos as any)}, ${client.json(data.dados_bancarios as any)}, ${client.json(data.documentos as any)}, ${data.logo_url}
                )
            `;
        }

        return { success: true };
    } catch (err: any) {
        console.error('[updateTenantCompany] Exception:', err);
        return { success: false, error: err.message || 'Erro ao salvar empresa' };
    } finally {
        await close();
    }
}

export async function updateTenantModules(tenantId: string, modulos: any) {
    const { client, close } = createDatabaseClient();
    try {
        const [existing] = await client`
            SELECT id
            FROM sites.empresa
            WHERE tenant_id = ${tenantId}
            LIMIT 1
        `;

        if (existing) {
            await client`
                UPDATE sites.empresa
                SET modulos_contratados = ${modulos}
                WHERE id = ${existing.id}
            `;
        } else {
            await client`
                INSERT INTO sites.empresa (
                    tenant_id, modulos_contratados, nome_empresa
                ) VALUES (
                    ${tenantId}, ${modulos}, 'Nova Empresa'
                )
            `;
        }

        revalidatePath(`/tenants/${tenantId}/assinatura`);
        return { success: true };
    } catch (err: any) {
        console.error('[updateTenantModules] Exception:', err);
        return { success: false, error: err.message || 'Erro ao atualizar módulos' };
    } finally {
        await close();
    }
}

export async function updateTenantCredits(tenantId: string, data: { aiBalance: number, emailLimit: number }) {
    const { client, close } = createDatabaseClient();
    try {
        const [existingCompany] = await client`
            SELECT id, limites
            FROM sites.empresa
            WHERE tenant_id = ${tenantId}
            LIMIT 1
        `;

        const newLimites = {
            ...(existingCompany?.limites || {}),
            email_monthly_quota: data.emailLimit
        };

        if (existingCompany) {
            await client`
                UPDATE sites.empresa
                SET limites = ${newLimites}
                WHERE id = ${existingCompany.id}
            `;
        } else {
            await client`
                INSERT INTO sites.empresa (tenant_id, limites, nome_empresa)
                VALUES (${tenantId}, ${newLimites}, 'Nova Empresa')
            `;
        }

        // Update AI Balance (Transaction + Wallet)
        const [currentWallet] = await client`
            SELECT balance_cents
            FROM public.noro_ai_wallets
            WHERE tenant_id = ${tenantId}
            LIMIT 1
        `;

        const currentCents = currentWallet?.balance_cents || 0;
        const targetCents = Math.round(data.aiBalance * 100);
        const diffCents = targetCents - currentCents;

        if (diffCents !== 0) {
            await client`
                INSERT INTO public.noro_ai_transactions (
                    tenant_id, amount_cents, type, description, metadata
                ) VALUES (
                    ${tenantId}, ${diffCents}, 'adjustment', 'Ajuste manual via Painel Administrativo', ${JSON.stringify({ admin_action: true })}
                )
            `;
        }

        revalidatePath(`/tenants/${tenantId}/assinatura`);
        return { success: true };
    } catch (err: any) {
        console.error('[updateTenantCredits] Exception:', err);
        return { success: false, error: err.message || 'Erro ao atualizar créditos' };
    } finally {
        await close();
    }
}

export async function updateTenantSettings(tenantId: string, formData: FormData) {
    const { client, close } = createDatabaseClient();
    try {
        const data = {
            moeda_padrao: String(formData.get('moeda_padrao') || 'BRL'),
            fuso_horario: String(formData.get('fuso_horario') || 'America/Sao_Paulo'),
            idioma: String(formData.get('idioma') || 'pt-BR'),
            formato_data: String(formData.get('formato_data') || 'DD/MM/YYYY'),
            logo_url_admin: String(formData.get('logo_url_admin') || ''),
            topbar_color: String(formData.get('topbar_color') || '#000000'),
            tipo: 'sistema',
        };

        const [existing] = await client`
            SELECT id
            FROM sites.configuracoes
            WHERE tenant_id = ${tenantId} AND tipo = 'sistema'
            LIMIT 1
        `;

        if (existing) {
            await client`
                UPDATE sites.configuracoes
                SET
                    moeda_padrao = ${data.moeda_padrao},
                    fuso_horario = ${data.fuso_horario},
                    idioma = ${data.idioma},
                    formato_data = ${data.formato_data},
                    logo_url_admin = ${data.logo_url_admin},
                    topbar_color = ${data.topbar_color}
                WHERE id = ${existing.id}
            `;
        } else {
            await client`
                INSERT INTO sites.configuracoes (
                    tenant_id, moeda_padrao, fuso_horario, idioma, formato_data, logo_url_admin, topbar_color, tipo
                ) VALUES (
                    ${tenantId}, ${data.moeda_padrao}, ${data.fuso_horario}, ${data.idioma}, ${data.formato_data}, ${data.logo_url_admin}, ${data.topbar_color}, 'sistema'
                )
            `;
        }

        return { success: true };
    } catch (err: any) {
        console.error('[updateTenantSettings] Exception:', err);
        return { success: false, error: err.message || 'Erro ao atualizar configurações' };
    } finally {
        await close();
    }
}
