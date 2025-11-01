// API REST para Comissões e Repasses
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';
import { FinRegraComissao, FinComissaoRecebida, FinComissaoSplit, FinRepasseAutomacao } from '../../../types/financeiro-comissoes';

// Endpoint para regras de comissão
export async function handleRegrasComissao(req: NextApiRequest, res: NextApiResponse) {
  const { tenant_id, tipo, fornecedor_id } = req.query;

  if (req.method === 'GET') {
    const query = supabase
      .from('fin_regras_comissao')
      .select('*')
      .eq('tenant_id', tenant_id as string);

    if (tipo) query.eq('tipo', tipo as string);
    if (fornecedor_id) query.eq('fornecedor_id', fornecedor_id as string);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { data, error } = await supabase
      .from('fin_regras_comissao')
      .insert([req.body])
      .select();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data[0]);
  }

  if (req.method === 'PUT') {
    const { id } = req.query;
    const { data, error } = await supabase
      .from('fin_regras_comissao')
      .update(req.body)
      .eq('id', id)
      .select();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data[0]);
  }

  return res.status(405).json({ error: 'Método não permitido' });
}

// Endpoint para comissões recebidas
export async function handleComissoesRecebidas(req: NextApiRequest, res: NextApiResponse) {
  const { tenant_id, status, data_inicial, data_final } = req.query;

  if (req.method === 'GET') {
    const query = supabase
      .from('fin_comissoes_recebidas')
      .select('*')
      .eq('tenant_id', tenant_id as string);

    if (status) query.eq('status', status as string);
    if (data_inicial) query.gte('data_prevista', data_inicial as string);
    if (data_final) query.lte('data_prevista', data_final as string);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { data, error } = await supabase
      .from('fin_comissoes_recebidas')
      .insert([req.body])
      .select();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data[0]);
  }

  if (req.method === 'PUT') {
    const { id } = req.query;
    const { data, error } = await supabase
      .from('fin_comissoes_recebidas')
      .update(req.body)
      .eq('id', id)
      .select();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data[0]);
  }

  return res.status(405).json({ error: 'Método não permitido' });
}

// Endpoint para split de comissões
export async function handleComissoesSplit(req: NextApiRequest, res: NextApiResponse) {
  const { comissao_id, tipo_repassado, status } = req.query;

  if (req.method === 'GET') {
    const query = supabase
      .from('fin_comissoes_split')
      .select('*')
      .eq('comissao_id', comissao_id as string);

    if (tipo_repassado) query.eq('tipo_repassado', tipo_repassado as string);
    if (status) query.eq('status', status as string);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { data, error } = await supabase
      .from('fin_comissoes_split')
      .insert([req.body])
      .select();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data[0]);
  }

  if (req.method === 'PUT') {
    const { id } = req.query;
    const { data, error } = await supabase
      .from('fin_comissoes_split')
      .update(req.body)
      .eq('id', id)
      .select();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data[0]);
  }

  return res.status(405).json({ error: 'Método não permitido' });
}

// API Handler principal
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { resource } = req.query;

  if (resource === 'regras') {
    return handleRegrasComissao(req, res);
  }
  
  if (resource === 'recebidas') {
    return handleComissoesRecebidas(req, res);
  }
  
  if (resource === 'split') {
    return handleComissoesSplit(req, res);
  }

  // Endpoint para previsão de comissões futuras
  if (resource === 'previsao') {
    const { tenant_id, data_inicial, data_final } = req.query;
    
    const query = supabase
      .from('vw_previsao_comissoes_futuras')
      .select('*')
      .eq('tenant_id', tenant_id as string);

    if (data_inicial) query.gte('data_prevista', data_inicial as string);
    if (data_final) query.lte('data_prevista', data_final as string);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  return res.status(404).json({ error: 'Recurso não encontrado' });
}