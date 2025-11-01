import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const TENANT_ID = 'd43ef2d2-cbf1-4133-b805-77c3f6444bc2';

// GET - Listar adiantamentos com filtros
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    
    // Filtros
    const status = searchParams.get('status');
    const fornecedor_id = searchParams.get('fornecedor_id');
    const marca = searchParams.get('marca');
    const data_inicio = searchParams.get('data_inicio');
    const data_fim = searchParams.get('data_fim');
    const com_saldo = searchParams.get('com_saldo'); // 'true' = apenas com saldo disponível
    const search = searchParams.get('search'); // busca em descrição
    
    let query = supabase
      .from('fin_adiantamentos')
      .select('*')
      .eq('tenant_id', TENANT_ID)
      .order('data_adiantamento', { ascending: false });
    
    if (status) {
      query = query.eq('status', status);
    }
    
    if (fornecedor_id) {
      query = query.eq('fornecedor_id', fornecedor_id);
    }
    
    if (marca) {
      query = query.eq('marca', marca);
    }
    
    if (data_inicio) {
      query = query.gte('data_adiantamento', data_inicio);
    }
    
    if (data_fim) {
      query = query.lte('data_adiantamento', data_fim);
    }
    
    if (search) {
      query = query.or(`descricao.ilike.%${search}%,observacoes.ilike.%${search}%`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Erro ao buscar adiantamentos:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar adiantamentos', details: error.message },
        { status: 500 }
      );
    }
    
    // Filtrar apenas com saldo se solicitado
    let resultado = data || [];
    if (com_saldo === 'true') {
      resultado = resultado.filter(
        adiantamento => (adiantamento.valor_total - adiantamento.valor_utilizado) > 0
      );
    }
    
    return NextResponse.json({
      data: resultado,
      total: resultado.length,
    });
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    );
  }
}

// POST - Criar novo adiantamento
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = await request.json();
    
    // Validações
    if (!body.fornecedor_id) {
      return NextResponse.json(
        { error: 'Fornecedor é obrigatório' },
        { status: 400 }
      );
    }
    
    if (!body.valor_total || body.valor_total <= 0) {
      return NextResponse.json(
        { error: 'Valor total deve ser maior que zero' },
        { status: 400 }
      );
    }
    
    if (!body.data_adiantamento) {
      return NextResponse.json(
        { error: 'Data do adiantamento é obrigatória' },
        { status: 400 }
      );
    }
    
    const adiantamentoData = {
      tenant_id: TENANT_ID,
      fornecedor_id: body.fornecedor_id,
      valor_total: body.valor_total,
      valor_utilizado: 0,
      data_adiantamento: body.data_adiantamento,
      descricao: body.descricao || null,
      marca: body.marca || null,
      reserva_id: body.reserva_id || null,
      conta_bancaria_id: body.conta_bancaria_id || null,
      forma_pagamento_id: body.forma_pagamento_id || null,
      categoria_id: body.categoria_id || null,
      centro_custo_id: body.centro_custo_id || null,
      moeda: body.moeda || 'BRL',
      taxa_conversao: body.taxa_conversao || 1,
      observacoes: body.observacoes || null,
      status: 'disponivel',
      created_by: body.created_by || null,
    };
    
    const { data, error } = await supabase
      .from('fin_adiantamentos')
      .insert(adiantamentoData)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar adiantamento:', error);
      return NextResponse.json(
        { error: 'Erro ao criar adiantamento', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Adiantamento criado com sucesso',
      data,
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    );
  }
}
