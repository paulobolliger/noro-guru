// app/admin/(protected)/configuracoes/empresa-actions.ts
'use server';

import { createDatabaseClient } from "@noro/db";
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
};

// --- Buscar Dados da Empresa ---
export async function getEmpresaDados(): Promise<EmpresaDados> {
  const { client, close } = createDatabaseClient();
  try {
    const rows = await client`
      SELECT * 
      FROM sites.empresa
      LIMIT 1
    `;

    if (!rows || rows.length === 0) {
      console.warn("Nenhuma linha encontrada em 'noro_empresa'. Retornando objeto vazio.");
      return { id: '' }; // Retorna um objeto vazio para não quebrar a UI
    }
    
    return rows[0] as unknown as EmpresaDados;
  } catch (error: any) {
    console.error("Erro ao buscar dados da empresa:", error.message);
    return { id: '' }; // Retorna um objeto vazio em caso de erro
  } finally {
    await close();
  }
}

// --- Atualizar Dados da Empresa ---
export async function updateEmpresaDados(formData: FormData) {
  const { client, close } = createDatabaseClient();

  const updates = {
    nome_empresa: formData.get('nome_empresa') as string | null,
    documento: formData.get('documento') as string | null,
    telefone_comercial: formData.get('telefone_comercial') as string | null,
    email_principal: formData.get('email_principal') as string | null,
    website: formData.get('website') as string | null,
    endereco: JSON.stringify({
      rua: formData.get('endereco.rua'),
      cidade: formData.get('endereco.cidade'),
      estado: formData.get('endereco.estado'),
      cep: formData.get('endereco.cep'),
      pais: formData.get('endereco.pais'),
    }),
    contato_principal: JSON.stringify({
      nome: formData.get('contato.nome'),
      cargo: formData.get('contato.cargo'),
      email: formData.get('contato.email'),
    }),
    redes_sociais: JSON.stringify({
      instagram: formData.get('social.instagram'),
      facebook: formData.get('social.facebook'),
      linkedin: formData.get('social.linkedin'),
      whatsapp: formData.get('social.whatsapp'),
    })
  };

  const id = formData.get('empresa_id') as string;

  try {
    await client`
      UPDATE sites.empresa
      SET 
        nome_empresa = ${updates.nome_empresa},
        documento = ${updates.documento},
        telefone_comercial = ${updates.telefone_comercial},
        email_principal = ${updates.email_principal},
        website = ${updates.website},
        endereco = ${updates.endereco}::jsonb,
        contato_principal = ${updates.contato_principal}::jsonb,
        redes_sociais = ${updates.redes_sociais}::jsonb
      WHERE id = ${id}
    `;

    revalidatePath('/admin/configuracoes');
    return { success: true, message: 'Dados da empresa atualizados com sucesso!' };

  } catch (error: any) {
    console.error("Erro ao atualizar dados da empresa:", error.message);
    return { success: false, message: `Erro: ${error.message}` };
  } finally {
    await close();
  }
}