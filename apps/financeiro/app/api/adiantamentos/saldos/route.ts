import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentTenantId } from '@/lib/tenant';


/**
 * GET - Buscar saldos consolidados de adiantamentos
 * 
 * Query params:
 * - fornecedor_id: string (optional) - filtrar por fornecedor
 * - marca: string (optional) - filtrar por marca
 * 
 * Retorna agrupamento por fornecedor e marca usando vw_saldo_adiantamentos
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const tenantId = await getCurrentTenantId();
    const { searchParams } = new URL(request.url);
    
    const fornecedor_id = searchParams.get('fornecedor_id');
    const marca = searchParams.get('marca');
    
    let query = supabase
      .from('vw_saldo_adiantamentos')
      .select('*')
      .eq('tenant_id', tenantId);
    
    if (fornecedor_id) {
      query = query.eq('fornecedor_id', fornecedor_id);
    }
    
    if (marca) {
      query = query.eq('marca', marca);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Erro ao buscar saldos:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar saldos de adiantamentos', details: error.message },
        { status: 500 }
      );
    }
    
    // Calcular totais gerais
    const totais = (data || []).reduce(
      (acc, item) => ({
        total_adiantado: acc.total_adiantado + (item.total_adiantado || 0),
        total_utilizado: acc.total_utilizado + (item.total_utilizado || 0),
        saldo_disponivel: acc.saldo_disponivel + (item.saldo_disponivel || 0),
      }),
      { total_adiantado: 0, total_utilizado: 0, saldo_disponivel: 0 }
    );
    
    return NextResponse.json({
      data: data || [],
      totais,
      total_registros: data?.length || 0,
    });
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    );
  }
}
