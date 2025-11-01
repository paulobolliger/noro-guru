'use server';

import { createServerSupabaseClient } from "@noro/lib/supabase/server";
import { revalidatePath } from 'next/cache';

export async function markNotificationAsRead(notificationId: string) {
  const supabase = createServerSupabaseClient();
  
  const { error } = await supabase
    .from('noro_notificacoes')
    .update({ lida: true })
    .eq('id', notificationId);
  
  if (error) {
    throw new Error('Falha ao marcar notificação como lida');
  }
  
  revalidatePath('/notificacoes');
  return { ok: true };
}

export async function bulkMarkAsRead(notificationIds: string[]) {
  const supabase = createServerSupabaseClient();
  
  const { error } = await supabase
    .from('noro_notificacoes')
    .update({ lida: true })
    .in('id', notificationIds);
  
  if (error) {
    throw new Error('Falha ao marcar notificações como lidas');
  }
  
  revalidatePath('/notificacoes');
  return { ok: true, count: notificationIds.length };
}

export async function bulkDeleteNotifications(notificationIds: string[]) {
  const supabase = createServerSupabaseClient();
  
  const { error } = await supabase
    .from('noro_notificacoes')
    .delete()
    .in('id', notificationIds);
  
  if (error) {
    throw new Error('Falha ao excluir notificações');
  }
  
  revalidatePath('/notificacoes');
  return { ok: true, count: notificationIds.length };
}
