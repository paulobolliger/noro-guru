-- Admin logs table
create table if not exists cp.admin_logs (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  message text,
  created_by text,
  created_at timestamptz default now()
);

