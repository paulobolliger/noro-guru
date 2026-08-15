import { NextResponse } from 'next/server';
import { updateAndLockDailyRates } from '@noro/lib';

export const dynamic = 'force-dynamic';

/**
 * Cron Job executado diariamente às 09:15 AM (Horário de Brasília) / 12:15 UTC.
 * Atualiza e trava a cotação PTAX Venda do Dólar e Euro com os Spreads Master.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const authHeader = req.headers.get('authorization');
    const token = searchParams.get('token');

    // Validação opcional de segredo para proteger o endpoint contra execuções não autorizadas
    const cronSecret = process.env.CRON_SECRET || 'noro-guru-cron-secret-2026';
    if (token !== cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // Permite em desenvolvimento ou se bater o secret correto
      if (process.env.NODE_ENV === 'production' && !token && !authHeader) {
        return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 });
      }
    }

    console.log('[Cron Job] ⏰ Iniciando atualização diária de Câmbio PTAX às 09:15 AM...');
    const lockedRates = await updateAndLockDailyRates();

    return NextResponse.json({
      success: true,
      message: '🔒 Cotação PTAX das 09:15 AM atualizada e travada com sucesso!',
      lockedRates,
      executedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[Cron Job Error] Falha ao atualizar câmbio PTAX:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
