# control-worker

Control Plane background worker powered by Graphile Worker. Handles support ticket automations, email notifications, and SLA checks.

## Local development

```bash
# from repo root
npm install
npm run --workspace control-worker dev
```

Environment variables (via `.env.local` or Railway service variables):

- `DATABASE_URL` – Supabase Postgres connection string with service role permissions.
- `WORKER_CONCURRENCY` – Optional, defaults to 5.
- `WORKER_SCHEMA` – Optional, defaults to `graphile_worker`.
- `RESEND_API_KEY` or `AWS_SES_*` – Configure email provider when implementing notify-email task.

## Railway deployment

1. Create a new service from this package (Node 18 runtime).
2. Set build command to `npm run --workspace control-worker build`.
3. Set start command to `npm run --workspace control-worker start`.
4. Configure env vars:
   - `DATABASE_URL` (Supabase service role string)
   - `WORKER_CONCURRENCY` (e.g. 5)
   - Email provider secrets.
5. Enable redeploy on git pushes; keep at least one instance running for continuous job processing.

## Tasks overview

- `support_notify_email`: send transactional emails when tickets update.
- `support_sla_check`: evaluate SLA timers and enqueue follow-up work.
- `support_ticket_auto_close`: close stale tickets and notify stakeholders.

Each task currently logs a placeholder; implement logic once APIs and db procedures are ready.