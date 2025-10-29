-- Grants + RLS needed for Control UI (idempotent)
grant usage on schema cp to authenticated;

-- Read access for authenticated
grant select on cp.tenants          to authenticated;
grant select on cp.domains          to authenticated;
grant select on cp.api_keys         to authenticated;
grant select on cp.api_key_logs     to authenticated;
grant select on cp.webhook_logs     to authenticated;
grant select on cp.invoices         to authenticated;
grant select on cp.ledger_accounts  to authenticated;
grant select on cp.ledger_entries   to authenticated;
grant select on cp.leads            to authenticated;
grant select on cp.contacts         to authenticated;

-- Write where UI needs it
grant insert, update on cp.leads    to authenticated;
grant insert, update on cp.contacts to authenticated;

-- Optional: allow public lead intake (anon)
grant insert on cp.leads to anon;

-- RLS for leads (insert/update by authenticated + anon insert for public endpoint)
alter table cp.leads enable row level security;
drop policy if exists control_read_leads on cp.leads;
create policy control_read_leads on cp.leads for select to authenticated using (true);

drop policy if exists control_insert_leads on cp.leads;
create policy control_insert_leads on cp.leads for insert to authenticated with check (true);

drop policy if exists control_update_leads on cp.leads;
create policy control_update_leads on cp.leads for update to authenticated using (true) with check (true);

drop policy if exists control_insert_leads_public on cp.leads;
create policy control_insert_leads_public on cp.leads for insert to anon with check (true);

-- RLS for contacts
alter table cp.contacts enable row level security;
drop policy if exists control_read_contacts on cp.contacts;
create policy control_read_contacts on cp.contacts for select to authenticated using (true);

drop policy if exists control_write_contacts on cp.contacts;
create policy control_write_contacts on cp.contacts for insert to authenticated with check (true);

drop policy if exists control_update_contacts on cp.contacts;
create policy control_update_contacts on cp.contacts for update to authenticated using (true) with check (true);

