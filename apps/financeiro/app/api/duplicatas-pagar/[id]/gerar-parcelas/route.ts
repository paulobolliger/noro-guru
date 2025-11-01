import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const TENANT_ID = 'd43ef2d2-cbf1-4133-b805-77c3f6444bc2';

/**
 * POST - Gerar parcelas para duplicata
 * 
 * Body:
 * - numero_parcelas: number (required, >= 2)
 * - intervalo_dias: number (optional, default 30)
 * - data_primeira_parcela: string (optional) - se não fornecida, usa data_vencimento
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
      numero_parcelas,
      intervalo_dias = 30,
      data_primeira_parcela,
    } = body;
    
    // Validações
    if (!numero_parcelas || numero_parcelas < 2) {
      return NextResponse.json(
        { error: 'Número de parcelas deve ser no mínimo 2' },
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
    
    // Verificar se já existem parcelas
    const { data: parcelasExistentes } = await supabase
      .from('fin_parcelas')
      .select('id')
      .eq('duplicata_pagar_id', id);
    
    if (parcelasExistentes && parcelasExistentes.length > 0) {
      return NextResponse.json(
        { error: 'Duplicata já possui parcelas cadastradas' },
        { status: 400 }
      );
    }
    
    // Calcular valor de cada parcela
    const valor_parcela = Math.floor((duplicata.valor_total / numero_parcelas) * 100) / 100;
    const diferenca = Math.round((duplicata.valor_total - (valor_parcela * numero_parcelas)) * 100) / 100;
    
    // Data base para primeira parcela
    const data_base = data_primeira_parcela || duplicata.data_vencimento;
    const data_base_obj = new Date(data_base);
    
    // Criar parcelas
    const parcelas = [];
    for (let i = 0; i < numero_parcelas; i++) {
      const data_vencimento = new Date(data_base_obj);
      data_vencimento.setDate(data_base_obj.getDate() + (i * intervalo_dias));
      
      // Última parcela recebe a diferença de arredondamento
      const valor = i === numero_parcelas - 1 
        ? valor_parcela + diferenca 
        : valor_parcela;
      
      parcelas.push({
        tenant_id: TENANT_ID,
        duplicata_pagar_id: id,
        numero_parcela: i + 1,
        valor,
        data_vencimento: data_vencimento.toISOString().split('T')[0],
        status: 'pendente',
        valor_pago: 0,
      });
    }
    
    // Inserir parcelas
    const { data: parcelasCriadas, error: parcelasError } = await supabase
      .from('fin_parcelas')
      .insert(parcelas)
      .select();
    
    if (parcelasError) {
      console.error('Erro ao criar parcelas:', parcelasError);
      return NextResponse.json(
        { error: 'Erro ao gerar parcelas', details: parcelasError.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: `${numero_parcelas} parcelas geradas com sucesso`,
      parcelas: parcelasCriadas,
      total_parcelas: numero_parcelas,
      valor_parcela,
      diferenca_ajustada: diferenca,
    });
  } catch (error) {
    console.error('Erro ao gerar parcelas:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar parcelas' },
      { status: 500 }
    );
  }
}
