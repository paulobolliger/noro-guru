-- Refine cp_list_users to include total_count for proper pagination

create or replace function cp.cp_list_users(
  p_limit int,
  p_offset int,
  p_search text
)
returns table (
  id uuid,
  email text,
  created_at timestamptz,
  last_sign_in_at timestamptz,
  tenants_count int,
  total_count int
)
language sql
stable
security definer
set search_path = cp, public
as $$
  with filtered as (
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
    ) m on m.user_id = u.id
    where (p_search is null or u.email ilike '%' || p_search || '%')
  )
  select f.*, count(*) over() as total_count
  from filtered f
  order by f.created_at desc
  limit p_limit
  offset p_offset
$$;

grant execute on function cp.cp_list_users(int, int, text) to anon, authenticated, service_role;

notify pgrst, 'reload schema';

