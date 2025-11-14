// app/api/admin/notifications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { listNotifications, getUnreadCount } from '@/lib/notifications/manager';
import { withRateLimit, RateLimitPresets } from '@/lib/security';
import { logger } from '@/lib/logger';

/**
 * GET /api/admin/notifications
 *
 * Lista notificações do usuário autenticado
 *
 * Query params:
 * - lida: boolean (opcional)
 * - arquivada: boolean (opcional)
 * - tipo: string (opcional)
 * - limit: number (opcional, default: 50)
 * - offset: number (opcional, default: 0)
 */
export async function GET(request: NextRequest) {
  return withRateLimit(request, RateLimitPresets.RELAXED, async () => {
    try {
      // 1. Verificar autenticação
      const supabase = createServerSupabaseClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        return NextResponse.json(
          { error: 'Não autenticado' },
          { status: 401 }
        );
      }

      // 2. Parsear query params
      const { searchParams } = new URL(request.url);
      const lida = searchParams.get('lida');
      const arquivada = searchParams.get('arquivada');
      const tipo = searchParams.get('tipo');
      const limit = parseInt(searchParams.get('limit') || '50');
      const offset = parseInt(searchParams.get('offset') || '0');

      // 3. Buscar notificações
      const result = await listNotifications(user.id, {
        lida: lida !== null ? lida === 'true' : undefined,
        arquivada: arquivada !== null ? arquivada === 'true' : undefined,
        tipo: tipo as any,
        limit,
        offset,
      });

      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }

      return NextResponse.json({
        notifications: result.notifications,
        total: result.total,
        limit,
        offset,
      });

    } catch (error: any) {
      logger.error('Error fetching notifications', error);
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }
  });
}
