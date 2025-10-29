-- Control Plane seeds (idempotent-ish)
-- Alvos: perfis admin, lead de serviço, tarefa pendente, notificação, cliente e token público

-- 1) Vincula um usuário do Auth como admin no Control
--    Altere o email abaixo para um usuário existente em auth.users
WITH src AS (
  SELECT id, email FROM auth.users WHERE email = 'admin@noro.guru' LIMIT 1
)
INSERT INTO public.noro_users (id, email, nome, role)
SELECT id, email, 'Administrador', 'admin' FROM src
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  nome  = EXCLUDED.nome,
  role  = 'admin';

-- 2) Lead (somente colunas básicas para compatibilidade)
INSERT INTO public.noro_leads (nome, email)
VALUES ('Lead Serviço – Empresa X', 'lead.servico@noro.guru')
ON CONFLICT DO NOTHING;

-- 3) Tarefa pendente atribuída ao admin
WITH u AS (
  SELECT id FROM public.noro_users WHERE role = 'admin' ORDER BY created_at NULLS LAST LIMIT 1
)
INSERT INTO public.noro_tarefas (titulo, status, responsavel)
SELECT 'Contato comercial – Lead Serviço', 'pendente', u.id FROM u
ON CONFLICT DO NOTHING;

-- 4) Notificação para o admin logado
WITH u AS (
  SELECT id FROM public.noro_users WHERE role = 'admin' ORDER BY created_at NULLS LAST LIMIT 1
)
INSERT INTO public.noro_notificacoes (user_id, tipo, titulo, mensagem)
SELECT u.id, 'info', 'Boas‑vindas', 'Seu Control Plane está pronto.' FROM u
ON CONFLICT DO NOTHING;

-- 5) Cliente e token público para testar o formulário
WITH novo_cliente AS (
  INSERT INTO public.noro_clientes (nome, email)
  VALUES ('Cliente Teste – Control', 'cliente.control@noro.guru')
  ON CONFLICT (email) DO UPDATE SET nome = EXCLUDED.nome
  RETURNING id
)
INSERT INTO public.noro_update_tokens (token, cliente_id, expires_at)
SELECT gen_random_uuid(), id, now() + interval '48 hours' FROM novo_cliente
ON CONFLICT DO NOTHING
RETURNING token;

-- 6) Métricas (verificação manual)
-- SELECT public.get_dashboard_metrics(30);

