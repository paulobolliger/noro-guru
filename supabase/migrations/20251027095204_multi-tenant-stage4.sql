-- Multi-tenant Stage 4
-- - tenant_id + RLS/policies em tabelas restantes de negócio
--   noro_notificacoes, noro_newsletter, noro_fornecedores, noro_configuracoes, noro_empresa
-- Observação: noro_configuracoes e noro_empresa passam a ser por tenant

-- Helper: garantir tenant 'noro'
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM cp.tenants WHERE slug = 'noro') THEN
    INSERT INTO cp.tenants (id, name, slug, plan, status)
    VALUES (gen_random_uuid(), 'Noro Guru', 'noro', 'pro', 'active');
  END IF;
END $$;

-- 1) noro_notificacoes
ALTER TABLE public.noro_notificacoes ADD COLUMN IF NOT EXISTS tenant_id uuid;
UPDATE public.noro_notificacoes SET tenant_id = (SELECT id FROM cp.tenants WHERE slug = 'noro') WHERE tenant_id IS NULL;
DO $$ BEGIN IF EXISTS (
  SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='noro_notificacoes' AND column_name='tenant_id'
) THEN EXECUTE 'ALTER TABLE public.noro_notificacoes ALTER COLUMN tenant_id SET NOT NULL'; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (
  SELECT 1 FROM pg_constraint WHERE conname='noro_notificacoes_tenant_fk'
) THEN ALTER TABLE public.noro_notificacoes
  ADD CONSTRAINT noro_notificacoes_tenant_fk FOREIGN KEY (tenant_id) REFERENCES cp.tenants(id) ON DELETE RESTRICT; END IF; END $$;
CREATE INDEX IF NOT EXISTS idx_noro_notificacoes_tenant ON public.noro_notificacoes(tenant_id);
ALTER TABLE public.noro_notificacoes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_noro_notificacoes_select ON public.noro_notificacoes;
DROP POLICY IF EXISTS p_noro_notificacoes_modify ON public.noro_notificacoes;
CREATE POLICY p_noro_notificacoes_select ON public.noro_notificacoes FOR SELECT USING (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_notificacoes.tenant_id)
);
CREATE POLICY p_noro_notificacoes_modify ON public.noro_notificacoes FOR ALL USING (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_notificacoes.tenant_id AND utr.role IN ('owner','admin','member'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_notificacoes.tenant_id AND utr.role IN ('owner','admin','member'))
);

-- 2) noro_newsletter
ALTER TABLE public.noro_newsletter ADD COLUMN IF NOT EXISTS tenant_id uuid;
UPDATE public.noro_newsletter SET tenant_id = (SELECT id FROM cp.tenants WHERE slug = 'noro') WHERE tenant_id IS NULL;
DO $$ BEGIN IF EXISTS (
  SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='noro_newsletter' AND column_name='tenant_id'
) THEN EXECUTE 'ALTER TABLE public.noro_newsletter ALTER COLUMN tenant_id SET NOT NULL'; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (
  SELECT 1 FROM pg_constraint WHERE conname='noro_newsletter_tenant_fk'
) THEN ALTER TABLE public.noro_newsletter
  ADD CONSTRAINT noro_newsletter_tenant_fk FOREIGN KEY (tenant_id) REFERENCES cp.tenants(id) ON DELETE RESTRICT; END IF; END $$;
CREATE INDEX IF NOT EXISTS idx_noro_newsletter_tenant ON public.noro_newsletter(tenant_id);
ALTER TABLE public.noro_newsletter ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_noro_newsletter_select ON public.noro_newsletter;
DROP POLICY IF EXISTS p_noro_newsletter_modify ON public.noro_newsletter;
CREATE POLICY p_noro_newsletter_select ON public.noro_newsletter FOR SELECT USING (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_newsletter.tenant_id)
);
CREATE POLICY p_noro_newsletter_modify ON public.noro_newsletter FOR ALL USING (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_newsletter.tenant_id AND utr.role IN ('owner','admin','member'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_newsletter.tenant_id AND utr.role IN ('owner','admin','member'))
);

-- 3) noro_fornecedores
ALTER TABLE public.noro_fornecedores ADD COLUMN IF NOT EXISTS tenant_id uuid;
UPDATE public.noro_fornecedores SET tenant_id = (SELECT id FROM cp.tenants WHERE slug = 'noro') WHERE tenant_id IS NULL;
DO $$ BEGIN IF EXISTS (
  SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='noro_fornecedores' AND column_name='tenant_id'
) THEN EXECUTE 'ALTER TABLE public.noro_fornecedores ALTER COLUMN tenant_id SET NOT NULL'; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (
  SELECT 1 FROM pg_constraint WHERE conname='noro_fornecedores_tenant_fk'
) THEN ALTER TABLE public.noro_fornecedores
  ADD CONSTRAINT noro_fornecedores_tenant_fk FOREIGN KEY (tenant_id) REFERENCES cp.tenants(id) ON DELETE RESTRICT; END IF; END $$;
CREATE INDEX IF NOT EXISTS idx_noro_fornecedores_tenant ON public.noro_fornecedores(tenant_id);
ALTER TABLE public.noro_fornecedores ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_noro_fornecedores_select ON public.noro_fornecedores;
DROP POLICY IF EXISTS p_noro_fornecedores_modify ON public.noro_fornecedores;
CREATE POLICY p_noro_fornecedores_select ON public.noro_fornecedores FOR SELECT USING (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_fornecedores.tenant_id)
);
CREATE POLICY p_noro_fornecedores_modify ON public.noro_fornecedores FOR ALL USING (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_fornecedores.tenant_id AND utr.role IN ('owner','admin','member'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_fornecedores.tenant_id AND utr.role IN ('owner','admin','member'))
);

-- 4) noro_configuracoes (por tenant)
ALTER TABLE public.noro_configuracoes ADD COLUMN IF NOT EXISTS tenant_id uuid;
UPDATE public.noro_configuracoes SET tenant_id = (SELECT id FROM cp.tenants WHERE slug = 'noro') WHERE tenant_id IS NULL;
DO $$ BEGIN IF EXISTS (
  SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='noro_configuracoes' AND column_name='tenant_id'
) THEN EXECUTE 'ALTER TABLE public.noro_configuracoes ALTER COLUMN tenant_id SET NOT NULL'; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (
  SELECT 1 FROM pg_constraint WHERE conname='noro_configuracoes_tenant_fk'
) THEN ALTER TABLE public.noro_configuracoes
  ADD CONSTRAINT noro_configuracoes_tenant_fk FOREIGN KEY (tenant_id) REFERENCES cp.tenants(id) ON DELETE RESTRICT; END IF; END $$;
CREATE INDEX IF NOT EXISTS idx_noro_configuracoes_tenant ON public.noro_configuracoes(tenant_id);
ALTER TABLE public.noro_configuracoes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_noro_configuracoes_select ON public.noro_configuracoes;
DROP POLICY IF EXISTS p_noro_configuracoes_modify ON public.noro_configuracoes;
CREATE POLICY p_noro_configuracoes_select ON public.noro_configuracoes FOR SELECT USING (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_configuracoes.tenant_id)
);
CREATE POLICY p_noro_configuracoes_modify ON public.noro_configuracoes FOR ALL USING (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_configuracoes.tenant_id AND utr.role IN ('owner','admin','member'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_configuracoes.tenant_id AND utr.role IN ('owner','admin','member'))
);

-- 5) noro_empresa (por tenant)
ALTER TABLE public.noro_empresa ADD COLUMN IF NOT EXISTS tenant_id uuid;
UPDATE public.noro_empresa SET tenant_id = (SELECT id FROM cp.tenants WHERE slug = 'noro') WHERE tenant_id IS NULL;
DO $$ BEGIN IF EXISTS (
  SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='noro_empresa' AND column_name='tenant_id'
) THEN EXECUTE 'ALTER TABLE public.noro_empresa ALTER COLUMN tenant_id SET NOT NULL'; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (
  SELECT 1 FROM pg_constraint WHERE conname='noro_empresa_tenant_fk'
) THEN ALTER TABLE public.noro_empresa
  ADD CONSTRAINT noro_empresa_tenant_fk FOREIGN KEY (tenant_id) REFERENCES cp.tenants(id) ON DELETE RESTRICT; END IF; END $$;
CREATE INDEX IF NOT EXISTS idx_noro_empresa_tenant ON public.noro_empresa(tenant_id);
ALTER TABLE public.noro_empresa ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_noro_empresa_select ON public.noro_empresa;
DROP POLICY IF EXISTS p_noro_empresa_modify ON public.noro_empresa;
CREATE POLICY p_noro_empresa_select ON public.noro_empresa FOR SELECT USING (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_empresa.tenant_id)
);
CREATE POLICY p_noro_empresa_modify ON public.noro_empresa FOR ALL USING (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_empresa.tenant_id AND utr.role IN ('owner','admin','member'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM cp.user_tenant_roles utr WHERE utr.user_id=auth.uid() AND utr.tenant_id=noro_empresa.tenant_id AND utr.role IN ('owner','admin','member'))
);

-- Fim Stage 4
