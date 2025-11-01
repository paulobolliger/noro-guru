import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const TENANT_ID = 'd43ef2d2-cbf1-4133-b805-77c3f6444bc2';

/**
 * POST - Registrar pagamento de duplicata
 * 
 * Body:
 * - valor_pago: number (required)
 * - data_pagamento: string (required) - ISO date
 * - forma_pagamento_id: string (optional)
 * - conta_bancaria_id: string (optional)
 * - observacoes: string (optional)
 * - parcela_id: string (optional) - se for pagar parcela específica
 * - criar_despesa: boolean (optional) - se deve criar despesa correspondente
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { id } = params;
    const body = await request.json();
    
    const {
      valor_pago,
      data_pagamento,
      forma_pagamento_id,
      conta_bancaria_id,
      observacoes,
      parcela_id,
      criar_despesa = false,
    } = body;
    
    // Validações
    if (!valor_pago || valor_pago <= 0) {
      return NextResponse.json(
        { error: 'Valor pago deve ser maior que zero' },
        { status: 400 }
      );
    }
    
    if (!data_pagamento) {
      return NextResponse.json(
        { error: 'Data de pagamento é obrigatória' },
        { status: 400 }
      );
    }
    
    // Buscar duplicata
    const { data: duplicata, error: duplicataError } = await supabase
      .from('fin_duplicatas_pagar')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', TENANT_ID)
      .single();
    
    if (duplicataError || !duplicata) {
      return NextResponse.json(
        { error: 'Duplicata não encontrada' },
        { status: 404 }
      );
    }
    
    // Verificar se valor pago não excede o pendente
    if (valor_pago > duplicata.valor_pendente) {
      return NextResponse.json(
        { error: `Valor pago (${valor_pago}) excede o valor pendente (${duplicata.valor_pendente})` },
        { status: 400 }
      );
    }
    
    // Se for pagamento de parcela específica
    if (parcela_id) {
      const { data: parcela } = await supabase
        .from('fin_parcelas')
        .select('*')
        .eq('id', parcela_id)
        .eq('duplicata_pagar_id', id)
        .single();
      
      if (!parcela) {
        return NextResponse.json(
          { error: 'Parcela não encontrada' },
          { status: 404 }
        );
      }
      
      // Verificar se valor não excede parcela
      const valor_pendente_parcela = parcela.valor - parcela.valor_pago;
      if (valor_pago > valor_pendente_parcela) {
        return NextResponse.json(
          { error: `Valor pago excede o valor pendente da parcela (${valor_pendente_parcela})` },
          { status: 400 }
        );
      }
      
      // Atualizar parcela
      const novo_valor_pago = parcela.valor_pago + valor_pago;
      const novo_status = novo_valor_pago >= parcela.valor ? 'paga' : 'parcialmente_paga';
      
      await supabase
        .from('fin_parcelas')
        .update({
          valor_pago: novo_valor_pago,
          status: novo_status,
          data_pagamento: novo_status === 'paga' ? data_pagamento : parcela.data_pagamento,
        })
        .eq('id', parcela_id);
    }
    
    // Atualizar duplicata
    const novo_valor_pago = duplicata.valor_pago + valor_pago;
    const novo_valor_pendente = duplicata.valor_pendente - valor_pago;
    
    let novo_status = duplicata.status;
    if (novo_valor_pendente <= 0) {
      novo_status = 'paga';
    } else if (novo_valor_pago > 0) {
      novo_status = 'parcialmente_paga';
    }
    
    const { data: duplicataAtualizada, error: updateError } = await supabase
      .from('fin_duplicatas_pagar')
      .update({
        valor_pago: novo_valor_pago,
        status: novo_status,
        data_pagamento: novo_status === 'paga' ? data_pagamento : duplicata.data_pagamento,
        observacoes: observacoes || duplicata.observacoes,
      })
      .eq('id', id)
      .eq('tenant_id', TENANT_ID)
      .select()
      .single();
    
    if (updateError) {
      console.error('Erro ao atualizar duplicata:', updateError);
      return NextResponse.json(
        { error: 'Erro ao registrar pagamento', details: updateError.message },
        { status: 500 }
      );
    }
    
    // Criar despesa se solicitado
    let despesa = null;
    if (criar_despesa) {
      const { data: despesaData, error: despesaError } = await supabase
        .from('fin_despesas')
        .insert({
          tenant_id: TENANT_ID,
          tipo: 'Fornecedor',
          descricao: `Pagamento - ${duplicata.numero_documento || duplicata.descricao || 'Duplicata'}`,
          valor: valor_pago,
          data_competencia: data_pagamento,
          data_pagamento: data_pagamento,
          status: 'paga',
          centro_custo_id: duplicata.centro_custo_id,
          forma_pagamento_id,
          conta_bancaria_id,
          categoria_id: duplicata.categoria_id,
          marca: duplicata.marca,
          reserva_id: duplicata.reserva_id,
          fornecedor_id: duplicata.fornecedor_id,
          duplicata_pagar_id: id,
          moeda: duplicata.moeda,
          observacoes: `Pagamento de duplicata ${duplicata.numero_documento || id}${observacoes ? ` - ${observacoes}` : ''}`,
        })
        .select()
        .single();
      
      if (despesaError) {
        console.error('Erro ao criar despesa:', despesaError);
        // Não retornar erro aqui, apenas avisar
      } else {
        despesa = despesaData;
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Pagamento registrado com sucesso',
      duplicata: duplicataAtualizada,
      despesa,
      valor_pago,
      novo_status,
      valor_pendente: novo_valor_pendente,
    });
  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    return NextResponse.json(
      { error: 'Erro ao processar pagamento' },
      { status: 500 }
    );
  }
}
