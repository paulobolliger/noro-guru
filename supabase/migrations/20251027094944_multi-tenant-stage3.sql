-- Multi-tenant Stage 3
-- - tenant_id + RLS/policies em tabelas filhas de clientes e utilitários
--   noro_clientes_contatos_emergencia, noro_clientes_documentos, noro_clientes_enderecos,
--   noro_clientes_milhas, noro_clientes_preferencias, noro_tarefas, noro_interacoes
-- Obs.: backfill por join com noro_clientes quando houver cliente_id; caso contrário, default para tenant 'noro'

-- Helper: garantir tenant 'noro'
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM cp.tenants WHERE slug = 'noro') THEN
    INSERT INTO cp.tenants (id, name, slug, plan, status)
    VALUES (gen_random_uuid(), 'Noro Guru', 'noro', 'pro', 'active');
  END IF;
END $$;

-- 1) noro_clientes_contatos_emergencia
ALTER TABLE public.noro_clientes_contatos_emergencia ADD COLUMN IF NOT EXISTS tenant_id uuid;
UPDATE public.noro_clientes_contatos_emergencia e
SET tenant_id = c.tenant_id
FROM public.noro_clientes c
WHERE e.cliente_id = c.id AND e.tenant_id IS NULL;
UPDATE public.noro_clientes_contatos_emergencia e
SET tenant_id = (SELECT id FROM cp.tenants WHERE slug = 'noro')
WHERE e.tenant_id IS NULL;
DO $$ BEGIN IF EXISTS (
  SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='noro_clientes_contatos_emergencia' AND column_name='tenant_id'
) THEN EXECUTE 'ALTER TABLE public.noro_clientes_contatos_emergencia ALTER COLUMN tenant_id SET NOT NULL'; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (
  SELECT 1 FROM pg_constraint WHERE conname='noro_clientes_contatos_emergencia_tenant_fk'
) THEN ALTER TABLE public.noro_clientes_contatos_emergencia
  ADD CONSTRAINT noro_clientes_contatos_emergencia_tenant_fk FOREIGN KEY (tenant_id) REFERENCES cp.tenants(id) ON DELETE RESTRICT; END IF; END $$;
CREATE INDEX IF NOT EXISTS idx_noro_clientes_contatos_emergencia_tenant ON public.noro_clientes_contatos_emergencia(tenant_id);
ALTER TABLE public.noro_clientes_contatos_emergencia ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_noro_cli_contato_select ON public.noro_clientes_contatos_emergencia;
DROP POLICY IF EXISTS p_noro_cli_contato_modify ON public.noro_clientes_contatos_emergencia;
CREATE POLICY p_noro_cli_contato_select ON public.noro_clientes_contatos_emergencia FOR SELECT USING (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_clientes_contatos_emergencia.tenant_id)
);
CREATE POLICY p_noro_cli_contato_modify ON public.noro_clientes_contatos_emergencia FOR ALL USING (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_clientes_contatos_emergencia.tenant_id AND utr.role IN ('owner','admin','member'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_clientes_contatos_emergencia.tenant_id AND utr.role IN ('owner','admin','member'))
);

-- 2) noro_clientes_documentos
ALTER TABLE public.noro_clientes_documentos ADD COLUMN IF NOT EXISTS tenant_id uuid;
UPDATE public.noro_clientes_documentos d
SET tenant_id = c.tenant_id
FROM public.noro_clientes c
WHERE d.cliente_id = c.id AND d.tenant_id IS NULL;
UPDATE public.noro_clientes_documentos d
SET tenant_id = (SELECT id FROM cp.tenants WHERE slug = 'noro')
WHERE d.tenant_id IS NULL;
DO $$ BEGIN IF EXISTS (
  SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='noro_clientes_documentos' AND column_name='tenant_id'
) THEN EXECUTE 'ALTER TABLE public.noro_clientes_documentos ALTER COLUMN tenant_id SET NOT NULL'; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (
  SELECT 1 FROM pg_constraint WHERE conname='noro_clientes_documentos_tenant_fk'
) THEN ALTER TABLE public.noro_clientes_documentos
  ADD CONSTRAINT noro_clientes_documentos_tenant_fk FOREIGN KEY (tenant_id) REFERENCES cp.tenants(id) ON DELETE RESTRICT; END IF; END $$;
CREATE INDEX IF NOT EXISTS idx_noro_clientes_documentos_tenant ON public.noro_clientes_documentos(tenant_id);
ALTER TABLE public.noro_clientes_documentos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_noro_cli_docs_select ON public.noro_clientes_documentos;
DROP POLICY IF EXISTS p_noro_cli_docs_modify ON public.noro_clientes_documentos;
CREATE POLICY p_noro_cli_docs_select ON public.noro_clientes_documentos FOR SELECT USING (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_clientes_documentos.tenant_id)
);
CREATE POLICY p_noro_cli_docs_modify ON public.noro_clientes_documentos FOR ALL USING (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_clientes_documentos.tenant_id AND utr.role IN ('owner','admin','member'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_clientes_documentos.tenant_id AND utr.role IN ('owner','admin','member'))
);

-- 3) noro_clientes_enderecos
ALTER TABLE public.noro_clientes_enderecos ADD COLUMN IF NOT EXISTS tenant_id uuid;
UPDATE public.noro_clientes_enderecos e
SET tenant_id = c.tenant_id
FROM public.noro_clientes c
WHERE e.cliente_id = c.id AND e.tenant_id IS NULL;
UPDATE public.noro_clientes_enderecos e
SET tenant_id = (SELECT id FROM cp.tenants WHERE slug = 'noro')
WHERE e.tenant_id IS NULL;
DO $$ BEGIN IF EXISTS (
  SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='noro_clientes_enderecos' AND column_name='tenant_id'
) THEN EXECUTE 'ALTER TABLE public.noro_clientes_enderecos ALTER COLUMN tenant_id SET NOT NULL'; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (
  SELECT 1 FROM pg_constraint WHERE conname='noro_clientes_enderecos_tenant_fk'
) THEN ALTER TABLE public.noro_clientes_enderecos
  ADD CONSTRAINT noro_clientes_enderecos_tenant_fk FOREIGN KEY (tenant_id) REFERENCES cp.tenants(id) ON DELETE RESTRICT; END IF; END $$;
CREATE INDEX IF NOT EXISTS idx_noro_clientes_enderecos_tenant ON public.noro_clientes_enderecos(tenant_id);
ALTER TABLE public.noro_clientes_enderecos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_noro_cli_end_select ON public.noro_clientes_enderecos;
DROP POLICY IF EXISTS p_noro_cli_end_modify ON public.noro_clientes_enderecos;
CREATE POLICY p_noro_cli_end_select ON public.noro_clientes_enderecos FOR SELECT USING (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_clientes_enderecos.tenant_id)
);
CREATE POLICY p_noro_cli_end_modify ON public.noro_clientes_enderecos FOR ALL USING (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_clientes_enderecos.tenant_id AND utr.role IN ('owner','admin','member'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_clientes_enderecos.tenant_id AND utr.role IN ('owner','admin','member'))
);

-- 4) noro_clientes_milhas
ALTER TABLE public.noro_clientes_milhas ADD COLUMN IF NOT EXISTS tenant_id uuid;
UPDATE public.noro_clientes_milhas m
SET tenant_id = c.tenant_id
FROM public.noro_clientes c
WHERE m.cliente_id = c.id AND m.tenant_id IS NULL;
UPDATE public.noro_clientes_milhas m
SET tenant_id = (SELECT id FROM cp.tenants WHERE slug = 'noro')
WHERE m.tenant_id IS NULL;
DO $$ BEGIN IF EXISTS (
  SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='noro_clientes_milhas' AND column_name='tenant_id'
) THEN EXECUTE 'ALTER TABLE public.noro_clientes_milhas ALTER COLUMN tenant_id SET NOT NULL'; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (
  SELECT 1 FROM pg_constraint WHERE conname='noro_clientes_milhas_tenant_fk'
) THEN ALTER TABLE public.noro_clientes_milhas
  ADD CONSTRAINT noro_clientes_milhas_tenant_fk FOREIGN KEY (tenant_id) REFERENCES cp.tenants(id) ON DELETE RESTRICT; END IF; END $$;
CREATE INDEX IF NOT EXISTS idx_noro_clientes_milhas_tenant ON public.noro_clientes_milhas(tenant_id);
ALTER TABLE public.noro_clientes_milhas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_noro_cli_milhas_select ON public.noro_clientes_milhas;
DROP POLICY IF EXISTS p_noro_cli_milhas_modify ON public.noro_clientes_milhas;
CREATE POLICY p_noro_cli_milhas_select ON public.noro_clientes_milhas FOR SELECT USING (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_clientes_milhas.tenant_id)
);
CREATE POLICY p_noro_cli_milhas_modify ON public.noro_clientes_milhas FOR ALL USING (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_clientes_milhas.tenant_id AND utr.role IN ('owner','admin','member'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_clientes_milhas.tenant_id AND utr.role IN ('owner','admin','member'))
);

-- 5) noro_clientes_preferencias
ALTER TABLE public.noro_clientes_preferencias ADD COLUMN IF NOT EXISTS tenant_id uuid;
UPDATE public.noro_clientes_preferencias p
SET tenant_id = c.tenant_id
FROM public.noro_clientes c
WHERE p.cliente_id = c.id AND p.tenant_id IS NULL;
UPDATE public.noro_clientes_preferencias p
SET tenant_id = (SELECT id FROM cp.tenants WHERE slug = 'noro')
WHERE p.tenant_id IS NULL;
DO $$ BEGIN IF EXISTS (
  SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='noro_clientes_preferencias' AND column_name='tenant_id'
) THEN EXECUTE 'ALTER TABLE public.noro_clientes_preferencias ALTER COLUMN tenant_id SET NOT NULL'; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (
  SELECT 1 FROM pg_constraint WHERE conname='noro_clientes_preferencias_tenant_fk'
) THEN ALTER TABLE public.noro_clientes_preferencias
  ADD CONSTRAINT noro_clientes_preferencias_tenant_fk FOREIGN KEY (tenant_id) REFERENCES cp.tenants(id) ON DELETE RESTRICT; END IF; END $$;
CREATE INDEX IF NOT EXISTS idx_noro_clientes_preferencias_tenant ON public.noro_clientes_preferencias(tenant_id);
ALTER TABLE public.noro_clientes_preferencias ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_noro_cli_pref_select ON public.noro_clientes_preferencias;
DROP POLICY IF EXISTS p_noro_cli_pref_modify ON public.noro_clientes_preferencias;
CREATE POLICY p_noro_cli_pref_select ON public.noro_clientes_preferencias FOR SELECT USING (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_clientes_preferencias.tenant_id)
);
CREATE POLICY p_noro_cli_pref_modify ON public.noro_clientes_preferencias FOR ALL USING (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_clientes_preferencias.tenant_id AND utr.role IN ('owner','admin','member'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_clientes_preferencias.tenant_id AND utr.role IN ('owner','admin','member'))
);

-- 6) noro_tarefas (sem relação explícita com cliente: backfill padrão)
ALTER TABLE public.noro_tarefas ADD COLUMN IF NOT EXISTS tenant_id uuid;
UPDATE public.noro_tarefas SET tenant_id = (SELECT id FROM cp.tenants WHERE slug = 'noro') WHERE tenant_id IS NULL;
DO $$ BEGIN IF EXISTS (
  SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='noro_tarefas' AND column_name='tenant_id'
) THEN EXECUTE 'ALTER TABLE public.noro_tarefas ALTER COLUMN tenant_id SET NOT NULL'; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (
  SELECT 1 FROM pg_constraint WHERE conname='noro_tarefas_tenant_fk'
) THEN ALTER TABLE public.noro_tarefas
  ADD CONSTRAINT noro_tarefas_tenant_fk FOREIGN KEY (tenant_id) REFERENCES cp.tenants(id) ON DELETE RESTRICT; END IF; END $$;
CREATE INDEX IF NOT EXISTS idx_noro_tarefas_tenant ON public.noro_tarefas(tenant_id);
ALTER TABLE public.noro_tarefas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_noro_tarefas_select ON public.noro_tarefas;
DROP POLICY IF EXISTS p_noro_tarefas_modify ON public.noro_tarefas;
CREATE POLICY p_noro_tarefas_select ON public.noro_tarefas FOR SELECT USING (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_tarefas.tenant_id)
);
CREATE POLICY p_noro_tarefas_modify ON public.noro_tarefas FOR ALL USING (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_tarefas.tenant_id AND utr.role IN ('owner','admin','member'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_tarefas.tenant_id AND utr.role IN ('owner','admin','member'))
);

-- 7) noro_interacoes (backfill padrão)
ALTER TABLE public.noro_interacoes ADD COLUMN IF NOT EXISTS tenant_id uuid;
UPDATE public.noro_interacoes SET tenant_id = (SELECT id FROM cp.tenants WHERE slug = 'noro') WHERE tenant_id IS NULL;
DO $$ BEGIN IF EXISTS (
  SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='noro_interacoes' AND column_name='tenant_id'
) THEN EXECUTE 'ALTER TABLE public.noro_interacoes ALTER COLUMN tenant_id SET NOT NULL'; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (
  SELECT 1 FROM pg_constraint WHERE conname='noro_interacoes_tenant_fk'
) THEN ALTER TABLE public.noro_interacoes
  ADD CONSTRAINT noro_interacoes_tenant_fk FOREIGN KEY (tenant_id) REFERENCES cp.tenants(id) ON DELETE RESTRICT; END IF; END $$;
CREATE INDEX IF NOT EXISTS idx_noro_interacoes_tenant ON public.noro_interacoes(tenant_id);
ALTER TABLE public.noro_interacoes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_noro_interacoes_select ON public.noro_interacoes;
DROP POLICY IF EXISTS p_noro_interacoes_modify ON public.noro_interacoes;
CREATE POLICY p_noro_interacoes_select ON public.noro_interacoes FOR SELECT USING (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_interacoes.tenant_id)
);
CREATE POLICY p_noro_interacoes_modify ON public.noro_interacoes FOR ALL USING (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_interacoes.tenant_id AND utr.role IN ('owner','admin','member'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_interacoes.tenant_id AND utr.role IN ('owner','admin','member'))
);

-- Fim Stage 3
