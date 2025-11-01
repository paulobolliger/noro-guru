-- =====================================================
-- SEED DATA - SISTEMA DE CHAT
-- Migration: 20251101000001_chat_system_seed.sql
-- Descrição: Dados iniciais para o sistema de chat
-- =====================================================

-- =====================================================
-- 1. RESPOSTAS AUTOMÁTICAS PADRÃO
-- =====================================================

-- Inserir respostas automáticas para cada tenant existente
INSERT INTO public.chatbot_auto_responses (tenant_id, trigger, trigger_type, response, enabled, priority)
SELECT 
    t.id as tenant_id,
    'oi|olá|bom dia|boa tarde|boa noite|hey|hello',
    'regex',
    'Olá! 👋 Bem-vindo ao suporte ' || t.nome || '. Como posso ajudar você hoje?',
    true,
    100
FROM public.tenants t
ON CONFLICT DO NOTHING;

INSERT INTO public.chatbot_auto_responses (tenant_id, trigger, trigger_type, response, enabled, priority)
SELECT 
    t.id as tenant_id,
    'horário|atendimento|funciona|aberto',
    'regex',
    'Nosso horário de atendimento é de segunda a sexta, das 9h às 18h (horário de Brasília). Finais de semana e feriados não atendemos, mas você pode deixar sua mensagem que retornaremos assim que possível!',
    true,
    90
FROM public.tenants t
ON CONFLICT DO NOTHING;

INSERT INTO public.chatbot_auto_responses (tenant_id, trigger, trigger_type, response, enabled, priority)
SELECT 
    t.id as tenant_id,
    'preço|valor|quanto custa|plano|assinatura',
    'regex',
    'Temos 3 planos disponíveis:

📦 **Free** - Gratuito
- Recursos básicos
- 1 usuário
- Suporte por e-mail

💼 **Professional** - R$ 197/mês
- Todos os recursos
- Até 5 usuários
- Suporte prioritário
- 14 dias de teste grátis

🏢 **Enterprise** - Sob consulta
- Recursos ilimitados
- Usuários ilimitados
- Suporte dedicado
- Customizações

Gostaria de conhecer os detalhes de algum plano específico?',
    true,
    80
FROM public.tenants t
ON CONFLICT DO NOTHING;

INSERT INTO public.chatbot_auto_responses (tenant_id, trigger, trigger_type, response, enabled, priority)
SELECT 
    t.id as tenant_id,
    'teste grátis|trial|período de teste|experimentar',
    'regex',
    'Sim! Oferecemos 14 dias de teste gratuito do plano Professional, com acesso completo a todos os recursos. 🎉

✅ Não pedimos cartão de crédito para começar
✅ Cancele a qualquer momento
✅ Sem compromisso

Quer começar agora? Posso te ajudar com o cadastro!',
    true,
    75
FROM public.tenants t
ON CONFLICT DO NOTHING;

INSERT INTO public.chatbot_auto_responses (tenant_id, trigger, trigger_type, response, enabled, priority)
SELECT 
    t.id as tenant_id,
    'contato|falar|telefone|email|whatsapp',
    'regex',
    'Você pode entrar em contato conosco através de:

📧 **E-mail**: suporte@noro.guru
💬 **Chat**: Aqui mesmo! (9h-18h, seg-sex)
📱 **WhatsApp**: Em breve
🌐 **Central de Ajuda**: https://noro.guru/suporte

Como prefere que eu te ajude?',
    true,
    70
FROM public.tenants t
ON CONFLICT DO NOTHING;

INSERT INTO public.chatbot_auto_responses (tenant_id, trigger, trigger_type, response, enabled, priority)
SELECT 
    t.id as tenant_id,
    'obrigad|valeu|agradeço|muito bom',
    'regex',
    'Por nada! 😊 Fico feliz em ajudar! Se precisar de mais alguma coisa, é só chamar. Estou sempre por aqui!',
    true,
    50
FROM public.tenants t
ON CONFLICT DO NOTHING;

-- =====================================================
-- 2. CONFIGURAÇÕES PADRÃO DO CHATBOT
-- =====================================================

INSERT INTO public.chatbot_configs (
    tenant_id,
    bot_enabled,
    bot_name,
    welcome_message,
    transfer_to_human,
    transfer_message,
    auto_close_inactive,
    auto_close_minutes
)
SELECT 
    id as tenant_id,
    true,
    'Assistente Virtual',
    'Olá! 👋 Sou o assistente virtual da ' || nome || '. Como posso ajudar você hoje?',
    true,
    'Vou transferir você para um de nossos atendentes. Um momento, por favor! ⏳',
    false,
    30
FROM public.tenants
ON CONFLICT (tenant_id) DO NOTHING;

-- =====================================================
-- 3. ARTIGOS DA BASE DE CONHECIMENTO
-- =====================================================

-- Categoria: Primeiros Passos
INSERT INTO public.knowledge_base_articles (
    tenant_id,
    title,
    slug,
    content,
    excerpt,
    category,
    icon,
    color,
    tags,
    read_time_minutes,
    published,
    featured,
    display_order
)
SELECT 
    t.id,
    'Como criar sua primeira conta',
    'como-criar-conta',
    E'# Como criar sua conta no Noro.guru\n\n## Passo 1: Acesse a página inicial\n\nVisite [noro.guru](https://noro.guru) e clique em "Começar agora".\n\n## Passo 2: Preencha seus dados\n\n- Nome completo\n- E-mail válido\n- Senha segura (mínimo 8 caracteres)\n\n## Passo 3: Confirme seu e-mail\n\nVocê receberá um e-mail de confirmação. Clique no link para ativar sua conta.\n\n## Passo 4: Configure seu primeiro tenant\n\nApós confirmar, você será guiado pelo assistente de configuração inicial.\n\n## Dúvidas?\n\nSe precisar de ajuda, entre em contato com nosso suporte!',
    'Aprenda a criar sua conta e começar a usar a plataforma em menos de 5 minutos.',
    'Primeiros Passos',
    'BookOpen',
    'text-blue-500',
    ARRAY['conta', 'cadastro', 'início'],
    5,
    true,
    true,
    1
FROM public.tenants t
LIMIT 1; -- Apenas para o primeiro tenant (exemplo)

-- Adicionar mais artigos conforme necessário...

-- =====================================================
-- 4. CONVERSAS DE EXEMPLO (OPCIONAL - APENAS DEV)
-- =====================================================

-- Comentado por padrão. Descomentar apenas em ambiente de desenvolvimento.

/*
INSERT INTO public.conversations (
    tenant_id,
    client_name,
    client_email,
    status,
    last_message,
    last_message_at,
    last_message_sender,
    unread_count,
    created_at
)
SELECT 
    t.id,
    'Cliente Exemplo',
    'cliente@exemplo.com',
    'active',
    'Preciso de ajuda com a plataforma',
    now() - interval '5 minutes',
    'client',
    1,
    now() - interval '10 minutes'
FROM public.tenants t
LIMIT 1;
*/

-- =====================================================
-- FIM DO SEED
-- =====================================================
