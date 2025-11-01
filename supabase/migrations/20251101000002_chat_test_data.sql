-- Migration: Create test conversation data
-- Description: Adds sample conversations and messages for testing the chat system

-- Insert test conversations for each tenant
INSERT INTO conversations (tenant_id, client_name, client_email, status, unread_count, message_count)
SELECT 
  t.id,
  'João Silva' as client_name,
  'joao.silva@example.com' as client_email,
  'active' as status,
  3 as unread_count,
  5 as message_count
FROM tenants t
WHERE EXISTS (SELECT 1 FROM tenants WHERE id = t.id);

INSERT INTO conversations (tenant_id, client_name, client_email, status, unread_count, message_count)
SELECT 
  t.id,
  'Maria Santos' as client_name,
  'maria.santos@example.com' as client_email,
  'waiting' as status,
  2 as unread_count,
  3 as message_count
FROM tenants t
WHERE EXISTS (SELECT 1 FROM tenants WHERE id = t.id);

INSERT INTO conversations (tenant_id, client_name, client_email, status, unread_count, message_count)
SELECT 
  t.id,
  'Pedro Costa' as client_name,
  'pedro.costa@example.com' as client_email,
  'closed' as status,
  0 as unread_count,
  8 as message_count
FROM tenants t
WHERE EXISTS (SELECT 1 FROM tenants WHERE id = t.id);

-- Insert test messages for the active conversations
-- We need to use a DO block to get the conversation IDs dynamically
DO $$
DECLARE
  conv_record RECORD;
  msg_time TIMESTAMP;
BEGIN
  -- For each active conversation (João Silva)
  FOR conv_record IN 
    SELECT id, tenant_id FROM conversations WHERE client_email = 'joao.silva@example.com'
  LOOP
    msg_time := NOW() - INTERVAL '30 minutes';
    
    -- Customer messages
    INSERT INTO messages (conversation_id, sender, message, read, created_at)
    VALUES 
      (conv_record.id, 'client', 'Olá, preciso de ajuda com minha conta', true, msg_time),
      (conv_record.id, 'client', 'Não consigo fazer login', false, msg_time + INTERVAL '2 minutes'),
      (conv_record.id, 'client', 'Pode me ajudar?', false, msg_time + INTERVAL '5 minutes');
    
    -- Agent responses
    INSERT INTO messages (conversation_id, sender, message, read, created_at)
    VALUES 
      (conv_record.id, 'agent', 'Olá João! Claro, vou te ajudar.', true, msg_time + INTERVAL '1 minute'),
      (conv_record.id, 'agent', 'Qual mensagem de erro você está vendo?', true, msg_time + INTERVAL '3 minutes');
  END LOOP;

  -- For each waiting conversation (Maria Santos)
  FOR conv_record IN 
    SELECT id, tenant_id FROM conversations WHERE client_email = 'maria.santos@example.com'
  LOOP
    msg_time := NOW() - INTERVAL '2 hours';
    
    INSERT INTO messages (conversation_id, sender, message, read, created_at)
    VALUES 
      (conv_record.id, 'client', 'Gostaria de saber sobre os planos disponíveis', false, msg_time),
      (conv_record.id, 'client', 'Vocês têm plano para pequenas empresas?', false, msg_time + INTERVAL '5 minutes');
    
    -- Bot response
    INSERT INTO messages (conversation_id, sender, message, read, created_at)
    VALUES 
      (conv_record.id, 'bot', 'Olá! Obrigado por entrar em contato. Um de nossos atendentes responderá em breve.', true, msg_time + INTERVAL '1 minute');
  END LOOP;

  -- For each closed conversation (Pedro Costa)
  FOR conv_record IN 
    SELECT id, tenant_id FROM conversations WHERE client_email = 'pedro.costa@example.com'
  LOOP
    msg_time := NOW() - INTERVAL '1 day';
    
    INSERT INTO messages (conversation_id, sender, message, read, created_at)
    VALUES 
      (conv_record.id, 'client', 'Qual o prazo de entrega?', true, msg_time),
      (conv_record.id, 'agent', 'O prazo é de 5 dias úteis.', true, msg_time + INTERVAL '10 minutes'),
      (conv_record.id, 'client', 'E se eu precisar urgente?', true, msg_time + INTERVAL '15 minutes'),
      (conv_record.id, 'agent', 'Temos entrega expressa em 2 dias por R$ 50,00 adicional.', true, msg_time + INTERVAL '20 minutes'),
      (conv_record.id, 'client', 'Perfeito, vou querer a expressa!', true, msg_time + INTERVAL '25 minutes'),
      (conv_record.id, 'agent', 'Ótimo! Já atualizei seu pedido.', true, msg_time + INTERVAL '30 minutes'),
      (conv_record.id, 'client', 'Muito obrigado!', true, msg_time + INTERVAL '32 minutes'),
      (conv_record.id, 'agent', 'Por nada! Qualquer dúvida, estamos à disposição.', true, msg_time + INTERVAL '35 minutes');
  END LOOP;
END $$;

-- Update last_message_at for all test conversations
UPDATE conversations 
SET last_message_at = (
  SELECT MAX(created_at) 
  FROM messages 
  WHERE messages.conversation_id = conversations.id
)
WHERE client_email IN ('joao.silva@example.com', 'maria.santos@example.com', 'pedro.costa@example.com');

-- Update first_response_at for conversations
UPDATE conversations
SET first_response_at = created_at + INTERVAL '1 minute',
    first_response_time_seconds = 60
WHERE client_email = 'joao.silva@example.com';

UPDATE conversations
SET first_response_at = created_at + INTERVAL '1 minute',
    first_response_time_seconds = 60
WHERE client_email = 'maria.santos@example.com';

UPDATE conversations
SET first_response_at = created_at + INTERVAL '10 minutes',
    first_response_time_seconds = 600
WHERE client_email = 'pedro.costa@example.com';
