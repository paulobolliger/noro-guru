create table if not exists public.noro_domains (
  id uuid default gen_random_uuid() primary key,
  tenant_id uuid references public.tenants(id) on delete cascade not null,
  domain text not null unique,
  status text not null default 'pending' check (status in ('pending', 'active', 'invalid')),
  verified boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS Policies
alter table public.noro_domains enable row level security;

-- Admin/Service Role can do everything
create policy "Admins can do everything on domains"
  on public.noro_domains
  for all
  using ( auth.role() = 'service_role' )
  with check ( auth.role() = 'service_role' );

-- Tenants can read their own domains (if we expose this to tenants later)
create policy "Tenants can read own domains"
  on public.noro_domains
  for select
  using ( auth.uid() IN (SELECT user_id FROM public.user_tenants WHERE tenant_id = noro_domains.tenant_id) );
