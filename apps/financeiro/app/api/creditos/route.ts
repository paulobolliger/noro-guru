import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const TENANT_ID = 'd43ef2d2-cbf1-4133-b805-77c3f6444bc2';

// GET - Listar créditos com filtros
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    
    // Filtros
    const status = searchParams.get('status');
    const fornecedor_id = searchParams.get('fornecedor_id');
    const tipo_credito = searchParams.get('tipo_credito');
    const data_inicio = searchParams.get('data_inicio');
    const data_fim = searchParams.get('data_fim');
    const com_saldo = searchParams.get('com_saldo'); // 'true' = apenas com saldo disponível
    const search = searchParams.get('search'); // busca em motivo/observacoes
    
    let query = supabase
      .from('fin_creditos')
      .select('*')
      .eq('tenant_id', TENANT_ID)
      .order('data_credito', { ascending: false });
    
    if (status) {
      query = query.eq('status', status);
    }
    
    if (fornecedor_id) {
      query = query.eq('fornecedor_id', fornecedor_id);
    }
    
    if (tipo_credito) {
      query = query.eq('tipo_credito', tipo_credito);
    }
    
    if (data_inicio) {
      query = query.gte('data_credito', data_inicio);
    }
    
    if (data_fim) {
      query = query.lte('data_credito', data_fim);
    }
    
    if (search) {
      query = query.or(`motivo.ilike.%${search}%,observacoes.ilike.%${search}%`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Erro ao buscar créditos:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar créditos', details: error.message },
        { status: 500 }
      );
    }
    
    // Filtrar apenas com saldo se solicitado
    let resultado = data || [];
    if (com_saldo === 'true') {
      resultado = resultado.filter(
        (credito: any) => (credito.valor_total - credito.valor_utilizado) > 0
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

// POST - Criar novo crédito
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
    
    if (!body.data_credito) {
      return NextResponse.json(
        { error: 'Data do crédito é obrigatória' },
        { status: 400 }
      );
    }
    
    if (!body.tipo_credito) {
      return NextResponse.json(
        { error: 'Tipo de crédito é obrigatório' },
        { status: 400 }
      );
    }
    
    // Validar tipo_credito
    const tipos_validos = ['refund', 'overpayment', 'promotional', 'other'];
    if (!tipos_validos.includes(body.tipo_credito)) {
      return NextResponse.json(
        { error: `Tipo de crédito inválido. Valores aceitos: ${tipos_validos.join(', ')}` },
        { status: 400 }
      );
    }
    
    const creditoData = {
      tenant_id: TENANT_ID,
      fornecedor_id: body.fornecedor_id,
      valor_total: body.valor_total,
      valor_utilizado: 0,
      data_credito: body.data_credito,
      tipo_credito: body.tipo_credito,
      motivo: body.motivo || null,
      duplicata_origem_id: body.duplicata_origem_id || null, // se for refund de uma duplicata específica
      moeda: body.moeda || 'BRL',
      taxa_conversao: body.taxa_conversao || 1,
      data_validade: body.data_validade || null,
      observacoes: body.observacoes || null,
      status: 'disponivel',
      created_by: body.created_by || null,
    };
    
    const { data, error } = await supabase
      .from('fin_creditos')
      .insert(creditoData)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar crédito:', error);
      return NextResponse.json(
        { error: 'Erro ao criar crédito', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Crédito criado com sucesso',
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
