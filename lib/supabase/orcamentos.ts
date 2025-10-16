import { supabaseAdmin } from './admin';
import type Database from '@/types/supabase'; // CORRIGIDO: Importação default

type OrcamentoInsert = Database['public']['Tables']['nomade_orcamentos']['Insert'];

export async function getAllOrcamentos() {
  const { data, error } = await supabaseAdmin
    .from('nomade_orcamentos')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function addOrcamento(orcamento: OrcamentoInsert) {
  const { data, error } = await supabaseAdmin
    .from('nomade_orcamentos')
    .insert(orcamento)
    .select();
  if (error) throw new Error(error.message);
  return data?.[0];
}
