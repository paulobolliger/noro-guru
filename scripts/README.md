# Scripts Safety Policy

Scripts that can alter schemas, seed data, migrate data, or bootstrap legacy providers are frozen
by default.

Allowed runtime path:

- PostgreSQL central through `DATABASE_URL`
- Drizzle bootstrap in `packages/db`
- Logto bootstrap in `packages/auth`

Legacy Appwrite and ad-hoc Supabase scripts require explicit guard environment variables and
should not be used during normal development or deployment.
