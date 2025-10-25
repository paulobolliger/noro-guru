-- Enable Supabase Realtime for cp tables
alter publication supabase_realtime add table cp.system_events;
alter publication supabase_realtime add table cp.admin_logs;

