  import { supabaseAdmin } from './admin';
  import type Database from '@/types/supabase';

  type LogsInsert = Database['public']['Tables']['nomade_logs']['Insert'];

  export async function getAllLogs() {
      const { data, error } = await supabaseAdmin
          .from('nomade_logs')
          .select('*')
          .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
  }

  export async function registrarLog(log: LogsInsert) {
    const { error } = await supabaseAdmin
      .from('nomade_logs')
      .insert(log);
    if (error) console.error('Erro ao registrar log:', error.message);
  }
  
