-- Migration: cp patch for Docker alignment
-- Generated 2025-10-28

BEGIN;

-- Ensure prerequisites
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;
CREATE SCHEMA IF NOT EXISTS cp;

-- 1) user_tenant_roles
CREATE TABLE IF NOT EXISTS cp.user_tenant_roles (
tenant_id uuid NOT NULL,
user_id uuid NOT NULL,
role text NOT NULL,
created_at timestamptz NOT NULL DEFAULT now(),
PRIMARY KEY (tenant_id, user_id)
);
DO $$
BEGIN
IF NOT EXISTS (
SELECT 1 FROM information_schema.table_constraints
WHERE constraint_schema='cp' AND table_name='user_tenant_roles' AND constraint_name='user_tenant_roles_tenant_fkey'
) THEN
ALTER TABLE cp.user_tenant_roles
ADD CONSTRAINT user_tenant_roles_tenant_fkey FOREIGN KEY (tenant_id) REFERENCES cp.tenants(id) ON DELETE CASCADE;
END IF;
IF NOT EXISTS (
SELECT 1 FROM information_schema.table_constraints
WHERE constraint_schema='cp' AND table_name='user_tenant_roles' AND constraint_name='user_tenant_roles_user_fkey'
) THEN
ALTER TABLE cp.user_tenant_roles
ADD CONSTRAINT user_tenant_roles_user_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
END IF;
END$$;

-- 2) modules_registry
CREATE TABLE IF NOT EXISTS cp.modules_registry (
id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
name text NOT NULL,
code text NOT NULL,
is_core boolean NOT NULL DEFAULT false,
is_active boolean NOT NULL DEFAULT true,
metadata jsonb
);

-- 3) plan_features
CREATE TABLE IF NOT EXISTS cp.plan_features (
id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
plan_id uuid NOT NULL,
key text NOT NULL,
value text NOT NULL
);
DO $$
BEGIN
IF NOT EXISTS (
SELECT 1 FROM information_schema.table_constraints
WHERE constraint_schema='cp' AND table_name='plan_features' AND constraint_name='plan_features_plan_fkey'
) THEN
ALTER TABLE cp.plan_features
ADD CONSTRAINT plan_features_plan_fkey FOREIGN KEY (plan_id) REFERENCES cp.plans(id) ON DELETE CASCADE;
END IF;
END$$;

-- 4) webhooks
CREATE TABLE IF NOT EXISTS cp.webhooks (
id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
code text NOT NULL,
url text NOT NULL,
is_active boolean NOT NULL DEFAULT true,
secret text,
tenant_id uuid,
created_at timestamptz NOT NULL DEFAULT now()
);
DO $$
BEGIN
IF NOT EXISTS (
SELECT 1 FROM information_schema.table_constraints
WHERE constraint_schema='cp' AND table_name='webhooks' AND constraint_name='webhooks_tenant_fkey'
) THEN
ALTER TABLE cp.webhooks
ADD CONSTRAINT webhooks_tenant_fkey FOREIGN KEY (tenant_id) REFERENCES cp.tenants(id) ON DELETE SET NULL;
END IF;
END$$;

-- 5) tenant_settings
CREATE TABLE IF NOT EXISTS cp.tenant_settings (
tenant_id uuid PRIMARY KEY,
logo_url text,
color_primary text,
timezone text,
locale text,
metadata jsonb,
created_at timestamptz NOT NULL DEFAULT now(),
updated_at timestamptz NOT NULL DEFAULT now()
);
DO $$
BEGIN
IF NOT EXISTS (
SELECT 1 FROM information_schema.table_constraints
WHERE constraint_schema='cp' AND table_name='tenant_settings' AND constraint_name='tenant_settings_tenant_fkey'
) THEN
ALTER TABLE cp.tenant_settings
ADD CONSTRAINT tenant_settings_tenant_fkey FOREIGN KEY (tenant_id) REFERENCES cp.tenants(id) ON DELETE CASCADE;
END IF;
END$$;

-- 6) tenant_plan
CREATE TABLE IF NOT EXISTS cp.tenant_plan (
id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
tenant_id uuid NOT NULL,
plan_id uuid NOT NULL,
status text NOT NULL,
starts_at timestamptz NOT NULL,
ends_at timestamptz,
auto_renew boolean NOT NULL DEFAULT true,
metadata jsonb
);
DO $$
BEGIN
IF NOT EXISTS (
SELECT 1 FROM information_schema.table_constraints
WHERE constraint_schema='cp' AND table_name='tenant_plan' AND constraint_name='tenant_plan_tenant_fkey'
) THEN
ALTER TABLE cp.tenant_plan
ADD CONSTRAINT tenant_plan_tenant_fkey FOREIGN KEY (tenant_id) REFERENCES cp.tenants(id) ON DELETE CASCADE;
END IF;
IF NOT EXISTS (
SELECT 1 FROM information_schema.table_constraints
WHERE constraint_schema='cp' AND table_name='tenant_plan' AND constraint_name='tenant_plan_plan_fkey'
) THEN
ALTER TABLE cp.tenant_plan
ADD CONSTRAINT tenant_plan_plan_fkey FOREIGN KEY (plan_id) REFERENCES cp.plans(id) ON DELETE RESTRICT;
END IF;
END$$;

-- 7) tenant_modules
CREATE TABLE IF NOT EXISTS cp.tenant_modules (
tenant_id uuid NOT NULL,
module_id uuid NOT NULL,
enabled boolean NOT NULL DEFAULT true,
metadata jsonb,
PRIMARY KEY (tenant_id, module_id)
);
DO $$
BEGIN
IF NOT EXISTS (
SELECT 1 FROM information_schema.table_constraints
WHERE constraint_schema='cp' AND table_name='tenant_modules' AND constraint_name='tenant_modules_tenant_fkey'
) THEN
ALTER TABLE cp.tenant_modules
ADD CONSTRAINT tenant_modules_tenant_fkey FOREIGN KEY (tenant_id) REFERENCES cp.tenants(id) ON DELETE CASCADE;
END IF;
IF NOT EXISTS (
SELECT 1 FROM information_schema.table_constraints
WHERE constraint_schema='cp' AND table_name='tenant_modules' AND constraint_name='tenant_modules_module_fkey'
) THEN
ALTER TABLE cp.tenant_modules
ADD CONSTRAINT tenant_modules_module_fkey FOREIGN KEY (module_id) REFERENCES cp.modules_registry(id) ON DELETE RESTRICT;
END IF;
END$$;

-- 8) billing_events
CREATE TABLE IF NOT EXISTS cp.billing_events (
id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
tenant_id uuid NOT NULL,
amount_cents integer NOT NULL,
currency text NOT NULL,
items jsonb NOT NULL,
status text NOT NULL,
period_start date NOT NULL,
period_end date NOT NULL,
created_at timestamptz NOT NULL DEFAULT now(),
updated_at timestamptz NOT NULL DEFAULT now()
);
DO $$
BEGIN
IF NOT EXISTS (
SELECT 1 FROM information_schema.table_constraints
WHERE constraint_schema='cp' AND table_name='billing_events' AND constraint_name='billing_events_tenant_fkey'
) THEN
ALTER TABLE cp.billing_events
ADD CONSTRAINT billing_events_tenant_fkey FOREIGN KEY (tenant_id) REFERENCES cp.tenants(id) ON DELETE CASCADE;
END IF;
END$$;

-- 9) payments
CREATE TABLE IF NOT EXISTS cp.payments (
id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
billing_event_id uuid NOT NULL,
provider text NOT NULL,
status text NOT NULL,
amount_cents integer NOT NULL,
currency text NOT NULL,
payload jsonb NOT NULL,
provider_ref text,
created_at timestamptz NOT NULL DEFAULT now()
);
DO $$
BEGIN
IF NOT EXISTS (
SELECT 1 FROM information_schema.table_constraints
WHERE constraint_schema='cp' AND table_name='payments' AND constraint_name='payments_billing_event_fkey'
) THEN
ALTER TABLE cp.payments
ADD CONSTRAINT payments_billing_event_fkey FOREIGN KEY (billing_event_id) REFERENCES cp.billing_events(id) ON DELETE CASCADE;
END IF;
END$$;

-- 10) system_events (bigserial id)
CREATE TABLE IF NOT EXISTS cp.system_events (
id bigserial PRIMARY KEY,
tenant_id uuid,
actor_user_id uuid,
type text NOT NULL,
message text,
data jsonb,
created_at timestamptz NOT NULL DEFAULT now()
);
DO $$
BEGIN
IF NOT EXISTS (
SELECT 1 FROM information_schema.table_constraints
WHERE constraint_schema='cp' AND table_name='system_events' AND constraint_name='system_events_tenant_fkey'
) THEN
ALTER TABLE cp.system_events
ADD CONSTRAINT system_events_tenant_fkey FOREIGN KEY (tenant_id) REFERENCES cp.tenants(id) ON DELETE SET NULL;
END IF;
END$$;

-- 11) usage_counters (bigserial id)
CREATE TABLE IF NOT EXISTS cp.usage_counters (
id bigserial PRIMARY KEY,
tenant_id uuid NOT NULL,
metric text NOT NULL,
value numeric NOT NULL,
period_start date NOT NULL,
period_end date NOT NULL,
updated_at timestamptz NOT NULL DEFAULT now()
);
DO $$
BEGIN
IF NOT EXISTS (
SELECT 1 FROM information_schema.table_constraints
WHERE constraint_schema='cp' AND table_name='usage_counters' AND constraint_name='usage_counters_tenant_fkey'
) THEN
ALTER TABLE cp.usage_counters
ADD CONSTRAINT usage_counters_tenant_fkey FOREIGN KEY (tenant_id) REFERENCES cp.tenants(id) ON DELETE CASCADE;
END IF;
END$$;

-- 12) v_users (recreate defensively)
DO $$
BEGIN
IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema='cp' AND table_name='v_users') THEN
EXECUTE 'DROP VIEW IF EXISTS cp.v_users';
END IF;
END$$;
CREATE VIEW cp.v_users AS
SELECT
u.id,
u.email,
u.created_at,
u.last_sign_in_at,
COALESCE(m.tenants_count, 0)::integer AS tenants_count
FROM auth.users u
LEFT JOIN (
SELECT user_id, COUNT(*) AS tenants_count
FROM cp.user_tenant_roles
GROUP BY user_id
) m ON m.user_id = u.id;

-- Optional: RLS placeholders (tighten as needed)
ALTER TABLE IF EXISTS cp.user_tenant_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS cp.webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS cp.tenant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS cp.tenant_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS cp.tenant_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS cp.modules_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS cp.plan_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS cp.billing_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS cp.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS cp.system_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS cp.usage_counters ENABLE ROW LEVEL SECURITY;

COMMIT;