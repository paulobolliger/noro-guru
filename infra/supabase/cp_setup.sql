-- NORO Control Plane - cp schema setup

-- 1) Schema base
create schema if not exists cp;

-- 2) Tabela principal
create table if not exists cp.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  plan text default 'starter',
  status text default 'active',
  billing_email text,
  next_invoice_date date,
  created_at timestamptz default now()
);

-- 3) RPC de listagem
create or replace function cp.cp_select_tenants()
returns table (
  id uuid,
  name text,
  slug text,
  plan text,
  status text,
  billing_email text,
  next_invoice_date date,
  created_at timestamptz
)
language sql stable as $$
  select t.id, t.name, t.slug, t.plan, t.status, t.billing_email, t.next_invoice_date, t.created_at
  from cp.tenants t
  order by t.created_at desc;
$$;

grant execute on function cp.cp_select_tenants() to anon, authenticated, service_role;

-- 4) RPC do dashboard
create or replace function cp.cp_dashboard_overview()
returns table (
  tenant_id uuid,
  tenant_name text,
  plan text,
  status text,
  total_users int,
  total_events int,
  last_event_at timestamptz
)
language sql stable security definer as $$
  select
    t.id as tenant_id,
    t.name as tenant_name,
    t.plan,
    t.status,
    0 as total_users,
    0 as total_events,
    null::timestamptz as last_event_at
  from cp.tenants t
  order by t.created_at desc;
$$;

grant execute on function cp.cp_dashboard_overview() to anon, authenticated, service_role;

-- 5) Seeds de teste
insert into cp.tenants (name, slug, plan, status, billing_email, next_invoice_date)
values
  ('Nomade Guru', 'nomade', 'pro', 'active', 'financeiro@nomade.guru', now()::date + 30),
  ('SafeTrip Guru', 'safetrip', 'starter', 'active', 'billing@safetrip.guru', now()::date + 30),
  ('Vistos Guru', 'vistos', 'pro', 'paused', 'finance@vistos.guru', now()::date + 15)
on conflict (slug) do nothing;
