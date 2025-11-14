// lib/notifications/manager.ts
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getCurrentTenantId } from '@/lib/tenant';
import { logger } from '@/lib/logger';
import type {
  CreateNotificacaoInput,
  NotificationType,
} from '@/lib/schemas/notificacao.schema';

/**
 * Interface para notificação do banco
 */
export interface Notification {
  id: string;
  tenant_id: string;
  user_id: string;
  tipo: NotificationType;
  titulo: string;
  mensagem: string;
  link?: string;
  action_label?: string;
  action_url?: string;
  metadata?: Record<string, any>;
  prioridade: 'baixa' | 'normal' | 'alta' | 'urgente';
  lida: boolean;
  arquivada: boolean;
  expira_em?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Cria uma nova notificação
 */
export async function createNotification(
  input: CreateNotificacaoInput
): Promise<{ success: boolean; notification?: Notification; error?: string }> {
  try {
    const supabase = createServerSupabaseClient();
    const tenantId = await getCurrentTenantId();

    const { data, error } = await supabase
      .from('notificacoes')
      .insert({
        tenant_id: tenantId,
        user_id: input.user_id,
        tipo: input.tipo,
        titulo: input.titulo,
        mensagem: input.mensagem,
        link: input.link,
        action_label: input.action_label,
        action_url: input.action_url,
        metadata: input.metadata,
        prioridade: input.prioridade || 'normal',
        expira_em: input.expira_em,
        lida: false,
        arquivada: false,
      })
      .select()
      .single();

    if (error) {
      logger.error('Failed to create notification', error);
      return { success: false, error: error.message };
    }

    logger.info('Notification created', {
      notificationId: data.id,
      userId: input.user_id,
      type: input.tipo,
    });

    return { success: true, notification: data };
  } catch (error: any) {
    logger.error('Unexpected error creating notification', error);
    return { success: false, error: error.message };
  }
}

/**
 * Cria múltiplas notificações (útil para notificar vários usuários)
 */
export async function createBulkNotifications(
  userIds: string[],
  notification: Omit<CreateNotificacaoInput, 'user_id'>
): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    const supabase = createServerSupabaseClient();
    const tenantId = await getCurrentTenantId();

    const notifications = userIds.map((userId) => ({
      tenant_id: tenantId,
      user_id: userId,
      tipo: notification.tipo,
      titulo: notification.titulo,
      mensagem: notification.mensagem,
      link: notification.link,
      action_label: notification.action_label,
      action_url: notification.action_url,
      metadata: notification.metadata,
      prioridade: notification.prioridade || 'normal',
      expira_em: notification.expira_em,
      lida: false,
      arquivada: false,
    }));

    const { data, error } = await supabase
      .from('notificacoes')
      .insert(notifications)
      .select();

    if (error) {
      logger.error('Failed to create bulk notifications', error);
      return { success: false, error: error.message };
    }

    logger.info('Bulk notifications created', {
      count: data.length,
      type: notification.tipo,
    });

    return { success: true, count: data.length };
  } catch (error: any) {
    logger.error('Unexpected error creating bulk notifications', error);
    return { success: false, error: error.message };
  }
}

/**
 * Lista notificações de um usuário
 */
export async function listNotifications(
  userId: string,
  options: {
    lida?: boolean;
    arquivada?: boolean;
    tipo?: NotificationType;
    limit?: number;
    offset?: number;
  } = {}
): Promise<{ success: boolean; notifications?: Notification[]; total?: number; error?: string }> {
  try {
    const supabase = createServerSupabaseClient();
    const tenantId = await getCurrentTenantId();

    let query = supabase
      .from('notificacoes')
      .select('*', { count: 'exact' })
      .eq('tenant_id', tenantId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Aplicar filtros
    if (options.lida !== undefined) {
      query = query.eq('lida', options.lida);
    }
    if (options.arquivada !== undefined) {
      query = query.eq('arquivada', options.arquivada);
    }
    if (options.tipo) {
      query = query.eq('tipo', options.tipo);
    }

    // Paginação
    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      logger.error('Failed to list notifications', error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      notifications: data,
      total: count || 0,
    };
  } catch (error: any) {
    logger.error('Unexpected error listing notifications', error);
    return { success: false, error: error.message };
  }
}

/**
 * Marca uma notificação como lida
 */
export async function markAsRead(
  notificationId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerSupabaseClient();
    const tenantId = await getCurrentTenantId();

    const { error } = await supabase
      .from('notificacoes')
      .update({ lida: true, updated_at: new Date().toISOString() })
      .eq('id', notificationId)
      .eq('user_id', userId)
      .eq('tenant_id', tenantId);

    if (error) {
      logger.error('Failed to mark notification as read', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    logger.error('Unexpected error marking notification as read', error);
    return { success: false, error: error.message };
  }
}

/**
 * Marca todas as notificações como lidas
 */
export async function markAllAsRead(
  userId: string
): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    const supabase = createServerSupabaseClient();
    const tenantId = await getCurrentTenantId();

    const { data, error } = await supabase
      .from('notificacoes')
      .update({ lida: true, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('tenant_id', tenantId)
      .eq('lida', false)
      .select();

    if (error) {
      logger.error('Failed to mark all notifications as read', error);
      return { success: false, error: error.message };
    }

    logger.info('Marked all notifications as read', {
      userId,
      count: data.length,
    });

    return { success: true, count: data.length };
  } catch (error: any) {
    logger.error('Unexpected error marking all as read', error);
    return { success: false, error: error.message };
  }
}

/**
 * Deleta uma notificação
 */
export async function deleteNotification(
  notificationId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerSupabaseClient();
    const tenantId = await getCurrentTenantId();

    const { error } = await supabase
      .from('notificacoes')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', userId)
      .eq('tenant_id', tenantId);

    if (error) {
      logger.error('Failed to delete notification', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    logger.error('Unexpected error deleting notification', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtém contagem de notificações não lidas
 */
export async function getUnreadCount(
  userId: string
): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    const supabase = createServerSupabaseClient();
    const tenantId = await getCurrentTenantId();

    const { count, error } = await supabase
      .from('notificacoes')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .eq('user_id', userId)
      .eq('lida', false)
      .eq('arquivada', false);

    if (error) {
      logger.error('Failed to get unread count', error);
      return { success: false, error: error.message };
    }

    return { success: true, count: count || 0 };
  } catch (error: any) {
    logger.error('Unexpected error getting unread count', error);
    return { success: false, error: error.message };
  }
}

/**
 * Limpa notificações antigas
 */
export async function cleanupOldNotifications(
  days: number = 30,
  onlyRead: boolean = true
): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    const supabase = createServerSupabaseClient();
    const tenantId = await getCurrentTenantId();

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    let query = supabase
      .from('notificacoes')
      .delete()
      .eq('tenant_id', tenantId)
      .lt('created_at', cutoffDate.toISOString());

    if (onlyRead) {
      query = query.eq('lida', true);
    }

    const { data, error } = await query.select();

    if (error) {
      logger.error('Failed to cleanup old notifications', error);
      return { success: false, error: error.message };
    }

    logger.info('Old notifications cleaned up', {
      count: data?.length || 0,
      days,
      onlyRead,
    });

    return { success: true, count: data?.length || 0 };
  } catch (error: any) {
    logger.error('Unexpected error cleaning up notifications', error);
    return { success: false, error: error.message };
  }
}
