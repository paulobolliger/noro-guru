import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const TENANT_ID = 'd43ef2d2-cbf1-4133-b805-77c3f6444bc2';

// POST - Baixar recebimento (registrar pagamento)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { id } = params;
    const body = await request.json();
    
    // Validações
    if (!body.valor_recebido || body.valor_recebido <= 0) {
      return NextResponse.json(
        { error: 'Valor recebido deve ser maior que zero' },
        { status: 400 }
      );
    }
    
    // Buscar duplicata atual
    const { data: duplicata, error: fetchError } = await supabase
      .from('fin_duplicatas_receber')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', TENANT_ID)
      .single();
    
    if (fetchError || !duplicata) {
      return NextResponse.json(
        { error: 'Duplicata não encontrada' },
        { status: 404 }
      );
    }
    
    // Calcular novo valor recebido total
    const novoValorRecebido = duplicata.valor_recebido + body.valor_recebido;
    
    if (novoValorRecebido > duplicata.valor_total) {
      return NextResponse.json(
        { error: 'Valor recebido excede o valor total da duplicata' },
        { status: 400 }
      );
    }
    
    // Atualizar duplicata
    const updateData: any = {
      valor_recebido: novoValorRecebido,
      updated_by: body.updated_by || null,
    };
    
    // Se recebeu tudo, marcar data de recebimento
    if (novoValorRecebido === duplicata.valor_total) {
      updateData.data_recebimento = body.data_recebimento || new Date().toISOString().split('T')[0];
    }
    
    const { data, error } = await supabase
      .from('fin_duplicatas_receber')
      .update(updateData)
      .eq('id', id)
      .eq('tenant_id', TENANT_ID)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao baixar recebimento:', error);
      return NextResponse.json(
        { error: 'Erro ao baixar recebimento', details: error.message },
        { status: 500 }
      );
    }
    
    // Se foi informado ID de parcela específica, atualizar parcela
    if (body.parcela_id) {
      await supabase
        .from('fin_parcelas')
        .update({
          valor_pago: body.valor_recebido,
          data_pagamento: body.data_recebimento || new Date().toISOString().split('T')[0],
          status: 'recebida',
        })
        .eq('id', body.parcela_id)
        .eq('duplicata_receber_id', id);
    }
    
    // Criar receita correspondente (opcional, se body.criar_receita === true)
    if (body.criar_receita) {
      const receitaData = {
        tenant_id: TENANT_ID,
        marca: duplicata.marca,
        descricao: `Recebimento ${duplicata.numero_duplicata}${body.parcela_numero ? ` - Parcela ${body.parcela_numero}` : ''}`,
        categoria_id: body.categoria_id || null,
        valor: body.valor_recebido,
        moeda: duplicata.moeda,
        taxa_cambio: duplicata.taxa_cambio,
        tipo_receita: 'servico',
        cliente_id: duplicata.cliente_id,
        orcamento_id: duplicata.orcamento_id,
        status: 'confirmada',
        data_vencimento: body.data_recebimento || new Date().toISOString().split('T')[0],
        data_pagamento: body.data_recebimento || new Date().toISOString().split('T')[0],
        data_competencia: body.data_recebimento || new Date().toISOString().split('T')[0],
        forma_pagamento: body.forma_pagamento || null,
        conta_bancaria_id: body.conta_bancaria_id || null,
        possui_comissao: false,
        recorrente: false,
        observacoes: `Recebimento de duplicata ${duplicata.numero_duplicata}`,
      };
      
      const { data: receita, error: receitaError } = await supabase
        .from('fin_receitas')
        .insert(receitaData)
        .select()
        .single();
      
      if (receitaError) {
        console.error('Erro ao criar receita:', receitaError);
        // Não retorna erro, apenas loga
      } else {
        return NextResponse.json({
          ...data,
          receita_criada: receita,
        });
      }
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
