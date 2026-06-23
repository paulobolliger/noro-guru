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

export async function bulkMarkAsRead(notificationIds: string[]) {
  const { client, close } = createDatabaseClient();
  try {
    await client`
      UPDATE comunicacao.notificacoes
      SET lida = TRUE
      WHERE id = ANY(${notificationIds})
    `;
    revalidatePath('/notificacoes');
    return { ok: true, count: notificationIds.length };
  } catch (error) {
    console.error('Falha ao marcar notificações como lidas:', error);
    throw new Error('Falha ao marcar notificações como lidas');
  } finally {
    await close();
  }
}

export async function bulkDeleteNotifications(notificationIds: string[]) {
  const { client, close } = createDatabaseClient();
  try {
    await client`
      DELETE FROM comunicacao.notificacoes
      WHERE id = ANY(${notificationIds})
    `;
    revalidatePath('/notificacoes');
    return { ok: true, count: notificationIds.length };
  } catch (error) {
    console.error('Falha ao excluir notificações:', error);
    throw new Error('Falha ao excluir notificações');
  } finally {
    await close();
  }
}
