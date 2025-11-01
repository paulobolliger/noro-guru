import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const TENANT_ID = 'd43ef2d2-cbf1-4133-b805-77c3f6444bc2';

// POST - Gerar parcelas automaticamente
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { id } = params;
    const body = await request.json();
    
    // Validações
    if (!body.numero_parcelas || body.numero_parcelas < 2) {
      return NextResponse.json(
        { error: 'Número de parcelas deve ser maior ou igual a 2' },
        { status: 400 }
      );
    }
    
    // Buscar duplicata
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
    
    // Verificar se já existem parcelas
    const { data: parcelasExistentes } = await supabase
      .from('fin_parcelas')
      .select('id')
      .eq('duplicata_receber_id', id);
    
    if (parcelasExistentes && parcelasExistentes.length > 0) {
      return NextResponse.json(
        { error: 'Esta duplicata já possui parcelas cadastradas' },
        { status: 400 }
      );
    }
    
    // Calcular valores das parcelas
    const valorParcela = Math.floor((duplicata.valor_total / body.numero_parcelas) * 100) / 100;
    const diferenca = duplicata.valor_total - (valorParcela * body.numero_parcelas);
    
    // Intervalo entre parcelas (padrão 30 dias)
    const intervaloDias = body.intervalo_dias || 30;
    
    // Data base (padrão é a data de vencimento da duplicata)
    const dataBase = body.data_primeira_parcela 
      ? new Date(body.data_primeira_parcela)
      : new Date(duplicata.data_vencimento);
    
    // Gerar parcelas
    const parcelas = [];
    for (let i = 0; i < body.numero_parcelas; i++) {
      const dataVencimento = new Date(dataBase);
      dataVencimento.setDate(dataVencimento.getDate() + (i * intervaloDias));
      
      // Última parcela recebe a diferença de arredondamento
      const valor = i === body.numero_parcelas - 1 
        ? valorParcela + diferenca 
        : valorParcela;
      
      parcelas.push({
        tenant_id: TENANT_ID,
        duplicata_receber_id: id,
        duplicata_pagar_id: null,
        numero_parcela: i + 1,
        valor: valor,
        valor_pago: 0,
        data_vencimento: dataVencimento.toISOString().split('T')[0],
        data_pagamento: null,
        status: 'aberta',
        observacoes: body.observacoes || null,
      });
    }
    
    // Inserir parcelas
    const { data, error } = await supabase
      .from('fin_parcelas')
      .insert(parcelas)
      .select();
    
    if (error) {
      console.error('Erro ao gerar parcelas:', error);
      return NextResponse.json(
        { error: 'Erro ao gerar parcelas', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      parcelas: data,
      total_parcelas: data.length,
      valor_total: duplicata.valor_total,
    });
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    );
  }
}
