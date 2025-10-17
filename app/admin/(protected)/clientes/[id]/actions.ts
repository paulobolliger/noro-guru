'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';
import { revalidatePath } from 'next/cache';

type Cliente = Database['public']['Tables']['noro_clientes']['Row'];
type ClienteUpdate = Database['public']['Tables']['noro_clientes']['Update'];
type DocumentoInsert = Database['public']['Tables']['noro_clientes_documentos']['Insert'];
type DocumentoUpdate = Database['public']['Tables']['noro_clientes_documentos']['Update'];

// ============================================================================
// CLIENTE - DADOS PRINCIPAIS
// ============================================================================

export async function getClienteDetalhes(clienteId: string) {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase // Tipagem implícita já funciona com o client configurado
    .from('noro_clientes')
    .select(`
      *,
      agente:noro_users!agente_responsavel_id(id, nome, email, avatar_url),
      origem_lead:noro_leads!origem_lead_id(id, nome, email, origem)
    `)
    .eq('id', clienteId)
    .is('deleted_at', null)
    .single();

  if (error) {
    console.error('Erro ao buscar cliente:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function updateCliente(clienteId: string, formData: FormData) {
  const supabase = createServerSupabaseClient();

  const updates: ClienteUpdate = {
    nome: formData.get('nome') as string,
    email: formData.get('email') as string,
    telefone: formData.get('telefone') as string,
    whatsapp: formData.get('whatsapp') as string,
    cpf: formData.get('cpf') as string,
    passaporte: formData.get('passaporte') as string,
    data_nascimento: formData.get('data_nascimento') as string,
    nacionalidade: formData.get('nacionalidade') as string,
    profissao: formData.get('profissao') as string,
    cnpj: formData.get('cnpj') as string, // Incluído PJ
    razao_social: formData.get('razao_social') as string, // Incluído PJ
    nome_fantasia: formData.get('nome_fantasia') as string, // Incluído PJ
    inscricao_estadual: formData.get('inscricao_estadual') as string, // Incluído PJ
    responsavel_nome: formData.get('responsavel_nome') as string, // Incluído PJ
    responsavel_cargo: formData.get('responsavel_cargo') as string, // Incluído PJ
    status: formData.get('status') as string,
    tipo: formData.get('tipo') as string,
    segmento: formData.get('segmento') as string,
    nivel: formData.get('nivel') as string,
    idioma_preferido: formData.get('idioma_preferido') as string,
    moeda_preferida: formData.get('moeda_preferida') as string,
    observacoes: formData.get('observacoes') as string,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('noro_clientes')
    .update(updates)
    .eq('id', clienteId);

  if (error) {
    console.error('Erro ao atualizar cliente:', error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/admin/clientes/${clienteId}`);
  return { success: true };
}

// ============================================================================
// DOCUMENTOS
// ============================================================================

export async function getClienteDocumentos(clienteId: string) {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('noro_clientes_documentos')
    .select('*')
    .eq('cliente_id', clienteId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar documentos:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function createDocumento(clienteId: string, formData: FormData) {
  const supabase = createServerSupabaseClient();

  const documento: DocumentoInsert = {
    cliente_id: clienteId,
    tipo: formData.get('tipo') as string,
    numero: formData.get('numero') as string,
    pais_emissor: formData.get('pais_emissor') as string,
    orgao_emissor: formData.get('orgao_emissor') as string,
    data_emissao: formData.get('data_emissao') as string,
    data_validade: formData.get('data_validade') as string,
    status: formData.get('status') as string,
    arquivo_url: formData.get('arquivo_url') as string,
    arquivo_public_id: formData.get('arquivo_public_id') as string,
    arquivo_nome: formData.get('arquivo_nome') as string,
    arquivo_tamanho: formData.get('arquivo_tamanho') ? parseInt(formData.get('arquivo_tamanho') as string) : null,
    observacoes: formData.get('observacoes') as string,
  };

  const { error } = await supabase
    .from('noro_clientes_documentos')
    .insert(documento);

  if (error) {
    console.error('Erro ao criar documento:', error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/admin/clientes/${clienteId}`);
  return { success: true };
}

export async function updateDocumento(documentoId: string, formData: FormData) {
  const supabase = createServerSupabaseClient();

  const updates: DocumentoUpdate = {
    tipo: formData.get('tipo') as string,
    numero: formData.get('numero') as string,
    pais_emissor: formData.get('pais_emissor') as string,
    orgao_emissor: formData.get('orgao_emissor') as string,
    data_emissao: formData.get('data_emissao') as string,
    data_validade: formData.get('data_validade') as string,
    status: formData.get('status') as string,
    observacoes: formData.get('observacoes') as string,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('noro_clientes_documentos')
    .update(updates)
    .eq('id', documentoId);

  if (error) {
    console.error('Erro ao atualizar documento:', error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/admin/clientes`);
  return { success: true };
}

export async function deleteDocumento(documentoId: string, clienteId: string) {
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from('noro_clientes_documentos')
    .delete()
    .eq('id', documentoId);

  if (error) {
    console.error('Erro ao deletar documento:', error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/admin/clientes/${clienteId}`);
  return { success: true };
}

// ============================================================================
// PREFERÊNCIAS
// ============================================================================

export async function getClientePreferencias(clienteId: string) {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('noro_clientes_preferencias')
    .select('*')
    .eq('cliente_id', clienteId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Erro ao buscar preferências:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function upsertPreferencias(clienteId: string, formData: FormData) {
  const supabase = createServerSupabaseClient();

  const preferencias = {
    cliente_id: clienteId,
    frequencia_viagem: formData.get('frequencia_viagem') as string,
    orcamento_medio: formData.get('orcamento_medio') as string,
    // JSONB array: transforma string 'a,b,c' em array ['a', 'b', 'c']
    estilo_viagem: formData.get('estilo_viagem') ? (formData.get('estilo_viagem') as string).split(',').filter(Boolean) : [],
    destinos_favoritos: formData.get('destinos_favoritos') ? (formData.get('destinos_favoritos') as string).split(',').filter(Boolean) : [],
    destinos_desejados: formData.get('destinos_desejados') ? (formData.get('destinos_desejados') as string).split(',').filter(Boolean) : [],
    assento_preferido: formData.get('assento_preferido') as string,
    classe_preferida: formData.get('classe_preferida') as string,
    tipo_hospedagem: formData.get('tipo_hospedagem') ? (formData.get('tipo_hospedagem') as string).split(',').filter(Boolean) : [],
    preferencias_quarto: formData.get('preferencias_quarto') as string,
    categoria_hotel: formData.get('categoria_hotel') as string,
    restricoes_alimentares: formData.get('restricoes_alimentares') ? (formData.get('restricoes_alimentares') as string).split(',').filter(Boolean) : [],
    refeicao_preferida: formData.get('refeicao_preferida') as string,
    necessidades_especiais: formData.get('necessidades_especiais') as string,
    mobilidade_reduzida: formData.get('mobilidade_reduzida') === 'true',
    viaja_com_criancas: formData.get('viaja_com_criancas') === 'true',
    viaja_com_pets: formData.get('viaja_com_pets') === 'true',
    seguro_preferido: formData.get('seguro_preferido') as string,
    aluguel_carro: formData.get('aluguel_carro') === 'true',
    tours_guiados: formData.get('tours_guiados') === 'true',
    transfers: formData.get('transfers') === 'true',
    observacoes: formData.get('observacoes') as string,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('noro_clientes_preferencias')
    .upsert(preferencias, { onConflict: 'cliente_id' });

  if (error) {
    console.error('Erro ao salvar preferências:', error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/admin/clientes/${clienteId}`);
  return { success: true };
}

// ============================================================================
// ENDEREÇOS
// ============================================================================

export async function getClienteEnderecos(clienteId: string) {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('noro_clientes_enderecos')
    .select('*')
    .eq('cliente_id', clienteId)
    .order('principal', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar endereços:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function createEndereco(clienteId: string, formData: FormData) {
  const supabase = createServerSupabaseClient();

  const endereco = {
    cliente_id: clienteId,
    tipo: formData.get('tipo') as string,
    principal: formData.get('principal') === 'true',
    logradouro: formData.get('logradouro') as string,
    numero: formData.get('numero') as string,
    complemento: formData.get('complemento') as string,
    bairro: formData.get('bairro') as string,
    cidade: formData.get('cidade') as string,
    estado: formData.get('estado') as string,
    cep: formData.get('cep') as string,
    pais: formData.get('pais') as string,
  };

  if (endereco.principal) {
    await supabase
      .from('noro_clientes_enderecos')
      .update({ principal: false })
      .eq('cliente_id', clienteId);
  }

  const { error } = await supabase
    .from('noro_clientes_enderecos')
    .insert(endereco);

  if (error) {
    console.error('Erro ao criar endereço:', error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/admin/clientes/${clienteId}`);
  return { success: true };
}

export async function updateEndereco(enderecoId: string, formData: FormData, clienteId: string) {
  const supabase = createServerSupabaseClient();

  const updates = {
    tipo: formData.get('tipo') as string,
    principal: formData.get('principal') === 'true',
    logradouro: formData.get('logradouro') as string,
    numero: formData.get('numero') as string,
    complemento: formData.get('complemento') as string,
    bairro: formData.get('bairro') as string,
    cidade: formData.get('cidade') as string,
    estado: formData.get('estado') as string,
    cep: formData.get('cep') as string,
    pais: formData.get('pais') as string,
    updated_at: new Date().toISOString(),
  };

  if (updates.principal) {
    await supabase
      .from('noro_clientes_enderecos')
      .update({ principal: false })
      .eq('cliente_id', clienteId)
      .neq('id', enderecoId);
  }

  const { error } = await supabase
    .from('noro_clientes_enderecos')
    .update(updates)
    .eq('id', enderecoId);

  if (error) {
    console.error('Erro ao atualizar endereço:', error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/admin/clientes/${clienteId}`);
  return { success: true };
}

export async function deleteEndereco(enderecoId: string, clienteId: string) {
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from('noro_clientes_enderecos')
    .delete()
    .eq('id', enderecoId);

  if (error) {
    console.error('Erro ao deletar endereço:', error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/admin/clientes/${clienteId}`);
  return { success: true };
}

// ============================================================================
// CONTATOS DE EMERGÊNCIA
// ============================================================================

export async function getClienteContatosEmergencia(clienteId: string) {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('noro_clientes_contatos_emergencia')
    .select('*')
    .eq('cliente_id', clienteId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar contatos de emergência:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function createContatoEmergencia(clienteId: string, formData: FormData) {
  const supabase = createServerSupabaseClient();

  const contato = {
    cliente_id: clienteId,
    nome: formData.get('nome') as string,
    parentesco: formData.get('parentesco') as string,
    telefone: formData.get('telefone') as string,
    email: formData.get('email') as string,
    observacoes: formData.get('observacoes') as string,
  };

  const { error } = await supabase
    .from('noro_clientes_contatos_emergencia')
    .insert(contato);

  if (error) {
    console.error('Erro ao criar contato de emergência:', error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/admin/clientes/${clienteId}`);
  return { success: true };
}

export async function deleteContatoEmergencia(contatoId: string, clienteId: string) {
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from('noro_clientes_contatos_emergencia')
    .delete()
    .eq('id', contatoId);

  if (error) {
    console.error('Erro ao deletar contato de emergência:', error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/admin/clientes/${clienteId}`);
  return { success: true };
}

// ============================================================================
// MILHAS
// ============================================================================

export async function getClienteMilhas(clienteId: string) {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('noro_clientes_milhas')
    .select('*')
    .eq('cliente_id', clienteId)
    .order('companhia', { ascending: true });

  if (error) {
    console.error('Erro ao buscar milhas:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function createMilhas(clienteId: string, formData: FormData) {
  const supabase = createServerSupabaseClient();

  const milhas = {
    cliente_id: clienteId,
    companhia: formData.get('programa') as string, // CORRIGIDO: O formulário usa 'programa', mas o BD espera 'companhia'
    numero_programa: formData.get('numero_cartao') as string, // CORRIGIDO: Nome do campo atualizado
    categoria: formData.get('categoria') as string,
    saldo_estimado: formData.get('saldo') ? parseInt(formData.get('saldo') as string) : null,
    data_validade: formData.get('data_validade') as string,
    observacoes: formData.get('observacoes') as string,
  };

  // Verifica se o campo 'companhia' (recebido como 'programa') é nulo/vazio. Se for, usa 'Outra'
  if (!milhas.companhia) {
      milhas.companhia = 'Outro';
  }

  const { error } = await supabase
    .from('noro_clientes_milhas')
    .insert(milhas);

  if (error) {
    console.error('Erro ao criar milhas:', error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/admin/clientes/${clienteId}`);
  return { success: true };
}

export async function updateMilhas(milhasId: string, formData: FormData, clienteId: string) {
  const supabase = createServerSupabaseClient();

  const updates = {
    companhia: formData.get('programa') as string, // CORRIGIDO: O formulário usa 'programa', mas o BD espera 'companhia'
    numero_programa: formData.get('numero_cartao') as string, // CORRIGIDO: Nome do campo atualizado
    categoria: formData.get('categoria') as string,
    saldo_estimado: formData.get('saldo') ? parseInt(formData.get('saldo') as string) : null,
    data_validade: formData.get('data_validade') as string,
    observacoes: formData.get('observacoes') as string,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('noro_clientes_milhas')
    .update(updates)
    .eq('id', milhasId);

  if (error) {
    console.error('Erro ao atualizar milhas:', error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/admin/clientes/${clienteId}`);
  return { success: true };
}

export async function deleteMilhas(milhasId: string, clienteId: string) {
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from('noro_clientes_milhas')
    .delete()
    .eq('id', milhasId);

  if (error) {
    console.error('Erro ao deletar milhas:', error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/admin/clientes/${clienteId}`);
  return { success: true };
}