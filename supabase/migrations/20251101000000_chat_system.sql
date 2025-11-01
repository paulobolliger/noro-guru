-- =====================================================
-- SISTEMA DE CHAT E ATENDIMENTO AO VIVO
-- Migration: 20251101000000_chat_system.sql
-- Descrição: Cria estrutura completa para chat/atendimento
-- =====================================================

-- =====================================================
-- 1. TABELA: conversations
-- Armazena as conversas/sessões de chat
-- =====================================================
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    
    -- Informações do cliente
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT,
    client_metadata JSONB DEFAULT '{}'::jsonb, -- Dados extras (user_agent, ip, etc)
    
    -- Status e controle
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'waiting', 'closed')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    
    -- Atribuição
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    assigned_at TIMESTAMPTZ,
    
    -- Última mensagem (para ordenação)
    last_message TEXT,
    last_message_at TIMESTAMPTZ DEFAULT now(),
    last_message_sender TEXT CHECK (last_message_sender IN ('client', 'agent', 'bot')),
    
    -- Contadores
    unread_count INTEGER DEFAULT 0,
    message_count INTEGER DEFAULT 0,
    
    -- Tags e categorização
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    category TEXT,
    
    -- Métricas
    first_response_at TIMESTAMPTZ,
    first_response_time_seconds INTEGER,
    resolution_time_seconds INTEGER,
    
    -- Avaliação
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    closed_at TIMESTAMPTZ
);

-- Índices para performance
CREATE INDEX idx_conversations_tenant ON public.conversations(tenant_id);
CREATE INDEX idx_conversations_status ON public.conversations(status);
CREATE INDEX idx_conversations_assigned ON public.conversations(assigned_to);
CREATE INDEX idx_conversations_last_message ON public.conversations(last_message_at DESC);
CREATE INDEX idx_conversations_client_email ON public.conversations(client_email);
CREATE INDEX idx_conversations_tags ON public.conversations USING gin(tags);

-- Comentários
COMMENT ON TABLE public.conversations IS 'Conversas/sessões de chat com clientes';
COMMENT ON COLUMN public.conversations.status IS 'active: em atendimento | waiting: aguardando cliente | closed: finalizado';
COMMENT ON COLUMN public.conversations.unread_count IS 'Quantidade de mensagens não lidas pelo agente';

-- =====================================================
-- 2. TABELA: messages
-- Armazena as mensagens individuais das conversas
-- =====================================================
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    
    -- Remetente
    sender TEXT NOT NULL CHECK (sender IN ('client', 'agent', 'bot')),
    sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Se for agent
    sender_name TEXT, -- Nome do remetente para exibição
    
    -- Conteúdo
    message TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
    
    -- Metadados
    attachments JSONB DEFAULT '[]'::jsonb, -- Array de URLs de anexos
    metadata JSONB DEFAULT '{}'::jsonb, -- Dados extras (bot_trigger, etc)
    
    -- Controle
    read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id, created_at);
CREATE INDEX idx_messages_sender ON public.messages(sender);
CREATE INDEX idx_messages_unread ON public.messages(conversation_id, read) WHERE read = false;
CREATE INDEX idx_messages_created ON public.messages(created_at DESC);

-- Comentários
COMMENT ON TABLE public.messages IS 'Mensagens individuais das conversas de chat';
COMMENT ON COLUMN public.messages.sender IS 'client: cliente | agent: atendente humano | bot: chatbot';

-- =====================================================
-- 3. TABELA: chatbot_configs
-- Configurações e respostas automáticas do chatbot
-- =====================================================
CREATE TABLE IF NOT EXISTS public.chatbot_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    
    -- Configurações gerais
    bot_enabled BOOLEAN DEFAULT true,
    bot_name TEXT DEFAULT 'Assistente Virtual',
    welcome_message TEXT DEFAULT 'Olá! Como posso ajudar você hoje?',
    
    -- Comportamento
    transfer_to_human BOOLEAN DEFAULT true,
    transfer_message TEXT DEFAULT 'Vou transferir você para um atendente humano.',
    auto_close_inactive BOOLEAN DEFAULT false,
    auto_close_minutes INTEGER DEFAULT 30,
    
    -- Horário de atendimento
    business_hours JSONB DEFAULT '{
        "enabled": false,
        "timezone": "America/Sao_Paulo",
        "schedule": {
            "monday": {"open": "09:00", "close": "18:00"},
            "tuesday": {"open": "09:00", "close": "18:00"},
            "wednesday": {"open": "09:00", "close": "18:00"},
            "thursday": {"open": "09:00", "close": "18:00"},
            "friday": {"open": "09:00", "close": "18:00"},
            "saturday": null,
            "sunday": null
        }
    }'::jsonb,
    
    -- Mensagens fora do horário
    offline_message TEXT DEFAULT 'No momento estamos fora do horário de atendimento. Deixe sua mensagem que retornaremos em breve.',
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Constraint: 1 config por tenant
    UNIQUE(tenant_id)
);

-- Índice
CREATE INDEX idx_chatbot_configs_tenant ON public.chatbot_configs(tenant_id);

-- Comentários
COMMENT ON TABLE public.chatbot_configs IS 'Configurações gerais do chatbot por tenant';

-- =====================================================
-- 4. TABELA: chatbot_auto_responses
-- Respostas automáticas configuráveis do bot
-- =====================================================
CREATE TABLE IF NOT EXISTS public.chatbot_auto_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    
    -- Trigger (palavra-chave)
    trigger TEXT NOT NULL,
    trigger_type TEXT DEFAULT 'keyword' CHECK (trigger_type IN ('keyword', 'regex', 'exact')),
    
    -- Resposta
    response TEXT NOT NULL,
    
    -- Controle
    enabled BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0, -- Ordem de prioridade (maior = primeiro)
    
    -- Estatísticas
    usage_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_auto_responses_tenant ON public.chatbot_auto_responses(tenant_id);
CREATE INDEX idx_auto_responses_enabled ON public.chatbot_auto_responses(enabled) WHERE enabled = true;
CREATE INDEX idx_auto_responses_priority ON public.chatbot_auto_responses(tenant_id, priority DESC);

-- Comentários
COMMENT ON TABLE public.chatbot_auto_responses IS 'Respostas automáticas configuráveis para o chatbot';
COMMENT ON COLUMN public.chatbot_auto_responses.trigger_type IS 'keyword: busca palavra | regex: expressão regular | exact: correspondência exata';

-- =====================================================
-- 5. TABELA: knowledge_base_articles
-- Base de conhecimento / artigos de ajuda
-- =====================================================
CREATE TABLE IF NOT EXISTS public.knowledge_base_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    
    -- Conteúdo
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    
    -- Categorização
    category TEXT NOT NULL,
    subcategory TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    
    -- Metadados
    icon TEXT, -- Lucide icon name
    color TEXT, -- Cor da categoria
    
    -- SEO
    meta_description TEXT,
    meta_keywords TEXT[],
    
    -- Ordem e visibilidade
    display_order INTEGER DEFAULT 0,
    published BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    
    -- Estatísticas
    view_count INTEGER DEFAULT 0,
    helpful_count INTEGER DEFAULT 0,
    not_helpful_count INTEGER DEFAULT 0,
    
    -- Estimativa de leitura
    read_time_minutes INTEGER,
    
    -- Relacionamentos
    related_articles UUID[] DEFAULT ARRAY[]::UUID[],
    
    -- Autor
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    published_at TIMESTAMPTZ,
    
    -- Constraints
    UNIQUE(tenant_id, slug)
);

-- Índices
CREATE INDEX idx_kb_articles_tenant ON public.knowledge_base_articles(tenant_id);
CREATE INDEX idx_kb_articles_published ON public.knowledge_base_articles(published) WHERE published = true;
CREATE INDEX idx_kb_articles_category ON public.knowledge_base_articles(category);
CREATE INDEX idx_kb_articles_tags ON public.knowledge_base_articles USING gin(tags);
CREATE INDEX idx_kb_articles_slug ON public.knowledge_base_articles(tenant_id, slug);

-- Full-text search
CREATE INDEX idx_kb_articles_search ON public.knowledge_base_articles 
    USING gin(to_tsvector('portuguese', title || ' ' || content));

-- Comentários
COMMENT ON TABLE public.knowledge_base_articles IS 'Artigos da base de conhecimento / central de ajuda';

-- =====================================================
-- 6. FUNCTIONS: Atualizar updated_at automaticamente
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para todas as tabelas
CREATE TRIGGER conversations_updated_at BEFORE UPDATE ON public.conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER messages_updated_at BEFORE UPDATE ON public.messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER chatbot_configs_updated_at BEFORE UPDATE ON public.chatbot_configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER auto_responses_updated_at BEFORE UPDATE ON public.chatbot_auto_responses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER kb_articles_updated_at BEFORE UPDATE ON public.knowledge_base_articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. FUNCTION: Atualizar contadores da conversa
-- =====================================================
CREATE OR REPLACE FUNCTION update_conversation_counters()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualizar última mensagem
    UPDATE public.conversations
    SET 
        last_message = NEW.message,
        last_message_at = NEW.created_at,
        last_message_sender = NEW.sender,
        message_count = message_count + 1,
        unread_count = CASE 
            WHEN NEW.sender = 'client' THEN unread_count + 1 
            ELSE unread_count 
        END
    WHERE id = NEW.conversation_id;
    
    -- Calcular first response time se for primeira mensagem do agente
    IF NEW.sender IN ('agent', 'bot') THEN
        UPDATE public.conversations
        SET 
            first_response_at = NEW.created_at,
            first_response_time_seconds = EXTRACT(EPOCH FROM (NEW.created_at - created_at))
        WHERE id = NEW.conversation_id 
        AND first_response_at IS NULL;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER messages_update_conversation AFTER INSERT ON public.messages
    FOR EACH ROW EXECUTE FUNCTION update_conversation_counters();

-- =====================================================
-- 8. FUNCTION: Marcar mensagens como lidas
-- =====================================================
CREATE OR REPLACE FUNCTION mark_conversation_as_read(conv_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.messages
    SET read = true, read_at = now()
    WHERE conversation_id = conv_id AND read = false;
    
    UPDATE public.conversations
    SET unread_count = 0
    WHERE id = conv_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 9. RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_auto_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base_articles ENABLE ROW LEVEL SECURITY;

-- Políticas para conversations
CREATE POLICY "Users can view conversations from their tenants"
    ON public.conversations FOR SELECT
    USING (
        tenant_id IN (
            SELECT tenant_id FROM public.user_tenants 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create conversations in their tenants"
    ON public.conversations FOR INSERT
    WITH CHECK (
        tenant_id IN (
            SELECT tenant_id FROM public.user_tenants 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update conversations in their tenants"
    ON public.conversations FOR UPDATE
    USING (
        tenant_id IN (
            SELECT tenant_id FROM public.user_tenants 
            WHERE user_id = auth.uid()
        )
    );

-- Políticas para messages
CREATE POLICY "Users can view messages from their tenant conversations"
    ON public.messages FOR SELECT
    USING (
        conversation_id IN (
            SELECT id FROM public.conversations 
            WHERE tenant_id IN (
                SELECT tenant_id FROM public.user_tenants 
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can create messages in their tenant conversations"
    ON public.messages FOR INSERT
    WITH CHECK (
        conversation_id IN (
            SELECT id FROM public.conversations 
            WHERE tenant_id IN (
                SELECT tenant_id FROM public.user_tenants 
                WHERE user_id = auth.uid()
            )
        )
    );

-- Políticas para chatbot_configs
CREATE POLICY "Users can view chatbot configs from their tenants"
    ON public.chatbot_configs FOR SELECT
    USING (
        tenant_id IN (
            SELECT tenant_id FROM public.user_tenants 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage chatbot configs in their tenants"
    ON public.chatbot_configs FOR ALL
    USING (
        tenant_id IN (
            SELECT tenant_id FROM public.user_tenants 
            WHERE user_id = auth.uid()
        )
    );

-- Políticas para auto_responses
CREATE POLICY "Users can view auto responses from their tenants"
    ON public.chatbot_auto_responses FOR SELECT
    USING (
        tenant_id IN (
            SELECT tenant_id FROM public.user_tenants 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage auto responses in their tenants"
    ON public.chatbot_auto_responses FOR ALL
    USING (
        tenant_id IN (
            SELECT tenant_id FROM public.user_tenants 
            WHERE user_id = auth.uid()
        )
    );

-- Políticas para knowledge_base_articles
CREATE POLICY "Anyone can view published articles"
    ON public.knowledge_base_articles FOR SELECT
    USING (published = true);

CREATE POLICY "Users can manage articles in their tenants"
    ON public.knowledge_base_articles FOR ALL
    USING (
        tenant_id IN (
            SELECT tenant_id FROM public.user_tenants 
            WHERE user_id = auth.uid()
        )
    );

-- =====================================================
-- 10. GRANTS (Permissões)
-- =====================================================

-- Authenticated users
GRANT SELECT, INSERT, UPDATE ON public.conversations TO authenticated;
GRANT SELECT, INSERT ON public.messages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chatbot_configs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chatbot_auto_responses TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.knowledge_base_articles TO authenticated;

-- Service role (full access)
GRANT ALL ON public.conversations TO service_role;
GRANT ALL ON public.messages TO service_role;
GRANT ALL ON public.chatbot_configs TO service_role;
GRANT ALL ON public.chatbot_auto_responses TO service_role;
GRANT ALL ON public.knowledge_base_articles TO service_role;

-- =====================================================
-- FIM DA MIGRATION
-- =====================================================
