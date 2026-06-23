// app/admin/(protected)/clientes/actions.ts
'use server';

import { createDatabaseClient } from '@noro/db';
import { revalidatePath } from 'next/cache';

// ============================================================================
// BUSCAR TODOS OS CLIENTES
// ============================================================================

export async function getClientes() {
  const { client, close } = createDatabaseClient();
  try {
    const data = await client`
      SELECT 
        id,
        nome,
        email,
        telefone,
        whatsapp,
        status,
        tipo,
        segmento,
        nivel,
        total_viagens,
        total_gasto,
        ticket_medio,
        data_ultimo_contato,
        created_at,
        updated_at
      FROM crm.clients
      WHERE deleted_at IS NULL
      ORDER BY updated_at DESC
    `;
    return (data || []) as any;
  } catch (error: any) {
    console.error('Erro ao buscar clientes:', error);
    return [];
  } finally {
    await close();
  }
}

// ============================================================================
// BUSCAR CLIENTE POR ID
// ============================================================================

export async function getClienteById(clienteId: string) {
  const { client, close } = createDatabaseClient();
  try {
    const [data] = await client`
      SELECT 
        id,
        nome,
        email,
        telefone,
        whatsapp,
        status,
        tipo,
        segmento,
        nivel,
        total_viagens,
        total_gasto,
        ticket_medio,
        data_ultimo_contato,
        created_at,
        updated_at,
        moeda_preferida,
        cpf,
        passaporte,
        data_nascimento,
        nacionalidade,
        profissao,
        cnpj,
        razao_social,
        nome_fantasia,
        inscricao_estadual,
        responsavel_nome,
        responsavel_cargo
      FROM crm.clients
      WHERE id = ${clienteId} AND deleted_at IS NULL
      LIMIT 1
    `;
    return data || null;
  } catch (error: any) {
    console.error('Erro ao buscar cliente:', error);
    return null;
  } finally {
    await close();
  }
}

// ============================================================================
// CRIAR NOVO CLIENTE
// ============================================================================

export async function createClienteAction(formData: FormData) {
  // Dados de Contato e Classificação (Comuns)
  const nome = formData.get('nome') as string;
  const email = formData.get('email') as string;
  const telefone = formData.get('telefone') as string;
  const whatsapp = formData.get('whatsapp') as string;
  const tipo = formData.get('tipo') as string; // pessoa_fisica ou pessoa_juridica
  const status = formData.get('status') as string;
  const nivel = formData.get('nivel') as string;
  const segmento = formData.get('segmento') as string;
  const idioma_preferido = formData.get('idioma_preferido') as string;
  const moeda_preferida = formData.get('moeda_preferida') as string;
  const observacoes = formData.get('observacoes') as string;
  
  // Campos para Pessoa Física
  const cpf = formData.get('cpf') as string;
  const passaporte = formData.get('passaporte') as string;
  const data_nascimento = formData.get('data_nascimento') as string;
  const nacionalidade = formData.get('nacionalidade') as string;
  const profissao = formData.get('profissao') as string;
  
  // Campos para Pessoa Jurídica
  const cnpj = formData.get('cnpj') as string;
  const razao_social = formData.get('razao_social') as string;
  const nome_fantasia = formData.get('nome_fantasia') as string;
  const inscricao_estadual = formData.get('inscricao_estadual') as string;
  const responsavel_nome = formData.get('responsavel_nome') as string;
  const responsavel_cargo = formData.get('responsavel_cargo') as string;

  if (!nome || !email) {
    return { success: false, message: 'Nome e e-mail são obrigatórios.' };
  }

  if (!tipo) {
    return { success: false, message: 'Tipo de cliente (PF/PJ) é obrigatório.' };
  }

  const { client, close } = createDatabaseClient();
  try {
    const isPf = tipo === 'pessoa_fisica';
    const insertData = {
      nome,
      email,
      telefone: telefone || null,
      whatsapp: whatsapp || null,
      tipo,
      status: status || 'ativo',
      nivel: nivel || 'bronze',
      segmento: segmento || null,
      idioma_preferido: idioma_preferido || 'pt',
      moeda_preferida: moeda_preferida || 'EUR',
      
      // Pessoa Física
      cpf: isPf ? (cpf || null) : null,
      passaporte: isPf ? (passaporte || null) : null,
      data_nascimento: isPf ? (data_nascimento || null) : null,
      nacionalidade: isPf ? (nacionalidade || null) : null,
      profissao: isPf ? (profissao || null) : null,
      
      // Pessoa Jurídica
      cnpj: !isPf ? (cnpj || null) : null,
      razao_social: !isPf ? (razao_social || null) : null,
      nome_fantasia: !isPf ? (nome_fantasia || null) : null,
      inscricao_estadual: !isPf ? (inscricao_estadual || null) : null,
      responsavel_nome: !isPf ? (responsavel_nome || null) : null,
      responsavel_cargo: !isPf ? (responsavel_cargo || null) : null,
      
      observacoes: observacoes || null,
      data_primeiro_contato: new Date().toISOString(),
    };

    const [data] = await client`
      INSERT INTO crm.clients (
        nome, email, telefone, whatsapp, tipo, status, nivel, segmento, idioma_preferido, moeda_preferida,
        cpf, passaporte, data_nascimento, nacionalidade, profissao,
        cnpj, razao_social, nome_fantasia, inscricao_estadual, responsavel_nome, responsavel_cargo,
        observacoes, data_primeiro_contato
      ) VALUES (
        ${insertData.nome}, ${insertData.email}, ${insertData.telefone}, ${insertData.whatsapp},
        ${insertData.tipo}, ${insertData.status}, ${insertData.nivel}, ${insertData.segmento},
        ${insertData.idioma_preferido}, ${insertData.moeda_preferida},
        ${insertData.cpf}, ${insertData.passaporte}, ${insertData.data_nascimento},
        ${insertData.nacionalidade}, ${insertData.profissao},
        ${insertData.cnpj}, ${insertData.razao_social}, ${insertData.nome_fantasia},
        ${insertData.inscricao_estadual}, ${insertData.responsavel_nome}, ${insertData.responsavel_cargo},
        ${insertData.observacoes}, ${insertData.data_primeiro_contato}
      )
      RETURNING *
    `;

    revalidatePath('/admin/clientes');
    return { success: true, message: 'Cliente adicionado com sucesso!', data };
  } catch (error: any) {
    console.error('Erro ao criar cliente:', error);
    return { success: false, message: `Erro: ${error.message}` };
  } finally {
    await close();
  }
}

// ============================================================================
// ATUALIZAR CLIENTE
// ============================================================================

export async function updateClienteAction(clienteId: string, formData: FormData) {
  if (!clienteId) {
    return { success: false, message: 'ID do cliente não fornecido.' };
  }

  const nome = formData.get('nome') as string;
  const email = formData.get('email') as string;
  const telefone = formData.get('telefone') as string;
  const whatsapp = formData.get('whatsapp') as string;
  const status = formData.get('status') as string;
  const observacoes = formData.get('observacoes') as string;

  const { client, close } = createDatabaseClient();
  try {
    const updates = {
      nome,
      email,
      telefone: telefone || null,
      whatsapp: whatsapp || null,
      status: status || 'ativo',
      observacoes: observacoes || null,
      updated_at: new Date().toISOString(),
    };

    await client`
      UPDATE crm.clients
      SET
        nome = ${updates.nome},
        email = ${updates.email},
        telefone = ${updates.telefone},
        whatsapp = ${updates.whatsapp},
        status = ${updates.status},
        observacoes = ${updates.observacoes},
        updated_at = ${updates.updated_at}
      WHERE id = ${clienteId}
    `;

    revalidatePath('/admin/clientes');
    return { success: true, message: 'Cliente atualizado com sucesso!' };
  } catch (error: any) {
    console.error('Erro ao atualizar cliente:', error);
    return { success: false, message: `Erro: ${error.message}` };
  } finally {
    await close();
  }
}

// ============================================================================
// DELETAR CLIENTE (SOFT DELETE)
// ============================================================================

export async function deleteClienteAction(clienteId: string) {
  if (!clienteId) {
    return { success: false, message: 'ID do cliente não fornecido.' };
  }

  const { client, close } = createDatabaseClient();
  try {
    await client`
      UPDATE crm.clients
      SET 
        deleted_at = ${new Date().toISOString()},
        status = 'inativo'
      WHERE id = ${clienteId}
    `;

    revalidatePath('/admin/clientes');
    return { success: true, message: 'Cliente removido com sucesso!' };
  } catch (error: any) {
    console.error('Erro ao deletar cliente:', error);
    return { success: false, message: `Erro: ${error.message}` };
  } finally {
    await close();
  }
}

// ============================================================================
// ESTATÍSTICAS
// ============================================================================

export async function getClientesStats() {
  const { client, close } = createDatabaseClient();
  try {
    const data = await client`
      SELECT status, tipo, nivel
      FROM crm.clients
      WHERE deleted_at IS NULL
    `;

    const stats = {
      total: data?.length || 0,
      ativos: data?.filter(c => c.status === 'ativo').length || 0,
      vip: data?.filter(c => c.status === 'vip').length || 0,
      pessoa_fisica: data?.filter(c => c.tipo === 'pessoa_fisica').length || 0,
      pessoa_juridica: data?.filter(c => c.tipo === 'pessoa_juridica').length || 0,
    };

    return stats;
  } catch (error: any) {
    console.error('Erro ao buscar estatísticas:', error);
    return {
      total: 0,
      ativos: 0,
      vip: 0,
      pessoa_fisica: 0,
      pessoa_juridica: 0,
    };
  } finally {
    await close();
  }
}