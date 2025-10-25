-- Step 11: Real metrics for dashboard

-- 1) Garantir tabela de eventos
create table if not exists cp.system_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references cp.tenants(id) on delete cascade,
  event_type text not null,
  description text,
  created_at timestamptz default now()
);

-- 1b) Criar tabela users em cada schema de tenant (se não existir)
do $$
declare
  r record;
begin
  for r in select slug from cp.tenants loop
    execute format('create table if not exists tenant_%I.users (
      id uuid primary key default gen_random_uuid(),
      email text,
      created_at timestamptz default now()
    )', r.slug);
  end loop;
end$$;

-- 2) Atualizar RPC cp.cp_dashboard_overview com contagens reais
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
  r record;
  query text;
  count_users int;
  count_events int;
  last_event timestamptz;
begin
  for r in select * from cp.tenants order by created_at desc loop
    -- Conta usuários dinamicamente
    query := format('select count(*) from tenant_%I.users', r.slug);
    begin
      execute query into count_users;
    exception when others then
      count_users := 0;
    end;

    -- Conta eventos registrados no Control Plane
    select count(*), max(created_at)
      into count_events, last_event
    from cp.system_events
    where tenant_id = r.id;

    tenant_id := r.id;
    tenant_name := r.name;
    plan := r.plan;
    status := r.status;
    total_users := coalesce(count_users, 0);
    total_events := coalesce(count_events, 0);
    last_event_at := last_event;
    return next;
  end loop;
end;
$$;

grant execute on function cp.cp_dashboard_overview() to anon, authenticated, service_role;

-- 3) Dados simulados para visual
insert into cp.system_events (tenant_id, event_type, description)
select id, 'USER_CREATED', 'Usuário inicial criado'
from cp.tenants
on conflict do nothing;

insert into cp.system_events (tenant_id, event_type, description)
select id, 'ORDER_PLACED', 'Pedido de demonstração criado'
from cp.tenants
on conflict do nothing;

do $$
declare
  r record;
begin
  for r in select slug from cp.tenants loop
    execute format('insert into tenant_%I.users (email) values (%L), (%L)',
      r.slug,
      format('admin@%s.guru', r.slug),
      format('user@%s.guru', r.slug)
    );
  end loop;
end$$;
