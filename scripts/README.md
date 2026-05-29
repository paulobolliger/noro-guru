# Scripts Safety Policy

Scripts that can alter schemas, seed data, migrate data, or bootstrap legacy providers are frozen
by default.

Allowed runtime path:

- PostgreSQL central through `DATABASE_URL`
- Drizzle bootstrap in `packages/db`
- Logto bootstrap in `packages/auth`

Legacy provider scripts removed from the active scripts tree must stay archived. Ad-hoc
Supabase scripts remain frozen and require explicit guard environment variables when kept for
audited recovery.

## Official Policy

This file is the official policy for repository scripts and automations.

## Guards

Run before builds or CI:

```bash
npm run guard:no-appwrite
```

This guard fails if Appwrite appears again in active `apps/`, `packages/`, `scripts/`, or
dependency manifests. Historical references are allowed only under `docs/archive/`.

It applies to scripts that can affect:

- database schema;
- seed data;
- data migrations;
- auth/bootstrap flows;
- billing/payment providers;
- legacy Supabase artifacts;
- external infrastructure.

## Documentation Maintenance

When a script changes architecture, data shape, auth behavior, billing behavior, or provider
boundaries, update the relevant architecture document in the same change.

Primary references:

- `docs/architecture/current-state.md`
- `docs/architecture/data-auth-transition.md`
- `docs/architecture/supabase-residue-report.md`
- `docs/architecture/billing-asaas-migration-plan.md`

Automated audits may detect drift, but architecture decisions must be reviewed before the
documentation becomes official.
