-- Support module schema: tickets, messages, events, SLA

create table if not exists cp.support_tickets (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references cp.tenants(id) on delete cascade,
  subject text not null,
  summary text,
  status text not null default 'open',
  priority text not null default 'normal',
  channel text,
  requester_id uuid references auth.users(id) on delete set null,
  requester_email text,
  assigned_to uuid references auth.users(id) on delete set null,
  tags text[] not null default '{}',
  first_response_at timestamptz,
  last_message_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists cp.support_messages (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references cp.tenants(id) on delete cascade,
  ticket_id uuid not null references cp.support_tickets(id) on delete cascade,
  sender_id uuid references auth.users(id) on delete set null,
  sender_role text,
  body text not null,
  attachments jsonb not null default '[]'::jsonb,
  internal boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists cp.support_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references cp.tenants(id) on delete cascade,
  ticket_id uuid not null references cp.support_tickets(id) on delete cascade,
  type text not null,
  actor_id uuid references auth.users(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists cp.support_sla (
  ticket_id uuid primary key references cp.support_tickets(id) on delete cascade,
  tenant_id uuid not null,
  policy text,
  target_at timestamptz,
  breached_at timestamptz,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_support_tickets_tenant_status on cp.support_tickets(tenant_id, status);
create index if not exists idx_support_tickets_assigned on cp.support_tickets(assigned_to);
create index if not exists idx_support_messages_ticket on cp.support_messages(ticket_id, created_at);
create index if not exists idx_support_events_ticket on cp.support_events(ticket_id, created_at);
create index if not exists idx_support_sla_target on cp.support_sla(target_at);

alter table cp.support_tickets enable row level security;
drop policy if exists p_support_tickets_select on cp.support_tickets;
drop policy if exists p_support_tickets_insert on cp.support_tickets;
drop policy if exists p_support_tickets_update on cp.support_tickets;
create policy p_support_tickets_select on cp.support_tickets for select using (
  (tenant_id is not null and exists (
    select 1 from cp.user_tenant_roles utr where utr.user_id = auth.uid() and utr.tenant_id = support_tickets.tenant_id
  ))
  or assigned_to = auth.uid()
  or requester_id = auth.uid()
);
create policy p_support_tickets_insert on cp.support_tickets for insert with check (
  tenant_id is not null and exists (
    select 1 from cp.user_tenant_roles utr where utr.user_id = auth.uid() and utr.tenant_id = support_tickets.tenant_id
  )
);
create policy p_support_tickets_update on cp.support_tickets for update using (
  assigned_to = auth.uid() or (
    tenant_id is not null and exists (
      select 1 from cp.user_tenant_roles utr where utr.user_id = auth.uid() and utr.tenant_id = support_tickets.tenant_id
    )
  )
) with check (
  tenant_id is not null and exists (
    select 1 from cp.user_tenant_roles utr where utr.user_id = auth.uid() and utr.tenant_id = support_tickets.tenant_id
  )
);

alter table cp.support_messages enable row level security;
drop policy if exists p_support_messages_select on cp.support_messages;
drop policy if exists p_support_messages_insert on cp.support_messages;
create policy p_support_messages_select on cp.support_messages for select using (
  exists (
    select 1 from cp.support_tickets t
    where t.id = support_messages.ticket_id
      and (
        t.assigned_to = auth.uid()
        or t.requester_id = auth.uid()
        or (t.tenant_id is not null and exists (
          select 1 from cp.user_tenant_roles utr where utr.user_id = auth.uid() and utr.tenant_id = t.tenant_id
        ))
      )
  )
);
create policy p_support_messages_insert on cp.support_messages for insert with check (
  exists (
    select 1 from cp.support_tickets t
    where t.id = support_messages.ticket_id
      and support_messages.tenant_id = t.tenant_id
      and (
        t.assigned_to = auth.uid()
        or t.requester_id = auth.uid()
        or (t.tenant_id is not null and exists (
          select 1 from cp.user_tenant_roles utr where utr.user_id = auth.uid() and utr.tenant_id = t.tenant_id
        ))
      )
  )
);

alter table cp.support_events enable row level security;
drop policy if exists p_support_events_select on cp.support_events;
drop policy if exists p_support_events_insert on cp.support_events;
create policy p_support_events_select on cp.support_events for select using (
  exists (
    select 1 from cp.support_tickets t
    where t.id = support_events.ticket_id
      and (
        t.assigned_to = auth.uid()
        or t.requester_id = auth.uid()
        or (t.tenant_id is not null and exists (
          select 1 from cp.user_tenant_roles utr where utr.user_id = auth.uid() and utr.tenant_id = t.tenant_id
        ))
      )
  )
);
create policy p_support_events_insert on cp.support_events for insert with check (
  exists (
    select 1 from cp.support_tickets t
    where t.id = support_events.ticket_id
      and support_events.tenant_id = t.tenant_id
      and (
        t.assigned_to = auth.uid()
        or t.requester_id = auth.uid()
        or (t.tenant_id is not null and exists (
          select 1 from cp.user_tenant_roles utr where utr.user_id = auth.uid() and utr.tenant_id = t.tenant_id
        ))
      )
  )
);

alter table cp.support_sla enable row level security;
drop policy if exists p_support_sla_select on cp.support_sla;
drop policy if exists p_support_sla_upsert on cp.support_sla;
create policy p_support_sla_select on cp.support_sla for select using (
  exists (
    select 1 from cp.support_tickets t
    where t.id = support_sla.ticket_id
      and (
        t.assigned_to = auth.uid()
        or t.requester_id = auth.uid()
        or (t.tenant_id is not null and exists (
          select 1 from cp.user_tenant_roles utr where utr.user_id = auth.uid() and utr.tenant_id = t.tenant_id
        ))
      )
  )
);
create policy p_support_sla_upsert on cp.support_sla for all using (
  exists (
    select 1 from cp.support_tickets t
    where t.id = support_sla.ticket_id
      and support_sla.tenant_id = t.tenant_id
      and (
        t.assigned_to = auth.uid()
        or (t.tenant_id is not null and exists (
          select 1 from cp.user_tenant_roles utr where utr.user_id = auth.uid() and utr.tenant_id = t.tenant_id
        ))
      )
  )
) with check (
  exists (
    select 1 from cp.support_tickets t
    where t.id = support_sla.ticket_id
      and support_sla.tenant_id = t.tenant_id
      and (
        t.assigned_to = auth.uid()
        or (t.tenant_id is not null and exists (
          select 1 from cp.user_tenant_roles utr where utr.user_id = auth.uid() and utr.tenant_id = t.tenant_id
        ))
      )
  )
);

create or replace view cp.v_support_ticket_status_counts as
select tenant_id, status, count(*)::int as total
from cp.support_tickets
group by tenant_id, status;
