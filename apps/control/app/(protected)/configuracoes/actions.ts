// app/admin/(protected)/configuracoes/actions.ts
'use server';

import { createDatabaseClient } from "@noro/db";
import { revalidatePath } from "next/cache";

// --- Funções de Gestão de Utilizadores ---

export async function inviteUserAction(formData: FormData) {
  const email = formData.get('email') as string;
  const role = formData.get('role') as string;

  if (!email || !role) {
    return { success: false, message: 'E-mail e função são obrigatórios.' };
  }

  const { client, close } = createDatabaseClient();
  try {
    // Verificar se o usuário já existe
    const existing = await client`
      SELECT id FROM noro_auth.users_legado WHERE email = ${email}
    `;

    if (existing && existing.length > 0) {
      return { success: false, message: 'Este e-mail já está registado.' };
    }

    const nome = email.split('@')[0];
    await client`
      INSERT INTO noro_auth.users_legado (id, email, nome, role, created_at)
      VALUES (gen_random_uuid(), ${email}, ${nome}, ${role}, NOW())
    `;

    revalidatePath('/admin/configuracoes');
    return { success: true, message: `Convite enviado com sucesso para ${email}.` };
  } catch (error: any) {
    return { success: false, message: error.message };
  } finally {
    await close();
  }
}

export async function updateUserRoleAction(userId: string, newRole: string) {
  const { client, close } = createDatabaseClient();
  try {
    await client`
      UPDATE noro_auth.users_legado
      SET role = ${newRole}
      WHERE id = ${userId}
    `;

    revalidatePath('/admin/configuracoes');
    return { success: true, message: 'Função do utilizador atualizada.' };
  } catch (error: any) {
    return { success: false, message: error.message };
  } finally {
    await close();
  }
}

export async function updateNoroUserAction(userId: string, data: { nome: string | null; telefone: string | null; whatsapp: string | null; role: string }) {
  const { client, close } = createDatabaseClient();
  try {
    await client`
      UPDATE noro_auth.users_legado
      SET 
        nome = ${data.nome},
        telefone = ${data.telefone},
        whatsapp = ${data.whatsapp},
        role = ${data.role},
        updated_at = NOW()
      WHERE id = ${userId}
    `;

    revalidatePath('/admin/configuracoes');
    return { success: true, message: 'Utilizador atualizado com sucesso.' };
  } catch (error: any) {
    return { success: false, message: error.message };
  } finally {
    await close();
  }
}

export async function deleteUserAction(userId: string) {
  const { client, close } = createDatabaseClient();
  try {
    await client`
      DELETE FROM noro_auth.users_legado
      WHERE id = ${userId}
    `;

    revalidatePath('/admin/configuracoes');
    return { success: true, message: 'Utilizador removido com sucesso.' };
  } catch (error: any) {
    return { success: false, message: error.message };
  } finally {
    await close();
  }
}

// --- Funções de Gestão de Segredos (APIs) ---

export async function saveSecretAction(secretName: string, secretValue: string) {
  if (!secretName || !secretValue) {
    return { success: false, message: 'A chave não pode estar vazia.' };
  }

  const { client, close } = createDatabaseClient();
  try {
    // Executa a função do banco de dados diretamente
    await client`
      SELECT upsert_secret(${secretName}, ${secretValue})
    `;

    revalidatePath('/admin/configuracoes');
    return { success: true, message: `Chave guardada com sucesso!` };
  } catch (error: any) {
    console.error(`Erro ao guardar o segredo ${secretName}:`, error);
    return { success: false, message: `Falha ao guardar a chave: ${error.message}` };
  } finally {
    await close();
  }
}