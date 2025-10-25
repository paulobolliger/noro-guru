-- Ensure cp schema, functions, and API permissions are correct for PostgREST

-- 1) Base schema
create schema if not exists cp;

-- 2) Dashboard function (stable, security definer)
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
language plpgsql
stable
security definer
as $$
declare
  r cp.tenants%rowtype;
  q text;
  c_users int;
  c_events int;
  last_evt timestamptz;
begin
  for r in select t.* from cp.tenants t loop
    begin
      q := format('select count(*) from tenant_%I.users', r.slug);
      execute q into c_users;
    exception when others then
      c_users := 0;
    end;

    select count(*), max(created_at)
      into c_events, last_evt
    from cp.system_events se
    where se.tenant_id = r.id;

    tenant_id := r.id;
    tenant_name := r.name;
    plan := r.plan;
    status := r.status;
    total_users := coalesce(c_users, 0);
    total_events := coalesce(c_events, 0);
    last_event_at := last_evt;

    return next;
  end loop;
  return;
end;
$$;

grant execute on function cp.cp_dashboard_overview() to anon, authenticated, service_role;

-- 3) Tenants listing RPC (security definer, safe for PostgREST)
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
language sql
stable
security definer
set search_path = cp, public
as $$
  select
    t.id,
    t.name,
    t.slug,
    t.plan,
    t.status,
    t.billing_email,
    t.next_invoice_date,
    t.created_at
  from cp.tenants t
  order by t.created_at desc
$$;

grant execute on function cp.cp_select_tenants() to anon, authenticated, service_role;

-- 4) PostgREST visibility: cp schema grants
grant usage on schema cp to anon, authenticated, service_role;
grant select on all tables in schema cp to anon, authenticated, service_role;
grant usage on all sequences in schema cp to anon, authenticated, service_role;

alter default privileges in schema cp grant select on tables to anon, authenticated, service_role;
alter default privileges in schema cp grant usage on sequences to anon, authenticated, service_role;

-- 5) auth baseline for service_role (avoid permission denied on auth.* reads)
grant usage on schema auth to service_role;
grant select on all tables in schema auth to service_role;
grant usage on all sequences in schema auth to service_role;

alter default privileges in schema auth grant select on tables to service_role;
alter default privileges in schema auth grant usage on sequences to service_role;

-- 6) Refresh PostgREST schema cache
notify pgrst, 'reload schema';

