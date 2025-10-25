'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { getTenantFromHeaders, getTenantSchemaClient } from '@/lib/tenant';

// ============================================================================
// BUSCAR TODOS OS CLIENTES
// ============================================================================

export async function getClientes() {
  try {
    const tenant = await getTenantFromHeaders();
    if (!tenant) {
      console.error('Tenant não resolvido em getClientes');
      return [];
    }
    const supabase = getTenantSchemaClient(tenant.schema_name);
    
    const { data, error } = await supabase
      .from('noro_clientes')
      .select(`
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
      `)
      .is('deleted_at', null)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar clientes:', error);
      return [];
    }

    return data || [];
  } catch (error: any) {
    console.error('Erro ao buscar clientes:', error);
    return [];
  }
}

// ============================================================================
// BUSCAR CLIENTE POR ID
// ============================================================================

export async function getClienteById(clienteId: string) {
  try {
    const tenant = await getTenantFromHeaders();
    if (!tenant) return null;
    const supabase = getTenantSchemaClient(tenant.schema_name);
    
    const { data, error } = await supabase
      .from('noro_clientes')
      .select(`
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
      `)
      .eq('id', clienteId)
      .is('deleted_at', null)
      .single();

    if (error) throw error; // Lança o erro para o bloco catch
    return data; // Retorna os dados do cliente diretamente
  } catch (error: any) {
    console.error('Erro ao buscar cliente:', error);
    return null; // Retorna null em caso de erro
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
  const passaporte = formData.get('passaporte') as string; // CORRIGIDO: Adicionado campo Passaporte
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

  try {
    const tenant = await getTenantFromHeaders();
    if (!tenant) {
      return { success: false, message: 'Tenant não resolvido.' };
    }
    const supabase = getTenantSchemaClient(tenant.schema_name);
    
    const novoCliente = {
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
      ...(tipo === 'pessoa_fisica' && {
        cpf: cpf || null,
        passaporte: passaporte || null, // CORRIGIDO: Adicionado campo Passaporte
        data_nascimento: data_nascimento || null,
        nacionalidade: nacionalidade || null,
        profissao: profissao || null,
      }),
      
      // Pessoa Jurídica
      ...(tipo === 'pessoa_juridica' && {
        cnpj: cnpj || null,
        razao_social: razao_social || null,
        nome_fantasia: nome_fantasia || null,
        inscricao_estadual: inscricao_estadual || null, // Adicionado IE
        responsavel_nome: responsavel_nome || null,
        responsavel_cargo: responsavel_cargo || null, // Adicionado Cargo
      }),
      
      observacoes: observacoes || null,
      data_primeiro_contato: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('noro_clientes')
      .insert(novoCliente)
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/core/clientes');
    return { success: true, message: 'Cliente adicionado com sucesso!', data };
  } catch (error: any) {
    console.error('Erro ao criar cliente:', error);
    return { success: false, message: `Erro: ${error.message}` };
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

  try {
    const tenant = await getTenantFromHeaders();
    if (!tenant) {
      return { success: false, message: 'Tenant não resolvido.' };
    }
    const supabase = getTenantSchemaClient(tenant.schema_name);
    
    const updates = {
      nome,
      email,
      telefone: telefone || null,
      whatsapp: whatsapp || null,
      status: status || 'ativo',
      observacoes: observacoes || null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('noro_clientes')
      .update(updates)
      .eq('id', clienteId);

    if (error) throw error;

    revalidatePath('/core/clientes');
    return { success: true, message: 'Cliente atualizado com sucesso!' };
  } catch (error: any) {
    console.error('Erro ao atualizar cliente:', error);
    return { success: false, message: `Erro: ${error.message}` };
  }
}

// ============================================================================
// DELETAR CLIENTE (SOFT DELETE)
// ============================================================================

export async function deleteClienteAction(clienteId: string) {
  if (!clienteId) {
    return { success: false, message: 'ID do cliente não fornecido.' };
  }

  try {
    const tenant = await getTenantFromHeaders();
    if (!tenant) {
      return { success: false, message: 'Tenant não resolvido.' };
    }
    const supabase = getTenantSchemaClient(tenant.schema_name);
    
    // Soft delete
    const { error } = await supabase
      .from('noro_clientes')
      .update({ 
        deleted_at: new Date().toISOString(),
        status: 'inativo'
      })
      .eq('id', clienteId);

    if (error) throw error;

    revalidatePath('/core/clientes');
    return { success: true, message: 'Cliente removido com sucesso!' };
  } catch (error: any) {
    console.error('Erro ao deletar cliente:', error);
    return { success: false, message: `Erro: ${error.message}` };
  }
}

// ============================================================================
// ESTATÍSTICAS
// ============================================================================

export async function getClientesStats() {
  try {
    const supabase = createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('noro_clientes')
      .select('status, tipo, nivel')
      .is('deleted_at', null);

    if (error) throw error;

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
  }
}
