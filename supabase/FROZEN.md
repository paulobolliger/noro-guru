# Supabase Legacy Artifacts Frozen

The restored NORO database is now the source of truth.

Do not run files under `supabase/migrations`, `supabase/functions`, or `supabase/config.toml`
against the restored PostgreSQL database unless a manual recovery plan explicitly approves it.

These files are retained only as historical reference during the PostgreSQL/Drizzle and Logto
transition.
