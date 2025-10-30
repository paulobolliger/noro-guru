-- RLS refinada para cp CRM (leads, tasks, notes)

-- Leads: dono do lead (owner_id) pode tudo; membros do tenant (se tenant_id set) podem ler
alter table cp.leads enable row level security;
drop policy if exists p_cp_leads_all on cp.leads;
create policy p_cp_leads_owner on cp.leads for all using (
  owner_id = auth.uid()
) with check (owner_id = auth.uid());
create policy p_cp_leads_tenant_read on cp.leads for select using (
  tenant_id is not null and exists (
    select 1 from cp.user_tenant_roles utr where utr.user_id = auth.uid() and utr.tenant_id = leads.tenant_id
  )
);

-- Tasks: assigned_to pode tudo; membros do tenant podem ler
alter table cp.tasks enable row level security;
drop policy if exists p_cp_tasks_all on cp.tasks;
create policy p_cp_tasks_assignee on cp.tasks for all using (
  assigned_to = auth.uid()
) with check (assigned_to = auth.uid());
create policy p_cp_tasks_tenant_read on cp.tasks for select using (
  tenant_id is not null and exists (
    select 1 from cp.user_tenant_roles utr where utr.user_id = auth.uid() and utr.tenant_id = tasks.tenant_id
  )
);

-- Notes: autor pode escrever; membros do tenant podem ler
alter table cp.notes enable row level security;
drop policy if exists p_cp_notes_all on cp.notes;
create policy p_cp_notes_author on cp.notes for insert with check (created_by = auth.uid());
create policy p_cp_notes_tenant_read on cp.notes for select using (
  tenant_id is not null and exists (
    select 1 from cp.user_tenant_roles utr where utr.user_id = auth.uid() and utr.tenant_id = notes.tenant_id
  ) or created_by = auth.uid()
);
