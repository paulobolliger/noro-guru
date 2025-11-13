import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentTenantId } from '@/lib/tenant';


// GET - Buscar duplicata específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const tenantId = await getCurrentTenantId();
    const { id } = params;
    
    const { data, error } = await supabase
      .from('fin_duplicatas_receber')
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
      .eq('duplicata_receber_id', id)
      .order('numero_parcela', { ascending: true });
    
    return NextResponse.json({
      ...data,
      parcelas: parcelas || [],
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
    const { id: _, created_at, updated_at, valor_brl, dias_atraso, valor_pendente, ...updateData } = body;
    
    const { data, error } = await supabase
      .from('fin_duplicatas_receber')
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
    
    // Verificar se existem parcelas
    const { data: parcelas } = await supabase
      .from('fin_parcelas')
      .select('id')
      .eq('duplicata_receber_id', id);
    
    if (parcelas && parcelas.length > 0) {
      // Deletar parcelas primeiro (CASCADE deve fazer isso automaticamente, mas garantindo)
      await supabase
        .from('fin_parcelas')
        .delete()
        .eq('duplicata_receber_id', id);
    }
    
    const { error } = await supabase
      .from('fin_duplicatas_receber')
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
