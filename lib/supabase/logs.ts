// lib/supabase/logs.ts
import { supabaseAdmin } from './admin';
import type Database from '@/types/supabase';

// CORRIGIDO: O tipo agora aponta para a nova tabela 'noro_logs'
type LogsInsert = Database['public']['Tables']['noro_logs']['Insert'];

export async function getAllLogs() {
    const { data, error } = await supabaseAdmin
        .from('noro_logs') // CORRIGIDO: Nome da tabela atualizado
        .select('*')
        .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
}

export async function registrarLog(log: LogsInsert) {
  const { error } = await supabaseAdmin
    .from('noro_logs') // CORRIGIDO: Nome da tabela atualizado
    .insert(log);
  if (error) console.error('Erro ao registrar log:', error.message);
}