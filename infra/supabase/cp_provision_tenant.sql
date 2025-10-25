-- cp.provision_tenant RPC and system_events table

-- Ensure events table exists
create table if not exists cp.system_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references cp.tenants(id) on delete cascade,
  event_type text not null,
  description text,
  created_at timestamptz default now()
);

-- RPC: cria um novo tenant
create or replace function cp.provision_tenant(
  p_name text,
  p_slug text,
  p_plan text default 'starter',
  p_billing_email text default null
)
returns uuid
language plpgsql
security definer
as $$
declare
  new_tenant_id uuid;
  schema_name text;
begin
  -- 1. Cria registro no cp.tenants
  insert into cp.tenants (name, slug, plan, billing_email)
  values (p_name, p_slug, p_plan, p_billing_email)
  returning id into new_tenant_id;

  -- 2. Cria schema do tenant
  schema_name := format('tenant_%s', p_slug);
  execute format('create schema if not exists %I', schema_name);

  -- 3. Cria usuário admin inicial (stub)
  execute format('create table if not exists %I.users (id uuid primary key default gen_random_uuid(), email text, created_at timestamptz default now())', schema_name);

  -- 4. Loga o evento
  insert into cp.system_events (tenant_id, event_type, description)
  values (new_tenant_id, 'TENANT_PROVISIONED', format('Tenant %s provisionado com schema %s', p_name, schema_name));

  return new_tenant_id;
end;
$$;

