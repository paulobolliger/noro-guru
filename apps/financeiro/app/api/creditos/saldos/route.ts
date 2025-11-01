import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const TENANT_ID = 'd43ef2d2-cbf1-4133-b805-77c3f6444bc2';

/**
 * GET - Buscar saldos consolidados de créditos
 * 
 * Query params:
 * - fornecedor_id: string (optional) - filtrar por fornecedor
 * - tipo_credito: string (optional) - filtrar por tipo
 * 
 * Retorna agrupamento por fornecedor e tipo usando vw_saldo_creditos
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    
    const fornecedor_id = searchParams.get('fornecedor_id');
    const tipo_credito = searchParams.get('tipo_credito');
    
    let query = supabase
      .from('vw_saldo_creditos')
      .select('*')
      .eq('tenant_id', TENANT_ID);
    
    if (fornecedor_id) {
      query = query.eq('fornecedor_id', fornecedor_id);
    }
    
    if (tipo_credito) {
      query = query.eq('tipo_credito', tipo_credito);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Erro ao buscar saldos:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar saldos de créditos', details: error.message },
        { status: 500 }
      );
    }
    
    // Calcular totais gerais
    const totais = (data || []).reduce(
      (acc: any, item: any) => ({
        total_credito: acc.total_credito + (item.total_credito || 0),
        total_utilizado: acc.total_utilizado + (item.total_utilizado || 0),
        saldo_disponivel: acc.saldo_disponivel + (item.saldo_disponivel || 0),
      }),
      { total_credito: 0, total_utilizado: 0, saldo_disponivel: 0 }
    );
    
    // Agrupamento por tipo de crédito
    const por_tipo = (data || []).reduce((acc: any, item: any) => {
      const tipo = item.tipo_credito || 'other';
      if (!acc[tipo]) {
        acc[tipo] = {
          tipo_credito: tipo,
          total_credito: 0,
          total_utilizado: 0,
          saldo_disponivel: 0,
          quantidade_creditos: 0,
        };
      }
      acc[tipo].total_credito += item.total_credito || 0;
      acc[tipo].total_utilizado += item.total_utilizado || 0;
      acc[tipo].saldo_disponivel += item.saldo_disponivel || 0;
      acc[tipo].quantidade_creditos += item.quantidade_creditos || 0;
      return acc;
    }, {});
    
    return NextResponse.json({
      data: data || [],
      totais,
      por_tipo: Object.values(por_tipo),
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
