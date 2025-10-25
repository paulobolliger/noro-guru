-- Control Plane: Users area (views, RPCs, and grants)

create schema if not exists cp;

-- View for convenience (optional for PostgREST, used by RPCs)
create or replace view cp.v_users as
select
  u.id,
  u.email,
  u.created_at,
  u.last_sign_in_at,
  coalesce(m.tenants_count, 0) as tenants_count
from auth.users u
left join (
  select utr.user_id, count(distinct utr.tenant_id)::int as tenants_count
  from cp.user_tenant_roles utr
  group by utr.user_id
) m on m.user_id = u.id;

-- List users with optional search + pagination
create or replace function cp.cp_list_users(
  p_search text default null,
  p_limit int default 20,
  p_offset int default 0
)
returns table (
  id uuid,
  email text,
  created_at timestamptz,
  last_sign_in_at timestamptz,
  tenants_count int
)
language sql
stable
security definer
set search_path = cp, public
as $$
  select v.id, v.email, v.created_at, v.last_sign_in_at, v.tenants_count
  from cp.v_users v
  where (
    p_search is null
    or v.email ilike '%' || p_search || '%'
  )
  order by v.created_at desc
  limit coalesce(p_limit, 20)
  offset greatest(coalesce(p_offset, 0), 0);
$$;

-- Get single user basic info
create or replace function cp.cp_get_user(p_user_id uuid)
returns table (
  id uuid,
  email text,
  created_at timestamptz,
  last_sign_in_at timestamptz,
  tenants_count int
)
language sql
stable
security definer
set search_path = cp, public
as $$
  select v.id, v.email, v.created_at, v.last_sign_in_at, v.tenants_count
  from cp.v_users v
  where v.id = p_user_id;
$$;

-- List user memberships (tenant + role)
create or replace function cp.cp_list_user_memberships(p_user_id uuid)
returns table (
  tenant_id uuid,
  tenant_name text,
  tenant_slug text,
  role text
)
language sql
stable
security definer
set search_path = cp, public
as $$
  select
    t.id as tenant_id,
    t.name as tenant_name,
    t.slug as tenant_slug,
    utr.role
  from cp.user_tenant_roles utr
  join cp.tenants t on t.id = utr.tenant_id
  where utr.user_id = p_user_id
  order by t.name;
$$;

-- Upsert membership (returns the resulting row)
create or replace function cp.cp_upsert_membership(
  p_user_id uuid,
  p_tenant_id uuid,
  p_role text
)
returns table (user_id uuid, tenant_id uuid, role text)
language plpgsql
security definer
set search_path = cp, public
as $$
begin
  insert into cp.user_tenant_roles (user_id, tenant_id, role)
  values (p_user_id, p_tenant_id, p_role)
  on conflict (user_id, tenant_id)
  do update set role = excluded.role;

  return query
  select p_user_id, p_tenant_id, p_role;
end;
$$;

-- Remove membership (returns true if deleted)
create or replace function cp.cp_remove_membership(
  p_user_id uuid,
  p_tenant_id uuid
)
returns table (removed boolean)
language plpgsql
security definer
set search_path = cp, public
as $$
declare
  v_count int;
begin
  delete from cp.user_tenant_roles
  where user_id = p_user_id and tenant_id = p_tenant_id;

  get diagnostics v_count = row_count;
  return query select (v_count > 0);
end;
$$;

-- Grants
grant execute on function cp.cp_list_users(text, int, int) to anon, authenticated, service_role;
grant execute on function cp.cp_get_user(uuid) to anon, authenticated, service_role;
grant execute on function cp.cp_list_user_memberships(uuid) to anon, authenticated, service_role;
grant execute on function cp.cp_upsert_membership(uuid, uuid, text) to anon, authenticated, service_role;
grant execute on function cp.cp_remove_membership(uuid, uuid) to anon, authenticated, service_role;

-- Ensure visibility of schemas/tables
grant usage on schema cp to anon, authenticated, service_role;
grant select on all tables in schema cp to anon, authenticated, service_role;
alter default privileges in schema cp grant select on tables to anon, authenticated, service_role;

-- Minimal auth grants for service_role (avoid permission denied on auth.users)
grant usage on schema auth to service_role;
grant select on all tables in schema auth to service_role;

notify pgrst, 'reload schema';

