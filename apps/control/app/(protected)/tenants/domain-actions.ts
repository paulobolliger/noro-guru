'use server';

import { getSupabaseServer } from '@/lib/supabaseServer';
import { revalidatePath } from 'next/cache';

export type Domain = {
    id: string;
    domain: string;
    status: 'pending' | 'active' | 'invalid';
    verified: boolean;
    created_at: string;
};

export async function getTenantDomains(tenantId: string): Promise<Domain[]> {
    const supabase = getSupabaseServer();
    const { data } = await supabase
        .from('noro_domains')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });
    
    return data || [];
}

export async function addDomain(tenantId: string, domain: string) {
    const supabase = getSupabaseServer();
    
    // Basic validation
    const cleanDomain = domain.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    if (!cleanDomain.match(/^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}$/)) {
        return { success: false, error: 'Formato de domínio inválido.' };
    }

    const { error } = await supabase
        .from('noro_domains')
        .insert({
            tenant_id: tenantId,
            domain: cleanDomain,
            status: 'pending',
            verified: false
        });

    if (error) {
        if (error.code === '23505') { // Unique violation
            return { success: false, error: 'Este domínio já está cadastrado.' };
        }
        return { success: false, error: error.message };
    }

    revalidatePath(`/tenants/${tenantId}/dominios`);
    return { success: true };
}

export async function verifyDomain(domainId: string, tenantId: string) {
    const supabase = getSupabaseServer();
    
    // In a real scenario, we would check DNS records here.
    // For now, we manually approve/verify.
    
    const { error } = await supabase
        .from('noro_domains')
        .update({ verified: true, status: 'active' })
        .eq('id', domainId);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath(`/tenants/${tenantId}/dominios`);
    return { success: true };
}

export async function deleteDomain(domainId: string, tenantId: string) {
    const supabase = getSupabaseServer();
    
    const { error } = await supabase
        .from('noro_domains')
        .delete()
        .eq('id', domainId);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath(`/tenants/${tenantId}/dominios`);
    return { success: true };
}
