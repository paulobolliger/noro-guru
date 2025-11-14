import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentTenantId } from '@/lib/tenant';


// GET - Buscar adiantamento específico com utilizações
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const tenantId = await getCurrentTenantId();
    const { id } = params;
    
    const { data, error } = await supabase
      .from('fin_adiantamentos')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .single();
    
    if (error) {
      console.error('Erro ao buscar adiantamento:', error);
      return NextResponse.json(
        { error: 'Adiantamento não encontrado' },
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
      .eq('adiantamento_id', id)
      .not('duplicata_pagar_id', 'is', null)
      .order('data_utilizacao', { ascending: false });
    
    const saldo_disponivel = data.valor_total - data.valor_utilizado;
    
    return NextResponse.json({
      ...data,
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

// PUT - Atualizar adiantamento
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const tenantId = await getCurrentTenantId();
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
    
    // Validar que não está tentando reduzir valor_total abaixo do utilizado
    if (updateData.valor_total !== undefined) {
      const { data: adiantamentoAtual } = await supabase
        .from('fin_adiantamentos')
        .select('valor_utilizado')
        .eq('id', id)
        .single();
      
      if (adiantamentoAtual && updateData.valor_total < adiantamentoAtual.valor_utilizado) {
        return NextResponse.json(
          { error: `Valor total não pode ser menor que o valor já utilizado (${adiantamentoAtual.valor_utilizado})` },
          { status: 400 }
        );
      }
    }
    
    const { data, error } = await supabase
      .from('fin_adiantamentos')
      .update({
        ...updateData,
        updated_by: body.updated_by || null,
      })
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao atualizar adiantamento:', error);
      return NextResponse.json(
        { error: 'Erro ao atualizar adiantamento', details: error.message },
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

// DELETE - Deletar adiantamento
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const tenantId = await getCurrentTenantId();
    const { id } = params;
    
    // Verificar se adiantamento foi utilizado
    const { data: adiantamento } = await supabase
      .from('fin_adiantamentos')
      .select('valor_utilizado')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .single();
    
    if (!adiantamento) {
      return NextResponse.json(
        { error: 'Adiantamento não encontrado' },
        { status: 404 }
      );
    }
    
    if (adiantamento.valor_utilizado > 0) {
      return NextResponse.json(
        { error: 'Não é possível deletar adiantamento que já foi utilizado. Valor utilizado: ' + adiantamento.valor_utilizado },
        { status: 400 }
      );
    }
    
    const { error } = await supabase
      .from('fin_adiantamentos')
      .delete()
      .eq('id', id)
      .eq('tenant_id', tenantId);
    
    if (error) {
      console.error('Erro ao deletar adiantamento:', error);
      return NextResponse.json(
        { error: 'Erro ao deletar adiantamento', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Adiantamento deletado com sucesso' 
    });
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    );
  }
}
