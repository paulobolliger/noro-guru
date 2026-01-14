-- AI Content Module
-- Criação das tabelas para armazenar conteúdo gerado por IA (Roteiros e Artigos)
-- Com suporte completo a Multi-tenancy (tenant_id + RLS)

-- 1. Tabela de Roteiros
CREATE TABLE IF NOT EXISTS public.noro_ai_roteiros (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES cp.tenants(id) ON DELETE RESTRICT,
    titulo text NOT NULL,
    destino text,
    tipo text, -- Aventura, Luxo, etc.
    dificuldade text,
    conteudo jsonb NOT NULL, -- Estrutura completa do roteiro
    status text DEFAULT 'draft', -- draft, published, archived
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Index e RLS para Roteiros
CREATE INDEX IF NOT EXISTS idx_noro_ai_roteiros_tenant ON public.noro_ai_roteiros(tenant_id);
ALTER TABLE public.noro_ai_roteiros ENABLE ROW LEVEL SECURITY;

CREATE POLICY p_noro_ai_roteiros_select ON public.noro_ai_roteiros FOR SELECT USING (
    EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_ai_roteiros.tenant_id)
);

CREATE POLICY p_noro_ai_roteiros_modify ON public.noro_ai_roteiros FOR ALL USING (
    EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_ai_roteiros.tenant_id AND utr.role IN ('owner','admin','member'))
) WITH CHECK (
    EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_ai_roteiros.tenant_id AND utr.role IN ('owner','admin','member'))
);


-- 2. Tabela de Artigos
CREATE TABLE IF NOT EXISTS public.noro_ai_artigos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES cp.tenants(id) ON DELETE RESTRICT,
    titulo text NOT NULL,
    categoria text,
    tom_voz text,
    tamanho text,
    conteudo text NOT NULL, -- Markdown ou HTML do artigo
    status text DEFAULT 'draft',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Index e RLS para Artigos
CREATE INDEX IF NOT EXISTS idx_noro_ai_artigos_tenant ON public.noro_ai_artigos(tenant_id);
ALTER TABLE public.noro_ai_artigos ENABLE ROW LEVEL SECURITY;

CREATE POLICY p_noro_ai_artigos_select ON public.noro_ai_artigos FOR SELECT USING (
    EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_ai_artigos.tenant_id)
);

CREATE POLICY p_noro_ai_artigos_modify ON public.noro_ai_artigos FOR ALL USING (
    EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_ai_artigos.tenant_id AND utr.role IN ('owner','admin','member'))
) WITH CHECK (
    EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_ai_artigos.tenant_id AND utr.role IN ('owner','admin','member'))
);
