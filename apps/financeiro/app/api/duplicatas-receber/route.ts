import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentTenantId } from '@/lib/tenant';
import type { FinDuplicataReceber, FinDuplicataReceberInsert } from '@/types/financeiro';


// GET - Listar duplicatas a receber com filtros
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const tenantId = await getCurrentTenantId();
    const searchParams = request.nextUrl.searchParams;
    
    // Filtros
    const status = searchParams.get('status');
    const cliente_id = searchParams.get('cliente_id');
    const reserva_id = searchParams.get('reserva_id');
    const data_vencimento_inicio = searchParams.get('data_vencimento_inicio');
    const data_vencimento_fim = searchParams.get('data_vencimento_fim');
    const marca = searchParams.get('marca');
    const busca = searchParams.get('busca'); // busca por numero ou cliente nome
    
    let query = supabase
      .from('fin_duplicatas_receber')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('data_vencimento', { ascending: true });
    
    // Aplicar filtros
    if (status) {
      query = query.eq('status', status);
    }
    
    if (cliente_id) {
      query = query.eq('cliente_id', cliente_id);
    }
    
    if (reserva_id) {
      query = query.eq('reserva_id', reserva_id);
    }
    
    if (marca) {
      query = query.eq('marca', marca);
    }
    
    if (data_vencimento_inicio) {
      query = query.gte('data_vencimento', data_vencimento_inicio);
    }
    
    if (data_vencimento_fim) {
      query = query.lte('data_vencimento', data_vencimento_fim);
    }
    
    if (busca) {
      query = query.or(`numero_duplicata.ilike.%${busca}%,cliente_nome.ilike.%${busca}%,numero_nota_fiscal.ilike.%${busca}%`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Erro ao buscar duplicatas a receber:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar duplicatas a receber' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    );
  }
}

// POST - Criar nova duplicata a receber
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const tenantId = await getCurrentTenantId();
    const body = await request.json();
    
    // Validações básicas
    if (!body.numero_duplicata || !body.valor_total || !body.data_emissao || !body.data_vencimento) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando: numero_duplicata, valor_total, data_emissao, data_vencimento' },
        { status: 400 }
      );
    }
    
    // Preparar dados para inserção
    const duplicataData: FinDuplicataReceberInsert = {
      tenant_id: tenantId,
      marca: body.marca || 'noro',
      
      // Identificação
      numero_duplicata: body.numero_duplicata,
      numero_nota_fiscal: body.numero_nota_fiscal || null,
      serie_nota_fiscal: body.serie_nota_fiscal || null,
      chave_acesso_nfe: body.chave_acesso_nfe || null,
      
      // Relacionamentos
      cliente_id: body.cliente_id || null,
      fornecedor_intermediario_id: body.fornecedor_intermediario_id || null,
      reserva_id: body.reserva_id || null,
      pedido_id: body.pedido_id || null,
      orcamento_id: body.orcamento_id || null,
      condicao_pagamento_id: body.condicao_pagamento_id || null,
      
      // Valores
      valor_original: body.valor_original || body.valor_total,
      valor_desconto: body.valor_desconto || 0,
      valor_juros: body.valor_juros || 0,
      valor_total: body.valor_total,
      valor_recebido: body.valor_recebido || 0,
      
      moeda: body.moeda || 'BRL',
      taxa_cambio: body.taxa_cambio || 1,
      
      // Datas
      data_emissao: body.data_emissao,
      data_vencimento: body.data_vencimento,
      data_recebimento: body.data_recebimento || null,
      data_referencia: body.data_referencia || null,
      
      // Status
      status: body.status || 'aberta',
      
      // Dados do Cliente
      cliente_nome: body.cliente_nome || null,
      cliente_documento: body.cliente_documento || null,
      cliente_email: body.cliente_email || null,
      cliente_telefone: body.cliente_telefone || null,
      
      // Observações
      observacoes: body.observacoes || null,
      condicao_pagamento_texto: body.condicao_pagamento_texto || null,
      documento_url: body.documento_url || null,
      xml_nfe_url: body.xml_nfe_url || null,
      
      // Auditoria
      created_by: body.created_by || null,
      updated_by: null,
    };
    
    const { data, error } = await supabase
      .from('fin_duplicatas_receber')
      .insert(duplicataData)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar duplicata a receber:', error);
      return NextResponse.json(
        { error: 'Erro ao criar duplicata a receber', details: error.message },
        { status: 500 }
      );
    }
    
    // Se tiver parcelas, criar parcelas
    if (body.parcelas && Array.isArray(body.parcelas) && body.parcelas.length > 0) {
      const parcelasData = body.parcelas.map((parcela: any, index: number) => ({
        tenant_id: tenantId,
        duplicata_receber_id: data.id,
        duplicata_pagar_id: null,
        numero_parcela: index + 1,
        valor: parcela.valor,
        valor_pago: 0,
        data_vencimento: parcela.data_vencimento,
        data_pagamento: null,
        status: 'aberta',
        observacoes: parcela.observacoes || null,
      }));
      
      const { error: parcelasError } = await supabase
        .from('fin_parcelas')
        .insert(parcelasData);
      
      if (parcelasError) {
        console.error('Erro ao criar parcelas:', parcelasError);
        // Não retorna erro, apenas loga
      }
    }
    
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    );
  }
}
