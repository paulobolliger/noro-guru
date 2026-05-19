// app/admin/(protected)/configuracoes/empresa-actions.ts
'use server';

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getCurrentTenantId } from "@/lib/tenant-helper";
import { revalidatePath } from "next/cache";

// Tipo para os dados da empresa, baseado no seu SQL
export type EmpresaDados = {
  id: string;
  nome_empresa?: string | null;
  documento?: string | null;
  endereco?: { rua?: string; cidade?: string; estado?: string; cep?: string; pais?: string } | null;
  telefone_comercial?: string | null;
  email_principal?: string | null;
  website?: string | null;
  contato_principal?: { nome?: string; cargo?: string; telefone?: string; email?: string } | null;
  redes_sociais?: { facebook?: string; instagram?: string; linkedin?: string; whatsapp?: string } | null;
  modulos_contratados?: Record<string, boolean> | null;
};

// --- Buscar Dados da Empresa ---
export async function getEmpresaDados(): Promise<EmpresaDados> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { id: '' };

    const tenantId = await getCurrentTenantId(user.id);
    const supabaseAdmin = getSupabaseAdmin();

    const { data, error } = await supabaseAdmin
      .from('noro_empresa')
      .select('*')
      .eq('tenant_id', tenantId)
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    
    // Se não existir, retorna vazio (mas com tenantId implícito no contexto)
    return data || { id: '' };

  } catch (error: any) {
    console.error("Erro ao buscar dados da empresa:", error.message);
    return { id: '' };
  }
}

// --- Atualizar Dados da Empresa ---
export async function updateEmpresaDados(formData: FormData) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Usuário não autenticado");

    const tenantId = await getCurrentTenantId(user.id);
    const supabaseAdmin = getSupabaseAdmin();

    // Mapeia o FormData
    const updates = {
      tenant_id: tenantId, // Garante vinculo
      nome_empresa: formData.get('nome_empresa'),
      documento: formData.get('documento'),
      telefone_comercial: formData.get('telefone_comercial'),
      email_principal: formData.get('email_principal'),
      website: formData.get('website'),
      endereco: {
        rua: formData.get('endereco.rua'),
        cidade: formData.get('endereco.cidade'),
        estado: formData.get('endereco.estado'),
        cep: formData.get('endereco.cep'),
        pais: formData.get('endereco.pais'),
      },
      contato_principal: {
        nome: formData.get('contato.nome'),
        cargo: formData.get('contato.cargo'),
        email: formData.get('contato.email'),
      },
      redes_sociais: {
        instagram: formData.get('social.instagram'),
        facebook: formData.get('social.facebook'),
        linkedin: formData.get('social.linkedin'),
        whatsapp: formData.get('social.whatsapp'),
      },
      updated_at: new Date().toISOString()
    };
    
    // Tenta fazer o UPSERT baseado no tenant_id (assumindo que cada tenant tem 1 empresa)
    // Mas a tabela noro_empresa pode não ter constraint UNIQUE(tenant_id). 
    // Vamos verificar se já existe registro primeiro.
    
    const { data: existing } = await supabaseAdmin
        .from('noro_empresa')
        .select('id')
        .eq('tenant_id', tenantId)
        .maybeSingle();

    const existingRow = existing as { id?: string } | null;

    let error;
    
    if (existingRow?.id) {
        // Atualiza
      const { error: updateError } = await (supabaseAdmin as any)
            .from('noro_empresa')
            .update(updates)
        .eq('id', existingRow.id);
        error = updateError;
    } else {
        // Insere
      const { error: insertError } = await (supabaseAdmin as any)
            .from('noro_empresa')
            .insert(updates);
        error = insertError;
    }

    if (error) throw error;

    revalidatePath('/admin/configuracoes');
    return { success: true, message: 'Dados da empresa atualizados com sucesso!' };

  } catch (error: any) {
    console.error("Erro ao atualizar dados da empresa:", error.message);
    return { success: false, message: `Erro: ${error.message}` };
  }
}