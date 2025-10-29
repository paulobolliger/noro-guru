-- Control Plane baseline schema (public)
-- Safe to run multiple times (IF NOT EXISTS used where possible)

-- Extensions used by this schema
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users profile table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.noro_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  nome text,
  role text DEFAULT 'user',
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Leads
CREATE TABLE IF NOT EXISTS public.noro_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text,
  email text,
  destino text,
  origem text,
  created_at timestamptz DEFAULT now()
);

-- Tasks
CREATE TABLE IF NOT EXISTS public.noro_tarefas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text,
  status text,
  responsavel uuid REFERENCES public.noro_users(id),
  lead_id uuid REFERENCES public.noro_leads(id),
  created_at timestamptz DEFAULT now()
);

-- Notifications
CREATE TABLE IF NOT EXISTS public.noro_notificacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.noro_users(id),
  tipo text,
  titulo text,
  mensagem text,
  created_at timestamptz DEFAULT now()
);

-- Public form update tokens
CREATE TABLE IF NOT EXISTS public.noro_update_tokens (
  token uuid PRIMARY KEY,
  cliente_id uuid NOT NULL,
  expires_at timestamptz NOT NULL,
  used_at timestamptz
);

-- Clients
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

-- Client documents
CREATE TABLE IF NOT EXISTS public.noro_clientes_documentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid NOT NULL REFERENCES public.noro_clientes(id) ON DELETE CASCADE,
  tipo text,
  url text,
  created_at timestamptz DEFAULT now()
);

-- Drop first to allow return-type changes when reapplying
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

-- Optional: simple index helpers
CREATE INDEX IF NOT EXISTS idx_noro_tarefas_status ON public.noro_tarefas(status);
CREATE INDEX IF NOT EXISTS idx_noro_notificacoes_user ON public.noro_notificacoes(user_id);
