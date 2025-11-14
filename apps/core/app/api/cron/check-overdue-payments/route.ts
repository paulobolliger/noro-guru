// app/api/cron/check-overdue-payments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createNotification } from '@/lib/notifications/manager';
import { NotificationType } from '@/lib/schemas/notificacao.schema';
import { logger } from '@/lib/logger';

/**
 * GET /api/cron/check-overdue-payments
 *
 * Verifica pagamentos vencidos e envia lembretes
 *
 * Recomendação: Executar 1x por dia às 10h
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autorização
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      logger.security('Unauthorized cron access attempt', {
        endpoint: '/api/cron/check-overdue-payments',
        ip: request.ip,
      });
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    logger.info('Starting overdue payments check cron job');

    const supabase = createServerSupabaseClient();
    const today = new Date().toISOString();
    let notificationsSent = 0;

    // Buscar pagamentos pendentes que já venceram
    const { data: payments, error } = await supabase
      .from('noro_pagamentos')
      .select(`
        id,
        valor,
        moeda,
        data_vencimento,
        pedido_id,
        cliente_id,
        noro_pedidos (
          numero_pedido,
          destino
        )
      `)
      .eq('status', 'pendente')
      .not('data_vencimento', 'is', null)
      .lt('data_vencimento', today);

    if (error) {
      logger.error('Error fetching overdue payments', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    if (!payments || payments.length === 0) {
      logger.info('No overdue payments found');
      return NextResponse.json({
        success: true,
        notificationsSent: 0,
        timestamp: new Date().toISOString(),
      });
    }

    // Enviar notificações
    for (const payment of payments) {
      try {
        const pedido = Array.isArray(payment.noro_pedidos)
          ? payment.noro_pedidos[0]
          : payment.noro_pedidos;

        const daysOverdue = Math.floor(
          (Date.now() - new Date(payment.data_vencimento).getTime()) / (1000 * 60 * 60 * 24)
        );

        await createNotification({
          user_id: payment.cliente_id,
          tipo: NotificationType.WARNING,
          titulo: 'Pagamento Vencido',
          mensagem: `Pagamento de ${payment.moeda} ${payment.valor.toFixed(2)} venceu há ${daysOverdue} dias${
            pedido?.numero_pedido ? ` (Reserva #${pedido.numero_pedido})` : ''
          }. Por favor, regularize sua situação.`,
          link: `/pagamentos/${payment.id}`,
          action_label: 'Ver Detalhes',
          action_url: `/pagamentos/${payment.id}`,
          prioridade: daysOverdue > 7 ? 'urgente' : 'alta',
          metadata: {
            paymentId: payment.id,
            daysOverdue,
            amount: payment.valor,
          },
        });

        notificationsSent++;

        // TODO: Também enviar email de lembrete
        // await sendPaymentReminderEmail({...});

      } catch (error) {
        logger.error('Error sending overdue payment notification', error, {
          paymentId: payment.id,
        });
      }
    }

    logger.info('Overdue payments check completed', {
      overdueCount: payments.length,
      notificationsSent,
    });

    return NextResponse.json({
      success: true,
      overdueCount: payments.length,
      notificationsSent,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    logger.error('Unexpected error in overdue payments cron', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
