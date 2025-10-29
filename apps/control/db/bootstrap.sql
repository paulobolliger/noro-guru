-- Control Plane bootstrap (schema + RPC + seeds)
-- 1) Ajuste o email do admin na linha marcada (ADMIN_EMAIL)
-- 2) Execute inteiro no SQL Editor do Supabase (projeto do Control)

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Schema --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.noro_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  nome text,
  role text DEFAULT 'user',
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.noro_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text,
  email text,
  origem text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.noro_tarefas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text,
  status text,
  responsavel uuid REFERENCES public.noro_users(id),
  lead_id uuid REFERENCES public.noro_leads(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.noro_notificacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.noro_users(id),
  tipo text,
  titulo text,
  mensagem text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.noro_clientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text,
  email text,
  telefone text,
  whatsapp text,
  cpf text,
  passaporte text,
  data_nascimento date,
  nacionalidade text,
  profissao text,
  cnpj text,
  razao_social text,
  nome_fantasia text,
  inscricao_estadual text,
  responsavel_nome text,
  responsavel_cargo text,
  status text,
  tipo text,
  segmento text,
  nivel text,
  idioma_preferido text,
  moeda_preferida text,
  observacoes text,
  deleted_at timestamptz,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.noro_clientes_documentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid NOT NULL REFERENCES public.noro_clientes(id) ON DELETE CASCADE,
  tipo text,
  url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.noro_update_tokens (
  token uuid PRIMARY KEY,
  cliente_id uuid NOT NULL,
  expires_at timestamptz NOT NULL,
  used_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_noro_tarefas_status ON public.noro_tarefas(status);
CREATE INDEX IF NOT EXISTS idx_noro_notificacoes_user ON public.noro_notificacoes(user_id);

-- RPC -----------------------------------------------------------------------
DROP FUNCTION IF EXISTS public.get_dashboard_metrics(integer);
CREATE FUNCTION public.get_dashboard_metrics(periodo_dias integer)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'leads_ativos', (SELECT count(*) FROM public.noro_leads WHERE created_at > now() - (periodo_dias || ' days')::interval),
    'leads_novos_periodo', (SELECT count(*) FROM public.noro_leads WHERE created_at > now() - (periodo_dias || ' days')::interval),
    'pedidos_ativos', 0,
    'receita_periodo', 0,
    'taxa_conversao', 0,
    'tarefas_pendentes', (SELECT count(*) FROM public.noro_tarefas WHERE status = 'pendente')
  ) INTO result;
  RETURN result;
END;
$$;

-- Seeds ---------------------------------------------------------------------
-- (A) Promove um usuário do Auth a admin no Control (A J U S T E o email)
WITH src AS (
  SELECT id, email FROM auth.users WHERE email = 'admin@noro.guru' LIMIT 1 -- << ADMIN_EMAIL
)
INSERT INTO public.noro_users (id, email, nome, role)
SELECT id, email, 'Administrador', 'admin' FROM src
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, nome = EXCLUDED.nome, role = 'admin';

-- (B) Lead de serviço (idempotente)
INSERT INTO public.noro_leads (id, nome, email, origem)
SELECT gen_random_uuid(), 'Lead Serviço – Empresa X', 'lead.servico@noro.guru', 'site'
WHERE NOT EXISTS (
  SELECT 1 FROM public.noro_leads WHERE email = 'lead.servico@noro.guru'
);

-- (C) Tarefa pendente para admin (idempotente por título)
WITH u AS (
  SELECT id FROM public.noro_users WHERE role='admin' ORDER BY created_at NULLS LAST LIMIT 1
)
INSERT INTO public.noro_tarefas (id, titulo, status, responsavel)
SELECT gen_random_uuid(), 'Contato comercial – Lead Serviço', 'pendente', u.id FROM u
WHERE NOT EXISTS (
  SELECT 1 FROM public.noro_tarefas WHERE titulo = 'Contato comercial – Lead Serviço'
);

-- (D) Notificação de boas‑vindas (idempotente por título)
WITH u AS (
  SELECT id FROM public.noro_users WHERE role='admin' ORDER BY created_at NULLS LAST LIMIT 1
)
INSERT INTO public.noro_notificacoes (id, user_id, tipo, titulo, mensagem)
SELECT gen_random_uuid(), u.id, 'info', 'Boas‑vindas', 'Seu Control Plane está pronto.' FROM u
WHERE NOT EXISTS (
  SELECT 1 FROM public.noro_notificacoes WHERE titulo = 'Boas‑vindas'
);

-- (E) Cliente + token público para testar formulário
WITH c AS (
  INSERT INTO public.noro_clientes (id, nome, email)
  SELECT gen_random_uuid(), 'Cliente Teste – Control', 'cliente.control@noro.guru'
  WHERE NOT EXISTS (
    SELECT 1 FROM public.noro_clientes WHERE email='cliente.control@noro.guru'
  )
  RETURNING id
), cid AS (
  SELECT id FROM c
  UNION ALL
  SELECT id FROM public.noro_clientes WHERE email='cliente.control@noro.guru'
), tok AS (
  INSERT INTO public.noro_update_tokens (token, cliente_id, expires_at)
  SELECT gen_random_uuid(), cid.id, now() + interval '48 hours' FROM cid
  RETURNING token
)
SELECT token FROM tok;

-- Verificações rápidas -------------------------------------------------------
-- SELECT public.get_dashboard_metrics(30);
-- SELECT * FROM public.noro_notificacoes ORDER BY created_at DESC LIMIT 5;
-- SELECT * FROM public.noro_update_tokens ORDER BY expires_at DESC LIMIT 1;

