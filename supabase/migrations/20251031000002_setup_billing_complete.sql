-- Primeiro verificamos se o schema public existe
CREATE SCHEMA IF NOT EXISTS public;

-- Verifica se a tabela tenants existe e cria se não existir
CREATE TABLE IF NOT EXISTS public.tenants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(255) NOT NULL,
    stripe_customer_id varchar(100),
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    admin_user_ids uuid[] DEFAULT '{}'::uuid[]
);

-- Agora criamos o schema billing e suas tabelas
CREATE SCHEMA IF NOT EXISTS billing;

-- Enums
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'billing')) THEN
        CREATE TYPE billing.subscription_status AS ENUM (
            'active',
            'canceled',
            'past_due',
            'pending',
            'trialing',
            'incomplete',
            'incomplete_expired'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'billing')) THEN
        CREATE TYPE billing.payment_status AS ENUM (
            'pending',
            'processing',
            'succeeded',
            'failed',
            'refunded',
            'canceled'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_provider' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'billing')) THEN
        CREATE TYPE billing.payment_provider AS ENUM (
            'stripe',
            'cielo'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method_type' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'billing')) THEN
        CREATE TYPE billing.payment_method_type AS ENUM (
            'credit_card',
            'debit_card',
            'boleto',
            'pix'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'billing_interval' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'billing')) THEN
        CREATE TYPE billing.billing_interval AS ENUM (
            'monthly',
            'quarterly',
            'yearly'
        );
    END IF;
END $$;

-- Tabela de Planos
CREATE TABLE IF NOT EXISTS billing.plans (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(100) NOT NULL,
    description text,
    price_brl numeric(10,2) NOT NULL,
    price_usd numeric(10,2) NOT NULL,
    interval billing.billing_interval NOT NULL DEFAULT 'monthly',
    features jsonb DEFAULT '{}',
    stripe_price_id varchar(100),
    cielo_plan_id varchar(100),
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    metadata jsonb DEFAULT '{}'
);

-- Tabela de Assinaturas
CREATE TABLE IF NOT EXISTS billing.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.tenants(id),
    plan_id uuid NOT NULL REFERENCES billing.plans(id),
    status billing.subscription_status NOT NULL DEFAULT 'pending',
    current_period_start timestamptz NOT NULL,
    current_period_end timestamptz NOT NULL,
    cancel_at_period_end boolean DEFAULT false,
    canceled_at timestamptz,
    trial_start timestamptz,
    trial_end timestamptz,
    stripe_subscription_id varchar(100),
    cielo_subscription_id varchar(100),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    metadata jsonb DEFAULT '{}'
);

-- Tabela de Métodos de Pagamento
CREATE TABLE IF NOT EXISTS billing.payment_methods (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.tenants(id),
    provider billing.payment_provider NOT NULL,
    type billing.payment_method_type NOT NULL,
    last_four varchar(4),
    expiry_month varchar(2),
    expiry_year varchar(4),
    card_brand varchar(50),
    is_default boolean DEFAULT false,
    stripe_payment_method_id varchar(100),
    cielo_payment_method_id varchar(100),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    metadata jsonb DEFAULT '{}'
);

-- Tabela de Faturas
CREATE TABLE IF NOT EXISTS billing.invoices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.tenants(id),
    subscription_id uuid NOT NULL REFERENCES billing.subscriptions(id),
    amount_brl numeric(10,2) NOT NULL,
    amount_usd numeric(10,2) NOT NULL,
    status billing.payment_status NOT NULL DEFAULT 'pending',
    due_date timestamptz NOT NULL,
    paid_at timestamptz,
    stripe_invoice_id varchar(100),
    cielo_invoice_id varchar(100),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    metadata jsonb DEFAULT '{}'
);

-- Tabela de Transações
CREATE TABLE IF NOT EXISTS billing.transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES public.tenants(id),
    invoice_id uuid NOT NULL REFERENCES billing.invoices(id),
    payment_method_id uuid REFERENCES billing.payment_methods(id),
    amount_brl numeric(10,2) NOT NULL,
    amount_usd numeric(10,2) NOT NULL,
    provider billing.payment_provider NOT NULL,
    status billing.payment_status NOT NULL DEFAULT 'pending',
    stripe_payment_intent_id varchar(100),
    cielo_payment_id varchar(100),
    error_message text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    metadata jsonb DEFAULT '{}'
);

-- Função para updated_at
CREATE OR REPLACE FUNCTION billing.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers
DROP TRIGGER IF EXISTS set_updated_at_plans ON billing.plans;
DROP TRIGGER IF EXISTS set_updated_at_subscriptions ON billing.subscriptions;
DROP TRIGGER IF EXISTS set_updated_at_payment_methods ON billing.payment_methods;
DROP TRIGGER IF EXISTS set_updated_at_invoices ON billing.invoices;
DROP TRIGGER IF EXISTS set_updated_at_transactions ON billing.transactions;

CREATE TRIGGER set_updated_at_plans
    BEFORE UPDATE ON billing.plans
    FOR EACH ROW
    EXECUTE FUNCTION billing.set_updated_at();

CREATE TRIGGER set_updated_at_subscriptions
    BEFORE UPDATE ON billing.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION billing.set_updated_at();

CREATE TRIGGER set_updated_at_payment_methods
    BEFORE UPDATE ON billing.payment_methods
    FOR EACH ROW
    EXECUTE FUNCTION billing.set_updated_at();

CREATE TRIGGER set_updated_at_invoices
    BEFORE UPDATE ON billing.invoices
    FOR EACH ROW
    EXECUTE FUNCTION billing.set_updated_at();

CREATE TRIGGER set_updated_at_transactions
    BEFORE UPDATE ON billing.transactions
    FOR EACH ROW
    EXECUTE FUNCTION billing.set_updated_at();

-- Índices
CREATE INDEX IF NOT EXISTS idx_subscriptions_tenant ON billing.subscriptions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON billing.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_invoices_tenant ON billing.invoices(tenant_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON billing.invoices(status);
CREATE INDEX IF NOT EXISTS idx_transactions_tenant ON billing.transactions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON billing.transactions(status);

-- RLS
ALTER TABLE billing.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing.transactions ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$ 
BEGIN
    -- Remove policies antigas se existirem
    DROP POLICY IF EXISTS admin_all_plans ON billing.plans;
    DROP POLICY IF EXISTS admin_all_subscriptions ON billing.subscriptions;
    DROP POLICY IF EXISTS admin_all_payment_methods ON billing.payment_methods;
    DROP POLICY IF EXISTS admin_all_invoices ON billing.invoices;
    DROP POLICY IF EXISTS admin_all_transactions ON billing.transactions;
    DROP POLICY IF EXISTS tenant_read_own_subscription ON billing.subscriptions;
    DROP POLICY IF EXISTS tenant_read_own_payment_methods ON billing.payment_methods;
    DROP POLICY IF EXISTS tenant_read_own_invoices ON billing.invoices;
    DROP POLICY IF EXISTS tenant_read_own_transactions ON billing.transactions;

    -- Cria novas policies
    -- Para administradores
    CREATE POLICY admin_all_plans ON billing.plans
        FOR ALL TO authenticated
        USING (auth.jwt()->>'role' = 'admin')
        WITH CHECK (auth.jwt()->>'role' = 'admin');

    CREATE POLICY admin_all_subscriptions ON billing.subscriptions
        FOR ALL TO authenticated
        USING (auth.jwt()->>'role' = 'admin')
        WITH CHECK (auth.jwt()->>'role' = 'admin');

    CREATE POLICY admin_all_payment_methods ON billing.payment_methods
        FOR ALL TO authenticated
        USING (auth.jwt()->>'role' = 'admin')
        WITH CHECK (auth.jwt()->>'role' = 'admin');

    CREATE POLICY admin_all_invoices ON billing.invoices
        FOR ALL TO authenticated
        USING (auth.jwt()->>'role' = 'admin')
        WITH CHECK (auth.jwt()->>'role' = 'admin');

    CREATE POLICY admin_all_transactions ON billing.transactions
        FOR ALL TO authenticated
        USING (auth.jwt()->>'role' = 'admin')
        WITH CHECK (auth.jwt()->>'role' = 'admin');

    -- Para usuários normais (apenas leitura de seus próprios dados)
    CREATE POLICY tenant_read_own_subscription ON billing.subscriptions
        FOR SELECT TO authenticated
        USING (tenant_id IN (
            SELECT id FROM public.tenants 
            WHERE admin_user_ids @> ARRAY[auth.uid()]::uuid[]
        ));

    CREATE POLICY tenant_read_own_payment_methods ON billing.payment_methods
        FOR SELECT TO authenticated
        USING (tenant_id IN (
            SELECT id FROM public.tenants 
            WHERE admin_user_ids @> ARRAY[auth.uid()]::uuid[]
        ));

    CREATE POLICY tenant_read_own_invoices ON billing.invoices
        FOR SELECT TO authenticated
        USING (tenant_id IN (
            SELECT id FROM public.tenants 
            WHERE admin_user_ids @> ARRAY[auth.uid()]::uuid[]
        ));

    CREATE POLICY tenant_read_own_transactions ON billing.transactions
        FOR SELECT TO authenticated
        USING (tenant_id IN (
            SELECT id FROM public.tenants 
            WHERE admin_user_ids @> ARRAY[auth.uid()]::uuid[]
        ));
END $$;