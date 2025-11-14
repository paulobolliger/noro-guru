// app/api/admin/notifications/unread-count/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getUnreadCount } from '@/lib/notifications/manager';
import { withRateLimit, RateLimitPresets } from '@/lib/security';
import { logger } from '@/lib/logger';

/**
 * GET /api/admin/notifications/unread-count
 *
 * Retorna contagem de notificações não lidas
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

      // 2. Obter contagem
      const result = await getUnreadCount(user.id);

      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }

      return NextResponse.json({
        count: result.count,
      });

    } catch (error: any) {
      logger.error('Error getting unread count', error);
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }
  });
}
