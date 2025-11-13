import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentTenantId } from '@/lib/tenant';


/**
 * POST - Aplicar crédito a duplicata
 * 
 * Body:
 * - credito_id: string (required)
 * - valor_aplicar: number (required)
 * - observacoes: string (optional)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const tenantId = await getCurrentTenantId();
    const { id } = params;
    const body = await request.json();
    
    const {
      credito_id,
      valor_aplicar,
      observacoes,
    } = body;
    
    // Validações
    if (!credito_id) {
      return NextResponse.json(
        { error: 'ID do crédito é obrigatório' },
        { status: 400 }
      );
    }
    
    if (!valor_aplicar || valor_aplicar <= 0) {
      return NextResponse.json(
        { error: 'Valor a aplicar deve ser maior que zero' },
        { status: 400 }
      );
    }
    
    // Buscar duplicata
    const { data: duplicata, error: duplicataError } = await supabase
      .from('fin_duplicatas_pagar')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .single();
    
    if (duplicataError || !duplicata) {
      return NextResponse.json(
        { error: 'Duplicata não encontrada' },
        { status: 404 }
      );
    }
    
    // Buscar crédito
    const { data: credito, error: creditoError } = await supabase
      .from('fin_creditos')
      .select('*')
      .eq('id', credito_id)
      .eq('tenant_id', tenantId)
      .single();
    
    if (creditoError || !credito) {
      return NextResponse.json(
        { error: 'Crédito não encontrado' },
        { status: 404 }
      );
    }
    
    // Verificar se crédito está ativo
    if (credito.status !== 'disponivel') {
      return NextResponse.json(
        { error: `Crédito não está disponível (status: ${credito.status})` },
        { status: 400 }
      );
    }
    
    // Verificar saldo disponível
    const saldo_disponivel = credito.valor_total - credito.valor_utilizado;
    if (valor_aplicar > saldo_disponivel) {
      return NextResponse.json(
        { error: `Valor a aplicar (${valor_aplicar}) excede saldo disponível (${saldo_disponivel})` },
        { status: 400 }
      );
    }
    
    // Verificar se valor não excede pendente da duplicata
    if (valor_aplicar > duplicata.valor_pendente) {
      return NextResponse.json(
        { error: `Valor a aplicar (${valor_aplicar}) excede valor pendente (${duplicata.valor_pendente})` },
        { status: 400 }
      );
    }
    
    // Verificar compatibilidade de fornecedor
    if (credito.fornecedor_id !== duplicata.fornecedor_id) {
      return NextResponse.json(
        { error: 'Crédito e duplicata são de fornecedores diferentes' },
        { status: 400 }
      );
    }
    
    // Verificar compatibilidade de moeda
    if (credito.moeda !== duplicata.moeda) {
      return NextResponse.json(
        { error: 'Crédito e duplicata têm moedas diferentes' },
        { status: 400 }
      );
    }
    
    // Registrar utilização do crédito
    const { data: utilizacao, error: utilizacaoError } = await supabase
      .from('fin_utilizacoes')
      .insert({
        tenant_id: tenantId,
        credito_id,
        duplicata_pagar_id: id,
        valor_utilizado: valor_aplicar,
        data_utilizacao: new Date().toISOString().split('T')[0],
        observacoes,
      })
      .select()
      .single();
    
    if (utilizacaoError) {
      console.error('Erro ao registrar utilização:', utilizacaoError);
      return NextResponse.json(
        { error: 'Erro ao aplicar crédito', details: utilizacaoError.message },
        { status: 500 }
      );
    }
    
    // Atualizar saldo do crédito
    const novo_valor_utilizado = credito.valor_utilizado + valor_aplicar;
    const novo_status_credito = novo_valor_utilizado >= credito.valor_total ? 'utilizado' : 'disponivel';
    
    await supabase
      .from('fin_creditos')
      .update({
        valor_utilizado: novo_valor_utilizado,
        status: novo_status_credito,
      })
      .eq('id', credito_id);
    
    // Atualizar duplicata
    const novo_valor_credito_aplicado = duplicata.valor_credito_aplicado + valor_aplicar;
    const novo_valor_pendente = duplicata.valor_pendente - valor_aplicar;
    
    let novo_status = duplicata.status;
    if (novo_valor_pendente <= 0) {
      novo_status = 'paga';
    } else if (novo_valor_credito_aplicado > 0 || duplicata.valor_pago > 0) {
      novo_status = 'parcialmente_paga';
    }
    
    const { data: duplicataAtualizada, error: updateError } = await supabase
      .from('fin_duplicatas_pagar')
      .update({
        valor_credito_aplicado: novo_valor_credito_aplicado,
        status: novo_status,
        data_pagamento: novo_status === 'paga' ? new Date().toISOString().split('T')[0] : duplicata.data_pagamento,
      })
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .select()
      .single();
    
    if (updateError) {
      console.error('Erro ao atualizar duplicata:', updateError);
      return NextResponse.json(
        { error: 'Erro ao atualizar duplicata', details: updateError.message },
        { status: 500 }
      );
    }
    
    // Buscar saldo atualizado do crédito
    const { data: creditoAtualizado } = await supabase
      .from('fin_creditos')
      .select('*')
      .eq('id', credito_id)
      .single();
    
    return NextResponse.json({
      success: true,
      message: 'Crédito aplicado com sucesso',
      duplicata: duplicataAtualizada,
      utilizacao,
      credito: creditoAtualizado,
      valor_aplicado: valor_aplicar,
      novo_saldo_credito: creditoAtualizado ? creditoAtualizado.valor_total - creditoAtualizado.valor_utilizado : 0,
      novo_valor_pendente,
      novo_status,
    });
  } catch (error) {
    console.error('Erro ao aplicar crédito:', error);
    return NextResponse.json(
      { error: 'Erro ao aplicar crédito' },
      { status: 500 }
    );
  }
}
