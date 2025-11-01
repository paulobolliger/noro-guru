import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const TENANT_ID = 'd43ef2d2-cbf1-4133-b805-77c3f6444bc2';

// GET - Buscar crédito específico com utilizações
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { id } = params;
    
    const { data, error } = await supabase
      .from('fin_creditos')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', TENANT_ID)
      .single();
    
    if (error) {
      console.error('Erro ao buscar crédito:', error);
      return NextResponse.json(
        { error: 'Crédito não encontrado' },
        { status: 404 }
      );
    }
    
    // Buscar utilizações
    const { data: utilizacoes } = await supabase
      .from('fin_utilizacoes')
      .select(`
        *,
        duplicata_pagar:fin_duplicatas_pagar(
          id,
          numero_documento,
          descricao,
          valor_total,
          data_vencimento,
          status
        )
      `)
      .eq('credito_id', id)
      .not('duplicata_pagar_id', 'is', null)
      .order('data_utilizacao', { ascending: false });
    
    const saldo_disponivel = data.valor_total - data.valor_utilizado;
    
    // Verificar se está expirado
    let status_efetivo = data.status;
    if (data.data_validade) {
      const hoje = new Date().toISOString().split('T')[0];
      if (data.data_validade < hoje && status_efetivo === 'disponivel') {
        status_efetivo = 'expirado';
      }
    }
    
    return NextResponse.json({
      ...data,
      status_efetivo,
      saldo_disponivel,
      utilizacoes: utilizacoes || [],
      total_utilizacoes: utilizacoes?.length || 0,
    });
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar crédito
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { id } = params;
    const body = await request.json();
    
    // Remover campos que não devem ser atualizados diretamente
    const { 
      id: _, 
      created_at, 
      updated_at, 
      valor_brl,
      valor_utilizado, // não pode ser atualizado manualmente
      ...updateData 
    } = body;
    
    // Validar tipo_credito se estiver sendo atualizado
    if (updateData.tipo_credito) {
      const tipos_validos = ['refund', 'overpayment', 'promotional', 'other'];
      if (!tipos_validos.includes(updateData.tipo_credito)) {
        return NextResponse.json(
          { error: `Tipo de crédito inválido. Valores aceitos: ${tipos_validos.join(', ')}` },
          { status: 400 }
        );
      }
    }
    
    // Validar que não está tentando reduzir valor_total abaixo do utilizado
    if (updateData.valor_total !== undefined) {
      const { data: creditoAtual } = await supabase
        .from('fin_creditos')
        .select('valor_utilizado')
        .eq('id', id)
        .single();
      
      if (creditoAtual && updateData.valor_total < creditoAtual.valor_utilizado) {
        return NextResponse.json(
          { error: `Valor total não pode ser menor que o valor já utilizado (${creditoAtual.valor_utilizado})` },
          { status: 400 }
        );
      }
    }
    
    const { data, error } = await supabase
      .from('fin_creditos')
      .update({
        ...updateData,
        updated_by: body.updated_by || null,
      })
      .eq('id', id)
      .eq('tenant_id', TENANT_ID)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao atualizar crédito:', error);
      return NextResponse.json(
        { error: 'Erro ao atualizar crédito', details: error.message },
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

// DELETE - Deletar crédito
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { id } = params;
    
    // Verificar se crédito foi utilizado
    const { data: credito } = await supabase
      .from('fin_creditos')
      .select('valor_utilizado')
      .eq('id', id)
      .eq('tenant_id', TENANT_ID)
      .single();
    
    if (!credito) {
      return NextResponse.json(
        { error: 'Crédito não encontrado' },
        { status: 404 }
      );
    }
    
    if (credito.valor_utilizado > 0) {
      return NextResponse.json(
        { error: 'Não é possível deletar crédito que já foi utilizado. Valor utilizado: ' + credito.valor_utilizado },
        { status: 400 }
      );
    }
    
    const { error } = await supabase
      .from('fin_creditos')
      .delete()
      .eq('id', id)
      .eq('tenant_id', TENANT_ID);
    
    if (error) {
      console.error('Erro ao deletar crédito:', error);
      return NextResponse.json(
        { error: 'Erro ao deletar crédito', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Crédito deletado com sucesso' 
    });
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    );
  }
}
