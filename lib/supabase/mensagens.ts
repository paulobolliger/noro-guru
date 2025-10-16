  import { supabaseAdmin } from './admin'; // Corrigido

  export async function getMensagensContato() {
    const { data, error } = await supabaseAdmin
      .from('nomade_mensagens')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  }
  
