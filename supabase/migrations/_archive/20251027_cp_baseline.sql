-- Control Plane baseline (idempotent)
create schema if not exists cp;
create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp";

-- Tenants and Domains
create table if not exists cp.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  plan text,
  status text default 'active',
  created_at timestamptz default now()
);

create table if not exists cp.domains (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references cp.tenants(id) on delete cascade,
  domain text not null unique,
  is_default boolean not null default false,
  created_at timestamptz default now()
);
create index if not exists idx_cp_domains_tenant on cp.domains(tenant_id);
create index if not exists idx_cp_domains_default on cp.domains(tenant_id, is_default);

-- API keys and logs
create table if not exists cp.api_keys (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references cp.tenants(id) on delete cascade,
  name text not null,
  created_at timestamptz default now()
);
-- Ensure columns for hashing/expiry exist (for older schemas)
alter table cp.api_keys add column if not exists key_hash text;
alter table cp.api_keys add column if not exists last4 text;
alter table cp.api_keys add column if not exists scope text;
alter table cp.api_keys add column if not exists expires_at timestamptz;
create unique index if not exists ux_cp_api_keys_key_hash on cp.api_keys(key_hash);

create table if not exists cp.api_key_logs (
  id uuid primary key default gen_random_uuid(),
  api_key_id uuid references cp.api_keys(id) on delete set null,
  tenant_id uuid references cp.tenants(id) on delete set null,
  action text not null,
  meta jsonb,
  created_at timestamptz default now()
);

drop view if exists cp.v_api_key_usage_daily cascade;
create view cp.v_api_key_usage_daily as
select date_trunc('day', created_at) as day, tenant_id, count(*) as calls
from cp.api_key_logs
group by 1,2;

-- Webhooks
create table if not exists cp.webhook_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid,
  source text,
  event text,
  status text,
  payload jsonb,
  response jsonb,
  created_at timestamptz default now()
);
create index if not exists idx_cp_webhook_logs_tenant on cp.webhook_logs(tenant_id);
create index if not exists idx_cp_webhook_logs_event on cp.webhook_logs(event);
create index if not exists idx_cp_webhook_logs_created on cp.webhook_logs(created_at desc);

-- Billing / Financeiro
create table if not exists cp.plans (
  code text primary key,
  name text not null,
  price_cents integer not null,
  currency text not null default 'BRL',
  interval text not null default 'month',
  active boolean not null default true,
  created_at timestamptz default now()
);

create table if not exists cp.subscriptions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references cp.tenants(id) on delete cascade,
  plan_code text references cp.plans(code),
  status text default 'active',
  current_period_end timestamptz,
  created_at timestamptz default now()
);

create table if not exists cp.invoices (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references cp.tenants(id) on delete set null,
  amount_cents integer not null,
  currency text not null default 'BRL',
  status text not null default 'draft',
  external_id text,
  created_at timestamptz default now(),
  paid_at timestamptz
);

create table if not exists cp.ledger_accounts (
  code text primary key,
  name text not null,
  type text not null
);

create table if not exists cp.ledger_entries (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references cp.tenants(id) on delete set null,
  account_code text references cp.ledger_accounts(code),
  amount_cents integer not null,
  direction text not null,
  memo text,
  created_at timestamptz default now(),
  invoice_id uuid references cp.invoices(id) on delete set null
);

-- Leads (Control CRM)
create table if not exists cp.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  stage text default 'novo',
  owner_id uuid,
  tenant_id uuid,
  created_at timestamptz default now()
);
create index if not exists idx_cp_leads_stage on cp.leads(stage);
create index if not exists idx_cp_leads_owner on cp.leads(owner_id);

-- Extend leads with columns used by UI endpoints (idempotent)
alter table cp.leads add column if not exists organization_name text;
alter table cp.leads add column if not exists phone text;
alter table cp.leads add column if not exists source text;
alter table cp.leads add column if not exists value_cents integer;

-- Organization contacts per tenant (for /control/orgs/[id])
create table if not exists cp.contacts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references cp.tenants(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  role text,
  is_primary boolean default false,
  created_at timestamptz default now()
);
create index if not exists idx_cp_contacts_tenant on cp.contacts(tenant_id);

-- Grants and RLS (permissive read for authenticated)
grant usage on schema cp to authenticated;

alter table cp.tenants enable row level security;
drop policy if exists control_read_tenants on cp.tenants;
create policy control_read_tenants on cp.tenants for select to authenticated using (true);

alter table cp.domains enable row level security;
drop policy if exists control_read_domains on cp.domains;
create policy control_read_domains on cp.domains for select to authenticated using (true);

alter table cp.api_keys enable row level security;
drop policy if exists control_read_api_keys on cp.api_keys;
create policy control_read_api_keys on cp.api_keys for select to authenticated using (true);

alter table cp.api_key_logs enable row level security;
drop policy if exists control_read_api_key_logs on cp.api_key_logs;
create policy control_read_api_key_logs on cp.api_key_logs for select to authenticated using (true);

alter table cp.webhook_logs enable row level security;
drop policy if exists control_read_webhook_logs on cp.webhook_logs;
create policy control_read_webhook_logs on cp.webhook_logs for select to authenticated using (true);

alter table cp.leads enable row level security;
drop policy if exists control_read_leads on cp.leads;
create policy control_read_leads on cp.leads for select to authenticated using (true);

alter table cp.invoices enable row level security;
drop policy if exists control_read_invoices on cp.invoices;
create policy control_read_invoices on cp.invoices for select to authenticated using (true);

alter table cp.ledger_accounts enable row level security;
drop policy if exists control_read_ledger_accounts on cp.ledger_accounts;
create policy control_read_ledger_accounts on cp.ledger_accounts for select to authenticated using (true);

alter table cp.ledger_entries enable row level security;
drop policy if exists control_read_ledger_entries on cp.ledger_entries;
create policy control_read_ledger_entries on cp.ledger_entries for select to authenticated using (true);

grant select on table cp.v_api_key_usage_daily to authenticated;

-- Seeds mínimos (opcional)
insert into cp.tenants (name, slug, plan)
values ('NORO (Plataforma)', 'noro', 'pro')
on conflict (slug) do nothing;

insert into cp.ledger_accounts (code,name,type) values
 ('1000','Caixa','asset'),
 ('2000','Impostos a Recolher','liability'),
 ('3000','Taxas de Processamento','expense'),
 ('4000','Receita Plataforma','revenue')
on conflict (code) do nothing;

-- corrected seed to match current schema
insert into cp.leads (organization_name, email, stage)
values ('Empresa XYZ','contato@xyz.com','novo')
on conflict do nothing;
