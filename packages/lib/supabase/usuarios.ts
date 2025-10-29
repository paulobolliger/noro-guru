  import { supabaseAdmin } from './admin';
    type UsuarioInsert = Database['public']['Tables']['noro_users']['Insert'];

  export async function getAdminUsers() {
    const { data, error } = await supabaseAdmin.from('noro_users').select('*');
    if (error) throw new Error(error.message);
    return data;
  }

  export async function addAdminUser(user: UsuarioInsert) {
    const { data, error } = await supabaseAdmin
      .from('noro_users')
      .insert(user)
      .select();
    if (error) throw new Error(error.message);
    return data?.[0];
  }
  


