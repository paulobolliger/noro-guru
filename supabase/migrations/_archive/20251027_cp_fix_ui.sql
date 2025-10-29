-- Fixes to align DB with Control UI expectations (idempotent)
create schema if not exists cp;

-- Contacts used in /control/orgs/[id]
create table if not exists cp.contacts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references cp.tenants(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  role text,
  is_primary boolean default false,
  created_at timestamptz default now()
);
create index if not exists idx_cp_contacts_tenant on cp.contacts(tenant_id);

-- Notes timeline in org detail
create table if not exists cp.notes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references cp.tenants(id) on delete cascade,
  entity_type text not null,
  entity_id uuid not null,
  content text not null,
  created_by uuid,
  created_at timestamptz default now()
);
create index if not exists idx_cp_notes_tenant on cp.notes(tenant_id);

-- API keys: ensure column name used by app (hash)
alter table cp.api_keys add column if not exists hash text;
create unique index if not exists ux_cp_api_keys_hash on cp.api_keys(hash) where hash is not null;

-- Usage daily view expected by UI
drop view if exists cp.v_api_key_usage_daily cascade;
create view cp.v_api_key_usage_daily as
select
  null::uuid as key_id,
  date_trunc('day', created_at) as day,
  count(*)::int as calls,
  null::numeric as avg_ms,
  0::int as errors
from cp.api_key_logs
group by 2;

-- Leads: trigger to set owner_id and simplified policies
create or replace function cp.set_owner_id()
returns trigger
language plpgsql
as $$
begin
  if new.owner_id is null then
    new.owner_id := auth.uid();
  end if;
  return new;
end;
$$;

drop trigger if exists trg_cp_leads_set_owner on cp.leads;
create trigger trg_cp_leads_set_owner
before insert on cp.leads
for each row execute procedure cp.set_owner_id();

alter table cp.leads enable row level security;

do $$
declare r record;
begin
  for r in select policyname from pg_policies where schemaname='cp' and tablename='leads'
  loop
    execute format('drop policy if exists %I on cp.leads', r.policyname);
  end loop;
end$$;

create policy leads_select_all
on cp.leads for select to authenticated using (true);

create policy leads_insert_auth
on cp.leads for insert to authenticated with check (true);

create policy leads_update_owner
on cp.leads for update to authenticated
using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- Optional public intake (kept enabled to unblock /public/leads)
drop policy if exists leads_insert_public on cp.leads;
create policy leads_insert_public
on cp.leads for insert to anon with check (true);

-- RLS and grants for contacts/notes minimal
alter table cp.contacts enable row level security;
alter table cp.notes enable row level security;

DO $$
BEGIN
  -- Contacts
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'cp' AND tablename = 'contacts' AND policyname = 'contacts_select_all'
  ) THEN
    EXECUTE 'CREATE POLICY contacts_select_all ON cp.contacts FOR SELECT TO authenticated USING (true)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'cp' AND tablename = 'contacts' AND policyname = 'contacts_insert_all'
  ) THEN
    EXECUTE 'CREATE POLICY contacts_insert_all ON cp.contacts FOR INSERT TO authenticated WITH CHECK (true)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'cp' AND tablename = 'contacts' AND policyname = 'contacts_update_all'
  ) THEN
    EXECUTE 'CREATE POLICY contacts_update_all ON cp.contacts FOR UPDATE TO authenticated USING (true) WITH CHECK (true)';
  END IF;

  -- Notes
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'cp' AND tablename = 'notes' AND policyname = 'notes_select_all'
  ) THEN
    EXECUTE 'CREATE POLICY notes_select_all ON cp.notes FOR SELECT TO authenticated USING (true)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'cp' AND tablename = 'notes' AND policyname = 'notes_insert_all'
  ) THEN
    EXECUTE 'CREATE POLICY notes_insert_all ON cp.notes FOR INSERT TO authenticated WITH CHECK (true)';
  END IF;
END$$;

-- Grants
grant usage on schema cp to authenticated;
grant select, insert, update on cp.leads to authenticated;
grant insert on cp.leads to anon;
grant select, insert, update, delete on cp.contacts to authenticated;
grant select, insert on cp.notes to authenticated;
grant select on cp.tenants, cp.domains, cp.api_keys, cp.api_key_logs, cp.invoices, cp.ledger_accounts, cp.ledger_entries to authenticated;
