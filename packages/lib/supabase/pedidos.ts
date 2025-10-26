import { supabaseAdmin } from './admin';
import type Database from '@/types/supabase'; // CORRIGIDO: Importação default

type PedidoInsert = Database['public']['Tables']['noro_pedidos']['Insert'];

export async function getAllPedidos() {
  const { data, error } = await supabaseAdmin
    .from('noro_pedidos')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function addPedido(pedido: PedidoInsert) {
  const { data, error } = await supabaseAdmin
    .from('noro_pedidos')
    .insert(pedido)
    .select();
  if (error) throw new Error(error.message);
  return data?.[0];
}
