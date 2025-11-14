// app/api/admin/notifications/mark-all-read/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { markAllAsRead } from '@/lib/notifications/manager';
import { withRateLimit, RateLimitPresets } from '@/lib/security';
import { logger } from '@/lib/logger';

/**
 * POST /api/admin/notifications/mark-all-read
 *
 * Marca todas as notificações como lidas
 */
export async function POST(request: NextRequest) {
  return withRateLimit(request, RateLimitPresets.MODERATE, async () => {
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

      // 2. Marcar todas como lidas
      const result = await markAllAsRead(user.id);

      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        count: result.count,
      });

    } catch (error: any) {
      logger.error('Error marking all as read', error);
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }
  });
}
