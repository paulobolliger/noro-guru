// app/api/cron/cleanup-notifications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cleanupOldNotifications } from '@/lib/notifications/manager';
import { logger } from '@/lib/logger';

/**
 * GET /api/cron/cleanup-notifications
 *
 * Job cron para limpar notificações antigas
 * Deve ser chamado por um serviço de cron (Vercel Cron, GitHub Actions, etc)
 *
 * Recomendação: Executar 1x por dia
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autorização (secret key para crons)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      logger.security('Unauthorized cron access attempt', {
        endpoint: '/api/cron/cleanup-notifications',
        ip: request.ip,
      });
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    logger.info('Starting notification cleanup cron job');

    // Limpar notificações com mais de 30 dias que já foram lidas
    const result = await cleanupOldNotifications(30, true);

    if (!result.success) {
      logger.error('Notification cleanup failed', new Error(result.error));
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    logger.info('Notification cleanup completed', {
      deletedCount: result.count,
    });

    return NextResponse.json({
      success: true,
      deletedCount: result.count,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    logger.error('Unexpected error in cleanup cron', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
