-- 006_create_cp_schema.sql
-- NORO Control Plane (schema cp)

create schema if not exists cp;

-- ---------- Helpers de segurança ----------
create or replace function cp.is_super_admin(uid uuid)
returns boolean
language sql
stable
as $$
  select coalesce(
    (select (raw_app_meta_data->>'super_admin')::boolean
     from auth.users where id = uid), false);
$$;

create or replace function cp.is_member(uid uuid, tenant_id uuid)
returns boolean
language sql
stable
as $$
  select exists(
    select 1 from cp.user_tenant_roles utr
    where utr.user_id = uid and utr.tenant_id = tenant_id
  );
$$;

create or replace function cp.has_role(uid uuid, tenant_id uuid, role_text text)
returns boolean
language sql
stable
as $$
  select exists(
    select 1 from cp.user_tenant_roles utr
    where utr.user_id = uid and utr.tenant_id = tenant_id and utr.role = role_text
  );
$$;

-- ---------- Núcleo do Control Plane ----------
create table if not exists cp.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  status text not null default 'provisioning', -- provisioning | active | paused | past_due | disabled
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists cp.tenant_settings (
  tenant_id uuid primary key references cp.tenants(id) on delete cascade,
  locale text default 'pt-BR',
  timezone text default 'America/Sao_Paulo',
  color_primary text default '#5053c4',
  logo_url text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists cp.plans (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,              -- e.g. starter, pro, enterprise
  name text not null,
  price_cents integer not null default 0, -- base mensal
  currency text not null default 'BRL',
  is_active boolean not null default true,
  sort_order int not null default 100,
  metadata jsonb default '{}'::jsonb
);

create table if not exists cp.plan_features (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references cp.plans(id) on delete cascade,
  key text not null,          -- e.g. users.max, automations.daily, storage.gb
  value text not null,        -- usar texto pra flexibilidade (convert no app)
  unique(plan_id, key)
);

create table if not exists cp.tenant_plan (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references cp.tenants(id) on delete cascade,
  plan_id uuid not null references cp.plans(id) on delete restrict,
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  auto_renew boolean not null default true,
  status text not null default 'active', -- active | canceled | trial
  metadata jsonb default '{}'::jsonb
);

create table if not exists cp.modules_registry (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,    -- crm, sales, finance, projects, docs, catalog, ai, integrations
  name text not null,
  is_core boolean not null default false,
  is_active boolean not null default true,
  metadata jsonb default '{}'::jsonb
);

create table if not exists cp.tenant_modules (
  tenant_id uuid not null references cp.tenants(id) on delete cascade,
  module_id uuid not null references cp.modules_registry(id) on delete restrict,
  enabled boolean not null default true,
  metadata jsonb default '{}'::jsonb,
  primary key (tenant_id, module_id)
);

create table if not exists cp.user_tenant_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  tenant_id uuid not null references cp.tenants(id) on delete cascade,
  role text not null check (role in ('admin','manager','agent','finance','viewer')),
  created_at timestamptz not null default now(),
  unique(user_id, tenant_id)
);

-- Medição e faturamento
create table if not exists cp.usage_counters (
  id bigserial primary key,
  tenant_id uuid not null references cp.tenants(id) on delete cascade,
  period_start date not null,      -- primeiro dia do mês, por ex.
  period_end date not null,        -- último dia do mês
  metric text not null,            -- e.g. automations.run, storage.gb, ai.tokens
  value numeric not null default 0,
  updated_at timestamptz not null default now(),
  unique(tenant_id, period_start, metric)
);

create table if not exists cp.billing_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references cp.tenants(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  amount_cents integer not null default 0,
  currency text not null default 'BRL',
  status text not null default 'open', -- open | paid | failed | canceled
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists cp.payments (
  id uuid primary key default gen_random_uuid(),
  billing_event_id uuid not null references cp.billing_events(id) on delete cascade,
  provider text not null,          -- stripe | mercadopago | odoo
  provider_ref text,               -- id da cobrança no PSP
  amount_cents integer not null,
  currency text not null default 'BRL',
  status text not null,            -- paid | pending | failed | refunded
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Auditoria e integrações
create table if not exists cp.system_events (
  id bigserial primary key,
  actor_user_id uuid,
  tenant_id uuid,
  type text not null,              -- TENANT_PROVISIONED, PLAN_CHANGED, PAYMENT_CONFIRMED, etc.
  message text,
  data jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists cp.api_keys (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references cp.tenants(id) on delete cascade,
  name text not null,
  hash text not null,              -- hash da chave; nunca armazene plaintext
  last4 text not null,
  scope text[] not null default array[]::text[], -- e.g. {'read:leads','write:orders'}
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  unique (tenant_id, name)
);

create table if not exists cp.webhooks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references cp.tenants(id) on delete cascade,
  code text not null,            -- tenant_provisioned, payment_updated, etc
  url text not null,
  secret text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (tenant_id, code)
);

-- ---------- Triggers de updated_at ----------
create or replace function cp.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_tenants_touch on cp.tenants;
create trigger trg_tenants_touch before update on cp.tenants
for each row execute procedure cp.touch_updated_at();

drop trigger if exists trg_tenant_settings_touch on cp.tenant_settings;
create trigger trg_tenant_settings_touch before update on cp.tenant_settings
for each row execute procedure cp.touch_updated_at();

drop trigger if exists trg_billing_events_touch on cp.billing_events;
create trigger trg_billing_events_touch before update on cp.billing_events
for each row execute procedure cp.touch_updated_at();

-- ---------- RLS ----------
alter table cp.tenants enable row level security;
alter table cp.tenant_settings enable row level security;
alter table cp.plans enable row level security;
alter table cp.plan_features enable row level security;
alter table cp.tenant_plan enable row level security;
alter table cp.modules_registry enable row level security;
alter table cp.tenant_modules enable row level security;
alter table cp.user_tenant_roles enable row level security;
alter table cp.usage_counters enable row level security;
alter table cp.billing_events enable row level security;
alter table cp.payments enable row level security;
alter table cp.system_events enable row level security;
alter table cp.api_keys enable row level security;
alter table cp.webhooks enable row level security;

-- Políticas: por agora, apenas SUPER ADMIN enxerga/edita o Control Plane
do $$
begin
  perform 1;
  -- Tenha políticas mínimas de leitura e escrita para super_admin
  execute $p$
    create policy cp_read_all_superadmin on cp.tenants
    for select using (cp.is_super_admin(auth.uid()));
  $p$;

  execute $p$
    create policy cp_write_all_superadmin on cp.tenants
    for all using (cp.is_super_admin(auth.uid()));
  $p$;

  -- Repete para todas as tabelas do cp
  -- (Dica: em produção, crie uma função para aplicar automaticamente, mas aqui vai explícito)
  create policy p_read_super_plans on cp.plans for select using (cp.is_super_admin(auth.uid()));
  create policy p_write_super_plans on cp.plans for all using (cp.is_super_admin(auth.uid()));

  create policy p_read_super_plan_features on cp.plan_features for select using (cp.is_super_admin(auth.uid()));
  create policy p_write_super_plan_features on cp.plan_features for all using (cp.is_super_admin(auth.uid()));

  create policy p_read_super_tenant_plan on cp.tenant_plan for select using (cp.is_super_admin(auth.uid()));
  create policy p_write_super_tenant_plan on cp.tenant_plan for all using (cp.is_super_admin(auth.uid()));

  create policy p_read_super_modules on cp.modules_registry for select using (cp.is_super_admin(auth.uid()));
  create policy p_write_super_modules on cp.modules_registry for all using (cp.is_super_admin(auth.uid()));

  create policy p_read_super_tenant_modules on cp.tenant_modules for select using (cp.is_super_admin(auth.uid()));
  create policy p_write_super_tenant_modules on cp.tenant_modules for all using (cp.is_super_admin(auth.uid()));

  create policy p_read_super_user_roles on cp.user_tenant_roles for select using (cp.is_super_admin(auth.uid()));
  create policy p_write_super_user_roles on cp.user_tenant_roles for all using (cp.is_super_admin(auth.uid()));

  create policy p_read_super_usage on cp.usage_counters for select using (cp.is_super_admin(auth.uid()));
  create policy p_write_super_usage on cp.usage_counters for all using (cp.is_super_admin(auth.uid()));

  create policy p_read_super_billing on cp.billing_events for select using (cp.is_super_admin(auth.uid()));
  create policy p_write_super_billing on cp.billing_events for all using (cp.is_super_admin(auth.uid()));

  create policy p_read_super_payments on cp.payments for select using (cp.is_super_admin(auth.uid()));
  create policy p_write_super_payments on cp.payments for all using (cp.is_super_admin(auth.uid()));

  create policy p_read_super_events on cp.system_events for select using (cp.is_super_admin(auth.uid()));
  create policy p_write_super_events on cp.system_events for all using (cp.is_super_admin(auth.uid()));

  create policy p_read_super_keys on cp.api_keys for select using (cp.is_super_admin(auth.uid()));
  create policy p_write_super_keys on cp.api_keys for all using (cp.is_super_admin(auth.uid()));

  create policy p_read_super_webhooks on cp.webhooks for select using (cp.is_super_admin(auth.uid()));
  create policy p_write_super_webhooks on cp.webhooks for all using (cp.is_super_admin(auth.uid()));

  create policy p_read_super_settings on cp.tenant_settings for select using (cp.is_super_admin(auth.uid()));
  create policy p_write_super_settings on cp.tenant_settings for all using (cp.is_super_admin(auth.uid()));
end $$;
