'use server';

import { createDatabaseClient } from '@noro/db';
import { getLogtoContext } from '@logto/next/server-actions';
import { logtoConfig } from '@/lib/logto';

// Tipos
export type Conversation = {
  id: string;
  tenant_id: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  status: 'active' | 'waiting' | 'closed';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  last_message: string;
  last_message_at: Date;
  last_message_sender?: 'client' | 'agent' | 'bot';
  unread_count: number;
  message_count: number;
  assigned_to?: string;
  tags?: string[];
  category?: string;
  rating?: number;
  feedback?: string;
  created_at: Date;
  updated_at: Date;
  closed_at?: Date;
};

export type Message = {
  id: string;
  conversation_id: string;
  sender: 'client' | 'agent' | 'bot';
  sender_id?: string;
  sender_name?: string;
  message: string;
  message_type?: 'text' | 'image' | 'file' | 'system';
  attachments?: any[];
  metadata?: any;
  read: boolean;
  read_at?: Date;
  created_at: Date;
  updated_at: Date;
};

export async function getConversations(): Promise<Conversation[]> {
  const { client, close } = createDatabaseClient();
  try {
    const data = await client`
      SELECT *
      FROM comunicacao.conversations
      ORDER BY last_message_at DESC
    `;
    return (data || []) as any[];
  } catch (error) {
    console.error('[getConversations] Exception:', error);
    return [];
  } finally {
    await close();
  }
}

export async function getConversationMessages(conversationId: string): Promise<Message[]> {
  const { client, close } = createDatabaseClient();
  try {
    const data = await client`
      SELECT *
      FROM comunicacao.messages
      WHERE conversation_id = ${conversationId}
      ORDER BY created_at ASC
    `;
    return (data || []) as any[];
  } catch (error) {
    console.error('[getConversationMessages] Exception:', error);
    return [];
  } finally {
    await close();
  }
}

export async function sendMessage(conversationId: string, message: string): Promise<Message> {
  const ctx = await getLogtoContext(logtoConfig);
  const userId = ctx.claims?.sub;
  const userEmail = ctx.claims?.email;

  const { client, close } = createDatabaseClient();
  try {
    const [data] = await client`
      INSERT INTO comunicacao.messages (
        conversation_id, sender, sender_id, sender_name, message
      ) VALUES (
        ${conversationId}, 'agent', ${userId || null}, ${userEmail ? userEmail.split('@')[0] : 'Atendente'}, ${message}
      )
      RETURNING *
    `;
    return data as any;
  } catch (error) {
    console.error('[sendMessage] Exception:', error);
    throw error;
  } finally {
    await close();
  }
}

export async function updateConversationStatus(
  conversationId: string,
  status: 'active' | 'waiting' | 'closed'
): Promise<void> {
  const { client, close } = createDatabaseClient();
  try {
    if (status === 'closed') {
      await client`
        UPDATE comunicacao.conversations
        SET status = ${status}, closed_at = NOW()
        WHERE id = ${conversationId}
      `;
    } else {
      await client`
        UPDATE comunicacao.conversations
        SET status = ${status}
        WHERE id = ${conversationId}
      `;
    }
  } catch (error) {
    console.error('[updateConversationStatus] Exception:', error);
    throw error;
  } finally {
    await close();
  }
}

export async function markMessagesAsRead(conversationId: string): Promise<void> {
  const { client, close } = createDatabaseClient();
  try {
    await client`
      SELECT public.mark_conversation_as_read(${conversationId})
    `;
  } catch (error) {
    console.error('[markMessagesAsRead] Exception:', error);
  } finally {
    await close();
  }
}

export async function createConversation(data: {
  tenant_id: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  initial_message?: string;
}): Promise<Conversation> {
  const { client, close } = createDatabaseClient();
  try {
    const [conversation] = await client`
      INSERT INTO comunicacao.conversations (
        tenant_id, client_name, client_email, client_phone, status, last_message, last_message_sender
      ) VALUES (
        ${data.tenant_id}, ${data.client_name}, ${data.client_email}, ${data.client_phone || null}, 'active', ${data.initial_message || 'Nova conversa iniciada'}, 'client'
      )
      RETURNING *
    `;

    if (data.initial_message && conversation) {
      await client`
        INSERT INTO comunicacao.messages (
          conversation_id, sender, sender_name, message
        ) VALUES (
          ${conversation.id}, 'client', ${data.client_name}, ${data.initial_message}
        )
      `;
    }
    
    return conversation as any;
  } catch (error) {
    console.error('[createConversation] Exception:', error);
    throw error;
  } finally {
    await close();
  }
}
