-- 001_init_core.sql
-- Extensão para uuid
create extension if not exists pgcrypto;

-- Tabela de tenants do SaaS (escopo público)
create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  schema_name text not null unique,
  status text not null default 'creating',
  created_at timestamptz not null default now()
);

-- Indexes auxiliares
create index if not exists tenants_created_at_idx on public.tenants(created_at desc);
create index if not exists tenants_status_idx on public.tenants(status);
