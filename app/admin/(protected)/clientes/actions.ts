// app/admin/(protected)/clientes/actions.ts
'use server';

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { Database } from '@/types/supabase';

type LeadInsert = Database['public']['Tables']['nomade_leads']['Insert'];
type LeadUpdate = Database['public']['Tables']['nomade_leads']['Update'];

// --- Buscar Todos os Clientes ---
// Clientes são leads com status 'ganho'
export async function getClientes() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    const { data, error } = await supabaseAdmin
      .from('nomade_leads')
      .select('*')
      .eq('status', 'ganho')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Erro ao buscar clientes:', error);
    return [];
  }
}

// --- Criar Novo Cliente ---
export async function createClienteAction(formData: FormData) {
  const nome = formData.get('nome') as string;
  const email = formData.get('email') as string;
  const telefone = formData.get('telefone') as string;
  const whatsapp = formData.get('whatsapp') as string;
  const origem = formData.get('origem') as string;
  const destino_interesse = formData.get('destino_interesse') as string;
  const num_pessoas = formData.get('num_pessoas') as string;
  const valor_estimado = formData.get('valor_estimado') as string;
  const observacoes = formData.get('observacoes') as string;

  if (!nome || !email) {
    return { success: false, message: 'Nome e e-mail são obrigatórios.' };
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    const novoCliente: LeadInsert = {
      nome,
      email,
      telefone: telefone || null,
      whatsapp: whatsapp || null,
      origem: origem || 'site',
      status: 'ganho', // Já é cliente!
      destino_interesse: destino_interesse || null,
      num_pessoas: num_pessoas ? parseInt(num_pessoas) : null,
      valor_estimado: valor_estimado ? parseFloat(valor_estimado) : null,
      observacoes: observacoes || null,
      probabilidade: 100, // 100% pois já é cliente
    };

    const { data, error } = await supabaseAdmin
      .from('nomade_leads')
      .insert(novoCliente)
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/admin/clientes');
    return { success: true, message: 'Cliente adicionado com sucesso!', data };
  } catch (error: any) {
    console.error('Erro ao criar cliente:', error);
    return { success: false, message: `Erro: ${error.message}` };
  }
}

// --- Atualizar Cliente ---
export async function updateClienteAction(clienteId: string, formData: FormData) {
  if (!clienteId) {
    return { success: false, message: 'ID do cliente não fornecido.' };
  }

  const nome = formData.get('nome') as string;
  const email = formData.get('email') as string;
  const telefone = formData.get('telefone') as string;
  const whatsapp = formData.get('whatsapp') as string;
  const destino_interesse = formData.get('destino_interesse') as string;
  const num_pessoas = formData.get('num_pessoas') as string;
  const valor_estimado = formData.get('valor_estimado') as string;
  const observacoes = formData.get('observacoes') as string;

  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    const updates: LeadUpdate = {
      nome,
      email,
      telefone: telefone || null,
      whatsapp: whatsapp || null,
      destino_interesse: destino_interesse || null,
      num_pessoas: num_pessoas ? parseInt(num_pessoas) : null,
      valor_estimado: valor_estimado ? parseFloat(valor_estimado) : null,
      observacoes: observacoes || null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabaseAdmin
      .from('nomade_leads')
      .update(updates)
      .eq('id', clienteId);

    if (error) throw error;

    revalidatePath('/admin/clientes');
    return { success: true, message: 'Cliente atualizado com sucesso!' };
  } catch (error: any) {
    console.error('Erro ao atualizar cliente:', error);
    return { success: false, message: `Erro: ${error.message}` };
  }
}

// --- Deletar Cliente ---
export async function deleteClienteAction(clienteId: string) {
  if (!clienteId) {
    return { success: false, message: 'ID do cliente não fornecido.' };
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    // Na verdade, vamos mudar o status para 'inativo' em vez de deletar
    const { error } = await supabaseAdmin
      .from('nomade_leads')
      .update({ status: 'inativo' })
      .eq('id', clienteId);

    if (error) throw error;

    revalidatePath('/admin/clientes');
    return { success: true, message: 'Cliente removido com sucesso!' };
  } catch (error: any) {
    console.error('Erro ao deletar cliente:', error);
    return { success: false, message: `Erro: ${error.message}` };
  }
}

// --- Buscar Cliente por ID ---
export async function getClienteById(clienteId: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    const { data, error } = await supabaseAdmin
      .from('nomade_leads')
      .select('*')
      .eq('id', clienteId)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error('Erro ao buscar cliente:', error);
    return { success: false, message: `Erro: ${error.message}` };
  }
}