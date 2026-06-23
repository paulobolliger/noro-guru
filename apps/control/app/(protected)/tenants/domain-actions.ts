'use server';

import { createDatabaseClient } from '@noro/db';
import { revalidatePath } from 'next/cache';
import { 
  createCustomHostname, 
  deleteCustomHostname, 
  getCustomHostname 
} from '@noro/lib/providers/cloudflare-provider';

export type Domain = {
    id: string;
    domain: string;
    status: 'pending' | 'active' | 'invalid';
    verified: boolean;
    created_at: string;
    cloudflare_id?: string | null;
    ownership_validation_name?: string | null;
    ownership_validation_value?: string | null;
    ssl_validation_name?: string | null;
    ssl_validation_value?: string | null;
};

export async function getTenantDomains(tenantId: string): Promise<Domain[]> {
    const { client, close } = createDatabaseClient();
    try {
        const data = await client`
            SELECT 
                id, 
                domain, 
                status, 
                verified, 
                created_at,
                cloudflare_id,
                ownership_validation_name,
                ownership_validation_value,
                ssl_validation_name,
                ssl_validation_value
            FROM sites.domains
            WHERE tenant_id = ${tenantId}
            ORDER BY created_at DESC
        `;
        return (data || []) as any[];
    } catch (err) {
        console.error('[getTenantDomains] Exception:', err);
        return [];
    } finally {
        await close();
    }
}

export async function addDomain(tenantId: string, domain: string) {
    // Basic validation
    const cleanDomain = domain.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    if (!cleanDomain.match(/^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}$/)) {
        return { success: false, error: 'Formato de domínio inválido.' };
    }

    const { client, close } = createDatabaseClient();
    try {
        // 1. Register with Cloudflare first
        const cfHostname = await createCustomHostname(cleanDomain);

        // 2. Insert into database with Cloudflare credentials and validation details
        await client`
            INSERT INTO sites.domains (
                tenant_id, 
                domain, 
                status, 
                verified,
                cloudflare_id,
                ownership_validation_name,
                ownership_validation_value,
                ssl_validation_name,
                ssl_validation_value
            )
            VALUES (
                ${tenantId}, 
                ${cleanDomain}, 
                'pending', 
                false,
                ${cfHostname.id},
                ${cfHostname.ownershipValidationName || null},
                ${cfHostname.ownershipValidationValue || null},
                ${cfHostname.sslValidationName || null},
                ${cfHostname.sslValidationValue || null}
            )
        `;
        revalidatePath(`/tenants/${tenantId}/dominios`);
        return { success: true };
    } catch (error: any) {
        console.error('[addDomain] Exception:', error);
        if (error.code === '23505') { // Unique violation
            return { success: false, error: 'Este domínio já está cadastrado.' };
        }
        return { success: false, error: error.message || String(error) };
    } finally {
        await close();
    }
}

export async function verifyDomain(domainId: string, tenantId: string) {
    const { client, close } = createDatabaseClient();
    try {
        const rows = await client`
            SELECT cloudflare_id, domain 
            FROM sites.domains
            WHERE id = ${domainId} AND tenant_id = ${tenantId}
            LIMIT 1
        `;

        if (!rows || rows.length === 0) {
            return { success: false, error: 'Domínio não encontrado.' };
        }

        const { cloudflare_id, domain } = rows[0];

        if (!cloudflare_id) {
            return { success: false, error: 'Domínio não está registrado no Cloudflare.' };
        }

        // Query Cloudflare for real-time status
        const cfHostname = await getCustomHostname(cloudflare_id);

        if (cfHostname.status === 'active') {
            await client`
                UPDATE sites.domains
                SET verified = true, status = 'active'
                WHERE id = ${domainId}
            `;
            revalidatePath(`/tenants/${tenantId}/dominios`);
            return { success: true, status: 'active' };
        } else {
            // Update validation records if they changed
            await client`
                UPDATE sites.domains
                SET 
                    ownership_validation_name = ${cfHostname.ownershipValidationName || null},
                    ownership_validation_value = ${cfHostname.ownershipValidationValue || null},
                    ssl_validation_name = ${cfHostname.sslValidationName || null},
                    ssl_validation_value = ${cfHostname.sslValidationValue || null}
                WHERE id = ${domainId}
            `;
            revalidatePath(`/tenants/${tenantId}/dominios`);
            return { 
                success: true, 
                status: cfHostname.status,
                sslStatus: cfHostname.sslStatus,
                message: 'Aguardando propagação DNS para validação de propriedade e SSL.' 
            };
        }
    } catch (error: any) {
        console.error('[verifyDomain] Exception:', error);
        return { success: false, error: error.message || String(error) };
    } finally {
        await close();
    }
}

export async function deleteDomain(domainId: string, tenantId: string) {
    const { client, close } = createDatabaseClient();
    try {
        const rows = await client`
            SELECT cloudflare_id 
            FROM sites.domains
            WHERE id = ${domainId} AND tenant_id = ${tenantId}
            LIMIT 1
        `;

        if (rows && rows.length > 0 && rows[0].cloudflare_id) {
            try {
                await deleteCustomHostname(rows[0].cloudflare_id);
            } catch (cfErr) {
                console.error('[deleteDomain] Failed to delete from Cloudflare:', cfErr);
            }
        }

        await client`
            DELETE FROM sites.domains
            WHERE id = ${domainId}
        `;
        revalidatePath(`/tenants/${tenantId}/dominios`);
        return { success: true };
    } catch (error: any) {
        console.error('[deleteDomain] Exception:', error);
        return { success: false, error: error.message || String(error) };
    } finally {
        await close();
    }
}

