// app/admin/(protected)/configuracoes/empresa-actions.ts
'use server';

import { getSupabaseAdmin } from "@/lib/supabase/admin";
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
  // Adicione outros campos aqui conforme for implementando a UI
};

// --- Buscar Dados da Empresa ---
export async function getEmpresaDados(): Promise<EmpresaDados> {
  const supabaseAdmin = getSupabaseAdmin();
  try {
    const { data, error } = await supabaseAdmin
      .from('noro_empresa')
      .select('*')
      .single(); // Usamos single() pois só haverá uma linha

    if (error) {
      // Se der erro 'PGRST116' (0 rows), significa que a linha padrão não foi criada, mas não quebramos a app
      if (error.code === 'PGRST116') {
        console.warn("Nenhuma linha encontrada em 'noro_empresa'. Retornando objeto vazio.");
        return { id: '' }; // Retorna um objeto vazio para não quebrar a UI
      }
      throw error;
    }
    
    return data || { id: '' };
  } catch (error: any) {
    console.error("Erro ao buscar dados da empresa:", error.message);
    return { id: '' }; // Retorna um objeto vazio em caso de erro
  }
}

// --- Atualizar Dados da Empresa ---
export async function updateEmpresaDados(formData: FormData) {
  const supabaseAdmin = getSupabaseAdmin();

  // Mapeia o FormData para o formato que o Supabase espera (com objetos JSONB)
  const updates = {
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
    }
  };

  try {
    // Como garantimos que sempre haverá uma linha, usamos update
    const { error } = await supabaseAdmin
      .from('noro_empresa')
      .update(updates)
      .eq('id', formData.get('empresa_id') as string); // Assume que o ID da empresa é passado no form

    if (error) throw error;

    revalidatePath('/admin/configuracoes');
    return { success: true, message: 'Dados da empresa atualizados com sucesso!' };

  } catch (error: any) {
    console.error("Erro ao atualizar dados da empresa:", error.message);
    return { success: false, message: `Erro: ${error.message}` };
  }
}