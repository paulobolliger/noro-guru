// API REST para duplicatas a receber e a pagar
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';
import { FinDuplicataReceber, FinDuplicataPagar } from '../../../types/financeiro-duplicatas';

// GET: Lista duplicatas a receber e a pagar
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { tipo, tenant_id, status } = req.query;
    let table = '';
    if (tipo === 'receber') table = 'fin_duplicatas_receber';
    else if (tipo === 'pagar') table = 'fin_duplicatas_pagar';
    else return res.status(400).json({ error: 'Tipo inválido' });

    const query = supabase
      .from(table)
      .select('*')
      .eq('tenant_id', tenant_id as string);
    if (status) query.eq('status', status as string);
    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // POST: Cria duplicata
  if (req.method === 'POST') {
    const { tipo, payload } = req.body;
    let table = '';
    if (tipo === 'receber') table = 'fin_duplicatas_receber';
    else if (tipo === 'pagar') table = 'fin_duplicatas_pagar';
    else return res.status(400).json({ error: 'Tipo inválido' });

    const { data, error } = await supabase.from(table).insert([payload]).select();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data[0]);
  }

  // PUT: Atualiza duplicata
  if (req.method === 'PUT') {
    const { tipo, id, payload } = req.body;
    let table = '';
    if (tipo === 'receber') table = 'fin_duplicatas_receber';
    else if (tipo === 'pagar') table = 'fin_duplicatas_pagar';
    else return res.status(400).json({ error: 'Tipo inválido' });

    const { data, error } = await supabase.from(table).update(payload).eq('id', id).select();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data[0]);
  }

  // DELETE: Remove duplicata
  if (req.method === 'DELETE') {
    const { tipo, id } = req.body;
    let table = '';
    if (tipo === 'receber') table = 'fin_duplicatas_receber';
    else if (tipo === 'pagar') table = 'fin_duplicatas_pagar';
    else return res.status(400).json({ error: 'Tipo inválido' });

    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(204).end();
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
