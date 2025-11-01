# 🚀 Guia de Implementação - Sistema de Chat

## 📋 Índice
1. [Executar Migrations](#1-executar-migrations)
2. [Atualizar Actions do Control](#2-atualizar-actions)
3. [Configurar Supabase Realtime](#3-configurar-realtime)
4. [Testar o Sistema](#4-testar)

---

## 1. Executar Migrations

### 🔧 Opção A: Via Supabase CLI (Recomendado)

```powershell
# Navegar até a raiz do projeto
cd C:\1-Projetos-Sites\GitHub\noro-guru

# Aplicar migrations
supabase db push

# Ou aplicar migrations específicas
supabase migration up --db-url "sua-connection-string"
```

### 🔧 Opção B: Via Dashboard do Supabase

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Cole o conteúdo de cada migration na ordem:
   - `20251101000000_chat_system.sql`
   - `20251101000001_chat_system_seed.sql`
5. Execute cada uma

### 🔧 Opção C: Via psql (Terminal)

```powershell
# Conectar ao banco
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"

# Executar migrations
\i supabase/migrations/20251101000000_chat_system.sql
\i supabase/migrations/20251101000001_chat_system_seed.sql
```

---

## 2. Atualizar Actions do Control

Substituir o mock data em `/apps/control/app/(protected)/comunicacao/actions.ts`:

### 📝 Exemplo de Query Real

```typescript
'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export type Conversation = {
  id: string;
  client_name: string;
  client_email: string;
  status: 'active' | 'waiting' | 'closed';
  last_message: string;
  last_message_at: Date;
  unread_count: number;
  assigned_to?: string;
  created_at: Date;
};

export async function getConversations(): Promise<Conversation[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .order('last_message_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
  
  return data;
}

export async function getConversationMessages(conversationId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
  
  return data;
}

export async function sendMessage(conversationId: string, message: string) {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender: 'agent',
      sender_id: user?.id,
      message,
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error sending message:', error);
    throw error;
  }
  
  return data;
}

export async function updateConversationStatus(
  conversationId: string,
  status: 'active' | 'waiting' | 'closed'
) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('conversations')
    .update({ status })
    .eq('id', conversationId);
  
  if (error) {
    console.error('Error updating status:', error);
    throw error;
  }
}

export async function markMessagesAsRead(conversationId: string) {
  const supabase = createClient();
  
  // Usar a function SQL que criamos
  const { error } = await supabase.rpc('mark_conversation_as_read', {
    conv_id: conversationId
  });
  
  if (error) {
    console.error('Error marking as read:', error);
  }
}
```

---

## 3. Configurar Supabase Realtime

### 📡 A. Habilitar Realtime nas Tabelas

Via Dashboard:
1. Vá em **Database** → **Replication**
2. Habilite replicação para:
   - `conversations`
   - `messages`

Via SQL:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
```

### 📡 B. Implementar Subscriptions no Client

Criar `/apps/control/hooks/useRealtimeMessages.ts`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Message } from '../app/(protected)/comunicacao/actions';

export function useRealtimeMessages(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const supabase = createClient();

  useEffect(() => {
    // Fetch initial messages
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      
      if (data) setMessages(data);
    };
    
    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((current) => [...current, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  return messages;
}
```

### 📡 C. Usar no Componente

Atualizar `ChatConversationClient.tsx`:

```typescript
'use client';

import { useRealtimeMessages } from '@/hooks/useRealtimeMessages';

export default function ChatConversationClient({ conversation, initialMessages }) {
  // Substituir useState por:
  const messages = useRealtimeMessages(conversation.id);
  
  // Resto do código permanece igual...
}
```

---

## 4. Testar o Sistema

### ✅ Checklist de Testes

#### Backend (Supabase)
- [ ] Tabelas criadas corretamente
- [ ] Respostas automáticas inseridas
- [ ] RLS funcionando (testar com usuário real)
- [ ] Triggers atualizando contadores
- [ ] Function `mark_conversation_as_read` funcionando

#### Frontend (Control)
- [ ] Dashboard carrega conversas do banco
- [ ] Filtros e busca funcionando
- [ ] Abrir conversa individual
- [ ] Enviar mensagem persiste no banco
- [ ] Mensagens aparecem em tempo real
- [ ] Mudar status atualiza no banco
- [ ] Contador de não lidas atualiza

#### Chatbot
- [ ] Configurações salvam no banco
- [ ] Respostas automáticas funcionam
- [ ] Adicionar/remover triggers

### 🧪 Query de Teste

```sql
-- Verificar estrutura
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%conversation%' OR table_name LIKE '%message%';

-- Verificar respostas automáticas
SELECT tenant_id, trigger, response, enabled 
FROM chatbot_auto_responses;

-- Verificar RLS
SELECT tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('conversations', 'messages');
```

---

## 5. Próximos Passos Opcionais

### 🎨 Melhorias de UX
- [ ] Notificações push (Web Push API)
- [ ] Som ao receber mensagem
- [ ] Indicador "digitando..."
- [ ] Confirmação de leitura duplo check ✓✓

### 🤖 IA e Automação
- [ ] Integrar OpenAI para respostas inteligentes
- [ ] Análise de sentimento
- [ ] Sugestões de resposta rápida
- [ ] Classificação automática de tickets

### 📊 Analytics
- [ ] Tempo médio de resposta
- [ ] Taxa de resolução
- [ ] Satisfação do cliente (CSAT)
- [ ] Dashboard de métricas

---

## 🆘 Troubleshooting

### Erro: "relation does not exist"
- ✅ Verificar se migrations foram executadas
- ✅ Verificar schema correto (public)
- ✅ Reiniciar conexão com banco

### Erro: "permission denied"
- ✅ Verificar RLS policies
- ✅ Verificar se usuário está autenticado
- ✅ Verificar se user_tenants está configurado

### Realtime não funciona
- ✅ Verificar se tabelas estão na replication
- ✅ Verificar se channel está subscribed
- ✅ Verificar console do navegador

---

## 📚 Documentação Útil

- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Triggers](https://www.postgresql.org/docs/current/sql-createtrigger.html)

---

**✨ Sistema pronto para produção!**
