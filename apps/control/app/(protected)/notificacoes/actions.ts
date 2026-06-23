'use server';

import { createDatabaseClient } from "@noro/db";
import { revalidatePath } from 'next/cache';

export async function markNotificationAsRead(notificationId: string) {
  const { client, close } = createDatabaseClient();
  try {
    await client`
      UPDATE comunicacao.notificacoes
      SET lida = TRUE
      WHERE id = ${notificationId}
    `;
    
    revalidatePath('/notificacoes');
    return { ok: true };
  } catch (error) {
    console.error('Falha ao marcar notificação como lida:', error);
    throw new Error('Falha ao marcar notificação como lida');
  } finally {
    await close();
  }
}
