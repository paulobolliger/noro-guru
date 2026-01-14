-- COMMUNICATION MODULE (WhatsApp, Telegram, Site Chat)
-- Sistema de Inbox Unificado (Omnichannel)

-- 1. Configuração de Canais (Por Tenant)
CREATE TABLE IF NOT EXISTS public.noro_comm_channels (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES cp.tenants(id) ON DELETE CASCADE,
    type varchar(50) NOT NULL, -- 'whatsapp', 'telegram', 'site_chat'
    name varchar(100), -- ex: "WhatsApp Comercial", "Bot Telegram"
    config jsonb DEFAULT '{}'::jsonb, -- Armazena tokens, phone_number_id, bot_token, webhook_secret, etc.
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS Channels
ALTER TABLE public.noro_comm_channels ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_mod_comm_channels_all ON public.noro_comm_channels
    USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));


-- 2. Contatos de Mensageria (Pode ser vinculado a um Lead/Cliente do CRM depois)
CREATE TABLE IF NOT EXISTS public.noro_comm_contacts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES cp.tenants(id) ON DELETE CASCADE,
    name varchar(255),
    phone varchar(50), -- Para WhatsApp
    telegram_id varchar(100), -- Para Telegram
    email varchar(255),
    avatar_url text,
    crm_customer_id uuid, -- Link opcional com tabela de clientes principal
    created_at timestamptz DEFAULT now()
);

-- RLS Contacts
ALTER TABLE public.noro_comm_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_mod_comm_contacts_all ON public.noro_comm_contacts
    USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));


-- 3. Conversas (Sessions)
CREATE TABLE IF NOT EXISTS public.noro_comm_conversations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES cp.tenants(id) ON DELETE CASCADE,
    channel_id uuid REFERENCES public.noro_comm_channels(id),
    contact_id uuid REFERENCES public.noro_comm_contacts(id),
    status varchar(50) DEFAULT 'open', -- 'open', 'closed', 'pending', 'archived'
    last_message_at timestamptz DEFAULT now(),
    unread_count int DEFAULT 0,
    assigned_to uuid REFERENCES public.users(id), -- Agente responsável
    created_at timestamptz DEFAULT now()
);

-- RLS Conversations
ALTER TABLE public.noro_comm_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_mod_comm_conversations_all ON public.noro_comm_conversations
    USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));


-- 4. Mensagens
CREATE TABLE IF NOT EXISTS public.noro_comm_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id uuid NOT NULL REFERENCES public.noro_comm_conversations(id) ON DELETE CASCADE,
    tenant_id uuid NOT NULL REFERENCES cp.tenants(id) ON DELETE CASCADE, -- Desnormalizado para facilitar RLS
    direction varchar(20) NOT NULL, -- 'inbound' (do cliente), 'outbound' (do agente/bot)
    content text, -- Texto da mensagem
    message_type varchar(20) DEFAULT 'text', -- 'text', 'image', 'file', 'audio'
    media_url text, -- Se for arquivo
    status varchar(20) DEFAULT 'sent', -- 'sent', 'delivered', 'read', 'failed'
    external_id varchar(255), -- ID da mensagem na plataforma externa (WA/Telegram)
    created_at timestamptz DEFAULT now()
);

-- RLS Messages
ALTER TABLE public.noro_comm_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_mod_comm_messages_all ON public.noro_comm_messages
    USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

-- Indexes
CREATE INDEX idx_comm_messages_conv ON public.noro_comm_messages(conversation_id);
CREATE INDEX idx_comm_conv_tenant ON public.noro_comm_conversations(tenant_id);
