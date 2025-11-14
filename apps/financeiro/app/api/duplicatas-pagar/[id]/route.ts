import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentTenantId } from '@/lib/tenant';


// GET - Buscar duplicata específica com detalhes
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const tenantId = await getCurrentTenantId();
    const { id } = params;
    
    const { data, error } = await supabase
      .from('fin_duplicatas_pagar')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .single();
    
    if (error) {
      console.error('Erro ao buscar duplicata:', error);
      return NextResponse.json(
        { error: 'Duplicata não encontrada' },
        { status: 404 }
      );
    }
    
    // Buscar parcelas se existirem
    const { data: parcelas } = await supabase
      .from('fin_parcelas')
      .select('*')
      .eq('duplicata_pagar_id', id)
      .order('numero_parcela', { ascending: true });
    
    // Buscar adiantamento vinculado se existir
    let adiantamento = null;
    if (data.adiantamento_id) {
      const { data: adiantamentoData } = await supabase
        .from('fin_adiantamentos')
        .select('*')
        .eq('id', data.adiantamento_id)
        .single();
      
      adiantamento = adiantamentoData;
    }
    
    // Buscar créditos aplicados se existirem
    const { data: creditosAplicados } = await supabase
      .from('fin_utilizacoes')
      .select(`
        *,
        credito:fin_creditos(*)
      `)
      .eq('duplicata_pagar_id', id)
      .not('credito_id', 'is', null);
    
    return NextResponse.json({
      ...data,
      parcelas: parcelas || [],
      adiantamento,
      creditos_aplicados: creditosAplicados || [],
    });
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar duplicata
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
      dias_vencimento, 
      valor_pendente,
      ...updateData 
    } = body;
    
    const { data, error } = await supabase
      .from('fin_duplicatas_pagar')
      .update({
        ...updateData,
        updated_by: body.updated_by || null,
      })
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao atualizar duplicata:', error);
      return NextResponse.json(
        { error: 'Erro ao atualizar duplicata', details: error.message },
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

// DELETE - Deletar duplicata
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const tenantId = await getCurrentTenantId();
    const { id } = params;
    
    // Buscar duplicata para reverter adiantamento/créditos se necessário
    const { data: duplicata } = await supabase
      .from('fin_duplicatas_pagar')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .single();
    
    if (duplicata) {
      // Se tinha adiantamento vinculado, reverter valor utilizado
      if (duplicata.adiantamento_id) {
        const { data: adiantamento } = await supabase
          .from('fin_adiantamentos')
          .select('valor_utilizado')
          .eq('id', duplicata.adiantamento_id)
          .single();
        
        if (adiantamento) {
          await supabase
            .from('fin_adiantamentos')
            .update({
              valor_utilizado: Math.max(0, adiantamento.valor_utilizado - duplicata.valor_total),
            })
            .eq('id', duplicata.adiantamento_id);
        }
      }
      
      // Se tinha créditos aplicados, reverter
      if (duplicata.valor_credito_aplicado > 0) {
        const { data: utilizacoes } = await supabase
          .from('fin_utilizacoes')
          .select('*')
          .eq('duplicata_pagar_id', id)
          .not('credito_id', 'is', null);
        
        if (utilizacoes) {
          for (const util of utilizacoes) {
            const { data: credito } = await supabase
              .from('fin_creditos')
              .select('valor_utilizado')
              .eq('id', util.credito_id)
              .single();
            
            if (credito) {
              await supabase
                .from('fin_creditos')
                .update({
                  valor_utilizado: Math.max(0, credito.valor_utilizado - util.valor_utilizado),
                })
                .eq('id', util.credito_id);
            }
          }
        }
      }
      
      // Deletar utilizações
      await supabase
        .from('fin_utilizacoes')
        .delete()
        .eq('duplicata_pagar_id', id);
      
      // Deletar parcelas
      await supabase
        .from('fin_parcelas')
        .delete()
        .eq('duplicata_pagar_id', id);
    }
    
    const { error } = await supabase
      .from('fin_duplicatas_pagar')
      .delete()
      .eq('id', id)
      .eq('tenant_id', tenantId);
    
    if (error) {
      console.error('Erro ao deletar duplicata:', error);
      return NextResponse.json(
        { error: 'Erro ao deletar duplicata', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, message: 'Duplicata deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    );
  }
}
