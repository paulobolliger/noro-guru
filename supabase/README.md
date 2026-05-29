# Supabase Legacy Artifacts

Status: frozen legacy reference.

The restored NORO PostgreSQL database is the current source of truth. The target architecture is PostgreSQL on VPS, Drizzle and Logto. This `supabase/` directory is retained only as historical reference while the remaining runtime dependencies are migrated.

Do not run these files against the restored PostgreSQL database unless a manual recovery or migration plan explicitly approves it:

- `supabase/migrations/*`
- `supabase/functions/*`
- `supabase/config.toml`
- `supabase db push`
- `supabase db pull`
- `supabase migration repair`

## Why This Folder Still Exists

Supabase has not been fully removed from runtime yet. Some apps still use Supabase clients, Auth, queries and Storage. Removing this folder or dependencies blindly can break login, protected routes, dashboards, generated sites, uploads and API routes.

For the current inventory, see:

- `docs/architecture/supabase-residue-report.md`
- `docs/architecture/current-state.md`
- `supabase/FROZEN.md`

## Current Rule

Use this folder only for analysis, comparison and historical recovery planning.

New database work should be designed against the official PostgreSQL/Drizzle direction, not by adding new Supabase migrations.

## Removal Path

Supabase should be removed in planned steps:

1. Finish the Logto auth migration.
2. Replace Supabase data access with Drizzle/PostgreSQL.
3. Replace Supabase Storage usage.
4. Remove `@supabase/*` dependencies.
5. Archive or delete this folder after runtime no longer depends on it.
