import { getSupabaseAdmin } from './admin';

export async function getAllLeads() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('nomade_leads')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function addLead(email: string, origem: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('nomade_leads')
    .insert([{ email, origem }])
    .select();
  if (error) throw new Error(error.message);
  return data?.[0];
}
