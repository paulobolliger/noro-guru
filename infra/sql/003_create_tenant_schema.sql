-- 003_create_tenant_schema.sql
-- Cria um schema dedicado para o tenant e inicializa tabelas básicas
-- Uso: select public.create_tenant_schema('tenant_acme');

create or replace function public.create_tenant_schema(p_schema_name text)
returns boolean
language plpgsql
security definer
as $$
begin
  if p_schema_name is null or length(p_schema_name) = 0 then
    raise exception 'schema inválido';
  end if;

  -- Evita recriação
  if exists(select 1 from information_schema.schemata s where s.schema_name = p_schema_name) then
    return true; -- idempotente
  end if;

  execute format('create schema %I', p_schema_name);

  -- Tabela de configurações do tenant
  execute format($$ create table %I.settings (
      id uuid primary key default gen_random_uuid(),
      key text not null,
      value jsonb,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    ); $$, p_schema_name);

  -- Exemplo: preferencias/empresa do tenant (placeholder inicial)
  execute format($$ create table %I.company (
      id uuid primary key default gen_random_uuid(),
      name text not null,
      created_at timestamptz not null default now()
    ); $$, p_schema_name);

  return true;
end;
$$;

