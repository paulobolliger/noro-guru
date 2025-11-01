import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { FinDuplicataPagar, FinDuplicataPagarInsert } from '@/types/financeiro';

const TENANT_ID = 'd43ef2d2-cbf1-4133-b805-77c3f6444bc2';

// GET - Listar duplicatas a pagar com filtros
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const searchParams = request.nextUrl.searchParams;
    
    // Filtros
    const status = searchParams.get('status');
    const fornecedor_id = searchParams.get('fornecedor_id');
    const reserva_id = searchParams.get('reserva_id');
    const data_vencimento_inicio = searchParams.get('data_vencimento_inicio');
    const data_vencimento_fim = searchParams.get('data_vencimento_fim');
    const marca = searchParams.get('marca');
    const busca = searchParams.get('busca');
    const vencimento_proximo = searchParams.get('vencimento_proximo'); // próximos X dias
    
    let query = supabase
      .from('fin_duplicatas_pagar')
      .select('*')
      .eq('tenant_id', TENANT_ID)
      .order('data_vencimento', { ascending: true });
    
    // Aplicar filtros
    if (status) {
      query = query.eq('status', status);
    }
    
    if (fornecedor_id) {
      query = query.eq('fornecedor_id', fornecedor_id);
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
    
    // Filtro de vencimento próximo (ex: próximos 7 dias)
    if (vencimento_proximo) {
      const hoje = new Date().toISOString().split('T')[0];
      const dataFutura = new Date();
      dataFutura.setDate(dataFutura.getDate() + parseInt(vencimento_proximo));
      const dataFuturaStr = dataFutura.toISOString().split('T')[0];
      
      query = query
        .gte('data_vencimento', hoje)
        .lte('data_vencimento', dataFuturaStr)
        .in('status', ['aberta', 'parcialmente_recebida']);
    }
    
    if (busca) {
      query = query.or(`numero_duplicata.ilike.%${busca}%,fornecedor_nome.ilike.%${busca}%,numero_nota_fiscal.ilike.%${busca}%`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Erro ao buscar duplicatas a pagar:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar duplicatas a pagar' },
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

// POST - Criar nova duplicata a pagar
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = await request.json();
    
    // Validações básicas
    if (!body.numero_duplicata || !body.valor_total || !body.data_emissao || !body.data_vencimento || !body.fornecedor_id) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando: numero_duplicata, fornecedor_id, valor_total, data_emissao, data_vencimento' },
        { status: 400 }
      );
    }
    
    // Preparar dados para inserção
    const duplicataData: FinDuplicataPagarInsert = {
      tenant_id: TENANT_ID,
      marca: body.marca || 'noro',
      
      // Identificação
      numero_duplicata: body.numero_duplicata,
      numero_nota_fiscal: body.numero_nota_fiscal || null,
      serie_nota_fiscal: body.serie_nota_fiscal || null,
      chave_acesso_nfe: body.chave_acesso_nfe || null,
      
      // Relacionamentos
      fornecedor_id: body.fornecedor_id,
      reserva_id: body.reserva_id || null,
      pedido_id: body.pedido_id || null,
      condicao_pagamento_id: body.condicao_pagamento_id || null,
      adiantamento_id: body.adiantamento_id || null,
      
      // Valores
      valor_original: body.valor_original || body.valor_total,
      valor_desconto: body.valor_desconto || 0,
      valor_juros: body.valor_juros || 0,
      valor_total: body.valor_total,
      valor_pago: body.valor_pago || 0,
      valor_credito_aplicado: body.valor_credito_aplicado || 0,
      
      moeda: body.moeda || 'BRL',
      taxa_cambio: body.taxa_cambio || 1,
      
      // Datas
      data_emissao: body.data_emissao,
      data_vencimento: body.data_vencimento,
      data_pagamento: body.data_pagamento || null,
      data_referencia: body.data_referencia || null,
      
      // Status
      status: body.status || 'aberta',
      
      // Dados do Fornecedor
      fornecedor_nome: body.fornecedor_nome || null,
      fornecedor_documento: body.fornecedor_documento || null,
      fornecedor_email: body.fornecedor_email || null,
      fornecedor_telefone: body.fornecedor_telefone || null,
      
      // Controle de Pagamento
      forma_pagamento: body.forma_pagamento || null,
      conta_bancaria_id: body.conta_bancaria_id || null,
      comprovante_pagamento_url: body.comprovante_pagamento_url || null,
      
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
      .from('fin_duplicatas_pagar')
      .insert(duplicataData)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar duplicata a pagar:', error);
      return NextResponse.json(
        { error: 'Erro ao criar duplicata a pagar', details: error.message },
        { status: 500 }
      );
    }
    
    // Se foi vinculado a um adiantamento, atualizar saldo
    if (body.adiantamento_id && body.valor_total > 0) {
      // Buscar adiantamento
      const { data: adiantamento } = await supabase
        .from('fin_adiantamentos')
        .select('valor_utilizado')
        .eq('id', body.adiantamento_id)
        .single();
      
      if (adiantamento) {
        // Atualizar valor utilizado
        await supabase
          .from('fin_adiantamentos')
          .update({
            valor_utilizado: adiantamento.valor_utilizado + body.valor_total,
          })
          .eq('id', body.adiantamento_id);
        
        // Registrar utilização
        await supabase
          .from('fin_utilizacoes')
          .insert({
            tenant_id: TENANT_ID,
            adiantamento_id: body.adiantamento_id,
            credito_id: null,
            duplicata_pagar_id: data.id,
            valor_utilizado: body.valor_total,
            data_utilizacao: new Date().toISOString().split('T')[0],
            observacoes: `Utilização em duplicata ${body.numero_duplicata}`,
            created_by: body.created_by || null,
          });
      }
    }
    
    // Se tiver parcelas, criar parcelas
    if (body.parcelas && Array.isArray(body.parcelas) && body.parcelas.length > 0) {
      const parcelasData = body.parcelas.map((parcela: any, index: number) => ({
        tenant_id: TENANT_ID,
        duplicata_receber_id: null,
        duplicata_pagar_id: data.id,
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
