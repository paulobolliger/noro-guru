'use server';

import { createServerSupabaseClient } from "@noro/lib/supabase/server";
import { revalidatePath } from 'next/cache';

export async function markNotificationAsRead(notificationId: string) {
  const supabase = createServerSupabaseClient();
  
  const { error } = await supabase
    .schema('comunicacao').from('notificacoes')
    .update({ lida: true })
    .eq('id', notificationId);
  
  if (error) {
    throw new Error('Falha ao marcar notificação como lida');
  }
  
  revalidatePath('/notificacoes');
  return { ok: true };
}
