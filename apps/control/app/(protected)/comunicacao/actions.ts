'use server';

import { getSupabaseServer } from '@/lib/supabaseServer';

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

// =====================================================
// ACTIONS - Funções Server-Side
// =====================================================

// Mock data removido - agora usando Supabase real
/* Mock data para referência:
const mockConversations: Conversation[] = [
  {
    id: '1',
    client_name: 'João Silva',
    client_email: 'joao@empresa.com',
    status: 'active',
    last_message: 'Preciso de ajuda com a configuração do financeiro',
    last_message_at: new Date(Date.now() - 5 * 60000), // 5 min atrás
    unread_count: 3,
    assigned_to: 'você',
    created_at: new Date(Date.now() - 30 * 60000),
  },
  {
    id: '2',
    client_name: 'Maria Santos',
    client_email: 'maria@startup.com.br',
    status: 'waiting',
    last_message: 'Entendi, aguardo retorno então',
    last_message_at: new Date(Date.now() - 15 * 60000),
    unread_count: 0,
    assigned_to: 'você',
    created_at: new Date(Date.now() - 45 * 60000),
  },
  {
    id: '3',
    client_name: 'Pedro Oliveira',
    client_email: 'pedro@tech.io',
    status: 'active',
    last_message: 'Como faço para integrar com a API?',
    last_message_at: new Date(Date.now() - 2 * 60000),
    unread_count: 1,
    created_at: new Date(Date.now() - 10 * 60000),
  },
  {
    id: '4',
    client_name: 'Ana Costa',
    client_email: 'ana@loja.com',
    status: 'closed',
    last_message: 'Perfeito! Muito obrigada pela ajuda!',
    last_message_at: new Date(Date.now() - 60 * 60000),
    unread_count: 0,
    assigned_to: 'você',
    created_at: new Date(Date.now() - 120 * 60000),
  },
];

const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      conversation_id: '1',
      sender: 'client',
      message: 'Olá! Estou com dificuldade para configurar o módulo financeiro',
      created_at: new Date(Date.now() - 30 * 60000),
      read: true,
    },
    {
      id: 'm2',
      conversation_id: '1',
      sender: 'agent',
      message: 'Olá João! Claro, posso ajudar. Qual é a dificuldade específica?',
      created_at: new Date(Date.now() - 28 * 60000),
      read: true,
    },
    {
      id: 'm3',
      conversation_id: '1',
      sender: 'client',
      message: 'Não consigo criar categorias de despesas',
      created_at: new Date(Date.now() - 25 * 60000),
      read: true,
    },
    {
      id: 'm4',
      conversation_id: '1',
      sender: 'client',
      message: 'O botão não aparece para mim',
      created_at: new Date(Date.now() - 10 * 60000),
      read: false,
    },
    {
      id: 'm5',
      conversation_id: '1',
      sender: 'client',
      message: 'Preciso de ajuda com a configuração do financeiro',
      created_at: new Date(Date.now() - 5 * 60000),
      read: false,
    },
  ],
  '2': [
    {
      id: 'm6',
      conversation_id: '2',
      sender: 'client',
      message: 'Bom dia! Gostaria de saber sobre os planos disponíveis',
      created_at: new Date(Date.now() - 45 * 60000),
      read: true,
    },
    {
      id: 'm7',
      conversation_id: '2',
      sender: 'bot',
      message: 'Olá! Temos 3 planos: Free, Professional e Enterprise. Posso detalhar cada um?',
      created_at: new Date(Date.now() - 40 * 60000),
      read: true,
    },
    {
      id: 'm8',
      conversation_id: '2',
      sender: 'client',
      message: 'Sim, por favor! Principalmente o Professional',
      created_at: new Date(Date.now() - 38 * 60000),
      read: true,
    },
    {
      id: 'm9',
      conversation_id: '2',
      sender: 'agent',
      message: 'O Professional inclui todos os recursos, até 5 usuários, suporte prioritário por R$ 197/mês. Quer testar gratuitamente por 14 dias?',
      created_at: new Date(Date.now() - 20 * 60000),
      read: true,
    },
    {
      id: 'm10',
      conversation_id: '2',
      sender: 'client',
      message: 'Entendi, aguardo retorno então',
      created_at: new Date(Date.now() - 15 * 60000),
      read: true,
    },
  ],
  '3': [
    {
      id: 'm11',
      conversation_id: '3',
      sender: 'client',
      message: 'Como faço para integrar com a API?',
      created_at: new Date(Date.now() - 2 * 60000),
      read: false,
    },
  ],
  '4': [
    {
      id: 'm12',
      conversation_id: '4',
      sender: 'client',
      message: 'Consegui resolver o problema!',
      created_at: new Date(Date.now() - 65 * 60000),
      read: true,
    },
    {
      id: 'm13',
      conversation_id: '4',
      sender: 'agent',
      message: 'Que ótimo! Fico feliz em saber. Precisa de mais alguma coisa?',
      created_at: new Date(Date.now() - 62 * 60000),
      read: true,
    },
    {
      id: 'm14',
      conversation_id: '4',
      sender: 'client',
      message: 'Perfeito! Muito obrigada pela ajuda!',
      created_at: new Date(Date.now() - 60 * 60000),
      read: true,
    },
  ],
};
*/
// =====================================================

export async function getConversations(): Promise<Conversation[]> {
  try {
    const supabase = getSupabaseServer();
    
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('last_message_at', { ascending: false });
    
    if (error) {
      console.error('[getConversations] Error:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('[getConversations] Exception:', error);
    return [];
  }
}

export async function getConversationMessages(conversationId: string): Promise<Message[]> {
  try {
    const supabase = getSupabaseServer();
    
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('[getConversationMessages] Error:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('[getConversationMessages] Exception:', error);
    return [];
  }
}

export async function sendMessage(conversationId: string, message: string): Promise<Message> {
  try {
    const supabase = getSupabaseServer();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender: 'agent',
        sender_id: user?.id,
        sender_name: user?.email?.split('@')[0] || 'Atendente',
        message,
      })
      .select()
      .single();
    
    if (error) {
      console.error('[sendMessage] Error:', error);
      throw new Error('Erro ao enviar mensagem');
    }
    
    return data;
  } catch (error) {
    console.error('[sendMessage] Exception:', error);
    throw error;
  }
}

export async function updateConversationStatus(
  conversationId: string,
  status: 'active' | 'waiting' | 'closed'
): Promise<void> {
  try {
    const supabase = getSupabaseServer();
    
    const updateData: any = { status };
    
    // Se estiver fechando, adicionar closed_at
    if (status === 'closed') {
      updateData.closed_at = new Date().toISOString();
    }
    
    const { error } = await supabase
      .from('conversations')
      .update(updateData)
      .eq('id', conversationId);
    
    if (error) {
      console.error('[updateConversationStatus] Error:', error);
      throw new Error('Erro ao atualizar status');
    }
  } catch (error) {
    console.error('[updateConversationStatus] Exception:', error);
    throw error;
  }
}

export async function markMessagesAsRead(conversationId: string): Promise<void> {
  try {
    const supabase = getSupabaseServer();
    
    // Usar a function SQL que criamos
    const { error } = await supabase.rpc('mark_conversation_as_read', {
      conv_id: conversationId
    });
    
    if (error) {
      console.error('[markMessagesAsRead] Error:', error);
      // Não throw error aqui, é uma operação secundária
    }
  } catch (error) {
    console.error('[markMessagesAsRead] Exception:', error);
  }
}

export async function createConversation(data: {
  tenant_id: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  initial_message?: string;
}): Promise<Conversation> {
  try {
    const supabase = getSupabaseServer();
    
    const { data: conversation, error } = await supabase
      .from('conversations')
      .insert({
        tenant_id: data.tenant_id,
        client_name: data.client_name,
        client_email: data.client_email,
        client_phone: data.client_phone,
        status: 'active',
        last_message: data.initial_message || 'Nova conversa iniciada',
        last_message_sender: 'client',
      })
      .select()
      .single();
    
    if (error) {
      console.error('[createConversation] Error:', error);
      throw new Error('Erro ao criar conversa');
    }
    
    // Se houver mensagem inicial, criar a mensagem
    if (data.initial_message && conversation) {
      await supabase
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          sender: 'client',
          sender_name: data.client_name,
          message: data.initial_message,
        });
    }
    
    return conversation;
  } catch (error) {
    console.error('[createConversation] Exception:', error);
    throw error;
  }
}
