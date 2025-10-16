  import { supabaseAdmin } from './admin';
  import type Database from '@/types/supabase';

  type UsuarioInsert = Database['public']['Tables']['nomade_users']['Insert'];

  export async function getAdminUsers() {
    const { data, error } = await supabaseAdmin.from('nomade_users').select('*');
    if (error) throw new Error(error.message);
    return data;
  }

  export async function addAdminUser(user: UsuarioInsert) {
    const { data, error } = await supabaseAdmin
      .from('nomade_users')
      .insert(user)
      .select();
    if (error) throw new Error(error.message);
    return data?.[0];
  }
  
