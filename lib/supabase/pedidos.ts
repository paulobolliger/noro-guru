import { getSupabaseAdmin } from './admin';

export async function getAllPedidos() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('nomade_pedidos')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function addPedido(pedido: any) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('nomade_pedidos')
    .insert([pedido])
    .select();
  if (error) throw new Error(error.message);
  return data?.[0];
}
