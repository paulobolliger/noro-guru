import { getSupabaseAdmin } from './admin';

export async function getAdminUsers() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('nomade_users').select('*');
  if (error) throw new Error(error.message);
  return data;
}

export async function addAdminUser(user: any) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('nomade_users')
    .insert([user])
    .select();
  if (error) throw new Error(error.message);
  return data?.[0];
}
