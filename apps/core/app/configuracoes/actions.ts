// app/admin/(protected)/configuracoes/actions.ts
'use server';

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// --- Funções de Gestão de Utilizadores ---

export async function inviteUserAction(formData: FormData) {
  const email = formData.get('email') as string;
  const role = formData.get('role') as string;

  if (!email || !role) {
    return { success: false, message: 'E-mail e função são obrigatórios.' };
  }

  try {
    const supabaseAdmin = createServerSupabaseClient();
    const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: { role: role }
    });

    if (error) {
      if (error.message.includes('User already registered')) {
        return { success: false, message: 'Este e-mail já está registado.' };
      }
      throw error;
    }

    revalidatePath('/admin/configuracoes');
    return { success: true, message: `Convite enviado com sucesso para ${email}.` };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateUserRoleAction(userId: string, newRole: string) {
  try {
    const supabaseAdmin = createServerSupabaseClient();
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: { role: newRole },
    });

    if (error) throw error;

    revalidatePath('/admin/configuracoes');
    return { success: true, message: 'Função do utilizador atualizada.' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteUserAction(userId: string) {
  try {
    const supabaseAdmin = createServerSupabaseClient();
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) throw error;

    revalidatePath('/admin/configuracoes');
    return { success: true, message: 'Utilizador removido com sucesso.' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// --- Funções de Gestão de Segredos (APIs) ---

export async function saveSecretAction(secretName: string, secretValue: string) {
  if (!secretName || !secretValue) {
    return { success: false, message: 'A chave não pode estar vazia.' };
  }

  try {
    const supabaseAdmin = createServerSupabaseClient();

    // CORREÇÃO: Chamando a função 'upsert_secret' que agora está no schema 'public'.
    // Como 'public' está no search_path padrão, não precisamos especificar 'public.upsert_secret'.
    const { error } = await supabaseAdmin.rpc('upsert_secret', {
      p_name: secretName,
      p_secret: secretValue,
    });

    if (error) throw error;
    
    revalidatePath('/admin/configuracoes');
    return { success: true, message: `Chave guardada com sucesso!` };
  } catch (error: any) {
    console.error(`Erro ao guardar o segredo ${secretName}:`, error);
    return { success: false, message: `Falha ao guardar a chave: ${error.message}` };
  }
}