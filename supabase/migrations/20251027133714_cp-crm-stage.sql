-- cp CRM (Control) - leads, contacts, tasks, notes

-- 1) Leads (podem não ter tenant ainda)
create table if not exists cp.leads (
  id uuid primary key default gen_random_uuid(),
  organization_name text,
  email text,
  phone text,
  source text,
  stage text default 'novo', -- novo, qualificado, proposta, ganho, perdido
  value_cents int4 default 0,
  owner_id uuid, -- auth.users.id
  tenant_id uuid references cp.tenants(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) Contacts (vínculos com tenant)
create table if not exists cp.contacts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references cp.tenants(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  role text,
  is_primary boolean default false,
  created_at timestamptz not null default now()
);

-- 3) Tasks (tarefas operacionais Control)
create table if not exists cp.tasks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references cp.tenants(id) on delete set null,
  title text not null,
  status text default 'aberta', -- aberta, em_andamento, concluida, cancelada
  due_date date,
  assigned_to uuid, -- auth.users.id
  entity_type text, -- 'tenant' | 'lead' | 'outro'
  entity_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4) Notes (timeline)
create table if not exists cp.notes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references cp.tenants(id) on delete set null,
  entity_type text not null,
  entity_id uuid not null,
  content text not null,
  created_by uuid not null,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_cp_contacts_tenant on cp.contacts(tenant_id);
create index if not exists idx_cp_tasks_tenant on cp.tasks(tenant_id);
create index if not exists idx_cp_notes_tenant on cp.notes(tenant_id);
create index if not exists idx_cp_leads_stage on cp.leads(stage);

-- RLS (mínimo viável: authenticated pode operar; podemos refinar por owner/tenant depois)
alter table cp.leads enable row level security;
drop policy if exists p_cp_leads_all on cp.leads;
create policy p_cp_leads_all on cp.leads for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

alter table cp.contacts enable row level security;
drop policy if exists p_cp_contacts_all on cp.contacts;
create policy p_cp_contacts_all on cp.contacts for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

alter table cp.tasks enable row level security;
drop policy if exists p_cp_tasks_all on cp.tasks;
create policy p_cp_tasks_all on cp.tasks for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

alter table cp.notes enable row level security;
drop policy if exists p_cp_notes_all on cp.notes;
create policy p_cp_notes_all on cp.notes for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
