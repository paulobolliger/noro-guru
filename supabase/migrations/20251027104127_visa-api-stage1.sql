-- visa-api Stage 1
-- Objetivo: base do catálogo global de vistos + overrides por tenant
-- - Tabelas globais (sem tenant_id): visa_countries, visa_sources, visa_requirements, visa_updates
-- - Overrides por tenant: visa_overrides
-- - RLS: globais com leitura pública autenticada; overrides com escopo por tenant
-- Observação: dados atuais de vistos.guru (visa_info/visa_cache/visa_map_cache) serão migrados em etapa ETL separada

-- 0) Extensões utilitárias (idempotentes)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1) Catálogo de países (global)
CREATE TABLE IF NOT EXISTS public.visa_countries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  iso2 text UNIQUE,
  iso3 text,
  country text NOT NULL,
  region text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2) Fontes de dados (global)
CREATE TABLE IF NOT EXISTS public.visa_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text,
  method text,
  reliability text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3) Requisitos (global)
-- Normaliza o que hoje está em visa_info.* jsonb (general_info, visa_types, required_documents, etc)
CREATE TABLE IF NOT EXISTS public.visa_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_from text NOT NULL,        -- ISO/Nacionalidade
  country_to text NOT NULL,          -- Destino
  purpose text,                      -- Motivo (turismo, negócios, etc)
  duration text,                     -- Duração/estadia
  requirement jsonb,                 -- Documento normalizado (campos como required_documents, process_steps, health/security info, tips)
  last_checked_at timestamptz,
  sources uuid[] DEFAULT '{}',       -- Referências a visa_sources
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Índice único por chave lógica (não é permitido UNIQUE com expressão na definição da tabela)
CREATE UNIQUE INDEX IF NOT EXISTS ux_visa_requirements_key
ON public.visa_requirements (country_from, country_to, purpose, duration);

-- 4) Atualizações/Jobs (global)
CREATE TABLE IF NOT EXISTS public.visa_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id text,
  source_id uuid REFERENCES public.visa_sources(id) ON DELETE SET NULL,
  status text,
  diff jsonb,
  started_at timestamptz DEFAULT now(),
  finished_at timestamptz
);

-- 5) Overrides por tenant (escopo)
CREATE TABLE IF NOT EXISTS public.visa_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES cp.tenants(id) ON DELETE CASCADE,
  country_from text NOT NULL,
  country_to text NOT NULL,
  purpose text,
  duration text,
  override jsonb NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_visa_overrides_tenant ON public.visa_overrides(tenant_id);
CREATE UNIQUE INDEX IF NOT EXISTS ux_visa_overrides_key
ON public.visa_overrides (tenant_id, country_from, country_to, purpose, duration);

-- 6) RLS
-- Globais: leitura liberada para authenticated (escrita via service role)
ALTER TABLE public.visa_countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visa_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visa_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visa_updates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS p_countries_read ON public.visa_countries;
CREATE POLICY p_countries_read ON public.visa_countries FOR SELECT USING (true);

DROP POLICY IF EXISTS p_sources_read ON public.visa_sources;
CREATE POLICY p_sources_read ON public.visa_sources FOR SELECT USING (true);

DROP POLICY IF EXISTS p_requirements_read ON public.visa_requirements;
CREATE POLICY p_requirements_read ON public.visa_requirements FOR SELECT USING (true);

DROP POLICY IF EXISTS p_updates_read ON public.visa_updates;
CREATE POLICY p_updates_read ON public.visa_updates FOR SELECT USING (true);

-- Overrides: escopo por tenant
ALTER TABLE public.visa_overrides ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_overrides_select ON public.visa_overrides;
DROP POLICY IF EXISTS p_overrides_modify ON public.visa_overrides;
CREATE POLICY p_overrides_select ON public.visa_overrides FOR SELECT USING (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=visa_overrides.tenant_id)
);
CREATE POLICY p_overrides_modify ON public.visa_overrides FOR ALL USING (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=visa_overrides.tenant_id AND utr.role IN ('owner','admin','member'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=visa_overrides.tenant_id AND utr.role IN ('owner','admin','member'))
);

-- 7) Views de compatibilidade (opcional): expor subset compatível com visa_info
-- Mantemos para facilitar transição do vistos.guru; ETL preencherá os catálogos e requirements
CREATE OR REPLACE VIEW public.v_visa_info_basic AS
SELECT
  vr.country_to   AS country,
  vr.country_to   AS country_code, -- Ajustar no ETL real com mapeamento iso
  NULL::text      AS flag_emoji,
  vr.requirement->>'general_info'   AS general_info_text,
  vr.updated_at   AS updated_at,
  NULL::text      AS region,
  NULL::text      AS official_visa_link,
  vr.requirement->'visa_types'      AS visa_types,
  vr.requirement->'required_documents' AS required_documents,
  vr.requirement->'process_steps'   AS process_steps,
  vr.requirement->'approval_tips'   AS approval_tips,
  vr.requirement->'health_info'     AS health_info,
  vr.requirement->'security_info'   AS security_info
FROM public.visa_requirements vr;

-- Fim visa-api Stage 1
