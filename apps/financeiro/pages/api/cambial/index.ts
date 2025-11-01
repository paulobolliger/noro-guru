// API REST para Controle Cambial e Multimoeda
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';
import { FinConfigCambioGrupo, FinTaxaCambio, FinAlertaCambio, FinSimulacaoMargem } from '../../../types/financeiro-cambial';

// Endpoint para configurações de câmbio por grupo
export async function handleConfigCambio(req: NextApiRequest, res: NextApiResponse) {
  const { tenant_id, grupo_id } = req.query;

  if (req.method === 'GET') {
    const query = supabase
      .from('fin_config_cambio_grupo')
      .select('*')
      .eq('tenant_id', tenant_id as string);

    if (grupo_id) query.eq('grupo_id', grupo_id as string);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { data, error } = await supabase
      .from('fin_config_cambio_grupo')
      .insert([req.body])
      .select();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data[0]);
  }

  if (req.method === 'PUT') {
    const { id } = req.query;
    const { data, error } = await supabase
      .from('fin_config_cambio_grupo')
      .update(req.body)
      .eq('id', id)
      .select();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data[0]);
  }

  return res.status(405).json({ error: 'Método não permitido' });
}

// Endpoint para taxas de câmbio
export async function handleTaxasCambio(req: NextApiRequest, res: NextApiResponse) {
  const { tenant_id, moeda_origem, moeda_destino, data_inicial, data_final } = req.query;

  if (req.method === 'GET') {
    const query = supabase
      .from('fin_taxas_cambio')
      .select('*')
      .eq('tenant_id', tenant_id as string);

    if (moeda_origem) query.eq('moeda_origem', moeda_origem as string);
    if (moeda_destino) query.eq('moeda_destino', moeda_destino as string);
    if (data_inicial) query.gte('data_taxa', data_inicial as string);
    if (data_final) query.lte('data_taxa', data_final as string);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { data, error } = await supabase
      .from('fin_taxas_cambio')
      .insert([req.body])
      .select();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data[0]);
  }

  return res.status(405).json({ error: 'Método não permitido' });
}

// Endpoint para simulações de margem
export async function handleSimulacoesMargem(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const simulacao = req.body;
    
    // Busca taxa de câmbio atual
    const { data: taxaCambio } = await supabase
      .from('fin_taxas_cambio')
      .select('taxa_venda')
      .eq('moeda_origem', simulacao.moeda_origem)
      .eq('moeda_destino', simulacao.moeda_destino)
      .eq('tipo_cambio', simulacao.tipo_cambio || 'comercial')
      .order('data_taxa', { ascending: false })
      .limit(1);

    if (taxaCambio && taxaCambio[0]) {
      simulacao.taxa_cambio = taxaCambio[0].taxa_venda;
    }

    // Calcula valor final e margem
    const taxas = (simulacao.spread || 0) + (simulacao.iof || 0) + (simulacao.outras_taxas || 0);
    simulacao.valor_final = simulacao.valor_original * simulacao.taxa_cambio * (1 + taxas/100);
    simulacao.margem_final = ((simulacao.valor_final - simulacao.valor_original) / simulacao.valor_original) * 100;

    const { data, error } = await supabase
      .from('fin_simulacoes_margem')
      .insert([simulacao])
      .select();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data[0]);
  }

  return res.status(405).json({ error: 'Método não permitido' });
}

// Endpoint para consulta de variação cambial
export async function handleVariacaoCambial(req: NextApiRequest, res: NextApiResponse) {
  const { tenant_id, moeda_origem, moeda_destino, dias } = req.query;

  if (req.method === 'GET') {
    const query = supabase
      .from('vw_variacao_cambial')
      .select('*')
      .eq('tenant_id', tenant_id as string);

    if (moeda_origem) query.eq('moeda_origem', moeda_origem as string);
    if (moeda_destino) query.eq('moeda_destino', moeda_destino as string);
    if (dias) query.gte('data_taxa', `CURRENT_DATE - INTERVAL '${dias} days'`);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  return res.status(405).json({ error: 'Método não permitido' });
}

// API Handler principal
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { resource } = req.query;

  if (resource === 'config') {
    return handleConfigCambio(req, res);
  }
  
  if (resource === 'taxas') {
    return handleTaxasCambio(req, res);
  }
  
  if (resource === 'simulacao') {
    return handleSimulacoesMargem(req, res);
  }

  if (resource === 'variacao') {
    return handleVariacaoCambial(req, res);
  }

  return res.status(404).json({ error: 'Recurso não encontrado' });
}