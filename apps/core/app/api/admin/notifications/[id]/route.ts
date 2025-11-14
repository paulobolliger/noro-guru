// app/api/admin/notifications/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { markAsRead, deleteNotification } from '@/lib/notifications/manager';
import { withRateLimit, RateLimitPresets } from '@/lib/security';
import { logger } from '@/lib/logger';

/**
 * PATCH /api/admin/notifications/[id]
 *
 * Marca notificação como lida
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

      // 2. Marcar como lida
      const result = await markAsRead(params.id, user.id);

      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 400 }
        );
      }

      return NextResponse.json({ success: true });

    } catch (error: any) {
      logger.error('Error marking notification as read', error);
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }
  });
}

/**
 * DELETE /api/admin/notifications/[id]
 *
 * Deleta uma notificação
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

      // 2. Deletar notificação
      const result = await deleteNotification(params.id, user.id);

      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 400 }
        );
      }

      return NextResponse.json({ success: true });

    } catch (error: any) {
      logger.error('Error deleting notification', error);
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }
  });
}
