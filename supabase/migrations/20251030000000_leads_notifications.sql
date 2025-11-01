-- Tabela de Leads (Captação de potenciais clientes)
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  interest TEXT,
  message TEXT,
  source TEXT DEFAULT 'website', -- website, referral, social, ads, etc
  status TEXT DEFAULT 'new', -- new, contacted, qualified, converted, lost
  tenant_id UUID REFERENCES public.tenants(id),
  assigned_to UUID REFERENCES auth.users(id),
  last_contact_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ,
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON public.leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_tenant_id ON public.leads(tenant_id);

-- RLS Policies
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Admins e owners podem ver todos os leads
CREATE POLICY "Admins can view all leads"
  ON public.leads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      JOIN public.user_tenants ut ON ut.user_id = u.id
      WHERE u.auth_user_id = auth.uid()
      AND ut.role IN ('admin', 'owner')
      AND ut.ativo = true
    )
  );

-- Admins e owners podem criar leads
CREATE POLICY "Admins can create leads"
  ON public.leads FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users u
      JOIN public.user_tenants ut ON ut.user_id = u.id
      WHERE u.auth_user_id = auth.uid()
      AND ut.role IN ('admin', 'owner')
      AND ut.ativo = true
    )
  );

-- Admins e owners podem atualizar leads
CREATE POLICY "Admins can update leads"
  ON public.leads FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      JOIN public.user_tenants ut ON ut.user_id = u.id
      WHERE u.auth_user_id = auth.uid()
      AND ut.role IN ('admin', 'owner')
      AND ut.ativo = true
    )
  );

-- Service role pode fazer tudo (para API externa)
CREATE POLICY "Service role full access to leads"
  ON public.leads FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Tabela de Notificações
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- info, success, warning, error
  read BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  read_at TIMESTAMPTZ
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- RLS Policies
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver suas próprias notificações
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Usuários podem atualizar suas próprias notificações (marcar como lida)
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Service role pode criar notificações
CREATE POLICY "Service role can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Comentários
COMMENT ON TABLE public.leads IS 'Leads capturados do site ou outras fontes';
COMMENT ON TABLE public.notifications IS 'Notificações do sistema para usuários';
COMMENT ON COLUMN public.leads.source IS 'Origem do lead: website, referral, social, ads, etc';
COMMENT ON COLUMN public.leads.status IS 'Status: new, contacted, qualified, converted, lost';
COMMENT ON COLUMN public.notifications.type IS 'Tipo: info, success, warning, error';
