// app/api/cron/upcoming-trips-reminder/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { notifyUpcomingTrip } from '@/lib/notifications/templates';
import { logger } from '@/lib/logger';

/**
 * GET /api/cron/upcoming-trips-reminder
 *
 * Envia notificações sobre viagens que começam em breve
 * Notifica clientes 7, 3 e 1 dias antes da viagem
 *
 * Recomendação: Executar 1x por dia às 9h
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autorização
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      logger.security('Unauthorized cron access attempt', {
        endpoint: '/api/cron/upcoming-trips-reminder',
        ip: request.ip,
      });
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    logger.info('Starting upcoming trips reminder cron job');

    const supabase = createServerSupabaseClient();

    // Calcular datas de interesse (7, 3, 1 dias a partir de hoje)
    const today = new Date();
    const targets = [7, 3, 1];
    let notificationsSent = 0;

    for (const days of targets) {
      const targetDate = new Date(today);
      targetDate.setDate(targetDate.getDate() + days);
      targetDate.setHours(0, 0, 0, 0);

      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);

      // Buscar pedidos confirmados que começam nesta data
      const { data: pedidos, error } = await supabase
        .from('noro_pedidos')
        .select('id, cliente_id, destino, data_inicio, numero_pedido')
        .eq('status', 'confirmado')
        .gte('data_inicio', targetDate.toISOString())
        .lt('data_inicio', nextDay.toISOString());

      if (error) {
        logger.error('Error fetching upcoming trips', error);
        continue;
      }

      if (!pedidos || pedidos.length === 0) continue;

      // Enviar notificações
      for (const pedido of pedidos) {
        try {
          await notifyUpcomingTrip({
            userId: pedido.cliente_id,
            destination: pedido.destino,
            departureDate: pedido.data_inicio,
            daysUntilDeparture: days,
            bookingId: pedido.id,
          });
          notificationsSent++;
        } catch (error) {
          logger.error('Error sending trip reminder', error, {
            pedidoId: pedido.id,
          });
        }
      }

      logger.info(`Sent ${pedidos.length} reminders for trips in ${days} days`);
    }

    logger.info('Upcoming trips reminder completed', {
      notificationsSent,
    });

    return NextResponse.json({
      success: true,
      notificationsSent,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    logger.error('Unexpected error in upcoming trips cron', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
