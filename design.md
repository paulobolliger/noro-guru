# System Design: NORO GURU

## Overview
NORO GURU is a robust multi-tenant SaaS ecosystem built as a **Turborepo monorepo** consisting of multiple Next.js/React applications and shared packages.

The system implements a modern **Control Plane + Tenant Apps** architecture with data isolation handled via Row Level Security (RLS) in Supabase.

## Architecture Patterns

### Control Plane & Tenant Architecture
- **Control Plane (`control`)**: A central management dashboard used by the platform administrators to manage tenants, billing, and API keys. It has visibility into all tenant activities and metrics.
- **Tenant Apps (`core`)**: The primary multi-tenant application used by travel agencies. Each tenant accesses the platform via their own subdomain, ensuring logical isolation.
- **Data Isolation (RLS)**: Row Level Security is enforced at the database level in Supabase. Every row in business-related tables belongs to a `tenant_id`, and policies ensure users can only access data belonging to their respective tenant.
- **Deployment & Domains**:
  - `apps/control` deploys to `control.noro.guru`
  - `apps/core` deploys to `core.noro.guru` (and individual subdomains)
  - `apps/web` deploys to `noro.guru`

## Monorepo Structure

The project uses Turborepo for build orchestration and workspace management.

```
noro-guru/
├── apps/
│   ├── control/        # Control Plane - Platform Management (Next.js)
│   ├── core/           # Tenant Application - Multi-tenant SaaS (Next.js)
│   ├── web/            # Public-facing Landing Page & Marketing (Next.js)
│   ├── financeiro/     # Financial Module (Next.js)
│   ├── billing/        # Billing System (Next.js)
│   └── visa-api/       # Visa Data API (Vite + React)
│
├── packages/
│   ├── ui/             # Shared UI components (Shadcn/Radix)
│   ├── lib/            # Shared utilities and helpers
│   ├── types/          # Shared TypeScript definitions
│   └── control-worker/ # Asynchronous workers for Control Plane
│
├── supabase/
│   ├── migrations/     # SQL Migrations for database schema
│   └── functions/      # Supabase Edge Functions
│
└── deploy/             # Deployment configurations
```

## Database Schemas (Supabase PostgreSQL)

The database is divided into logical schemas to separate platform administration from tenant business data.

### Schema `cp` (Control Plane)
Handles cross-tenant administration, billing, and platform-level configurations.
- `tenants` - Registered companies/organizations
- `user_tenant_roles` - RBAC permissions per tenant
- `api_keys` - Authentication keys for API access
- `domains` - Mapping domains to tenants
- `webhooks`, `webhook_logs` - Webhook management
- `billing.subscriptions`, `billing.invoices` - Subscription and billing data
- `ledger_accounts`, `ledger_entries` - Financial ledger
- `support_tickets`, `support_messages` - Support system

### Schema `public` (Business Data)
Contains tenant-specific data. **All tables include a `tenant_id` column** to enforce RLS.
- `noro_users`, `noro_clientes`, `noro_leads` - CRM and User data
- `noro_orcamentos`, `noro_pedidos` - Quotes and Orders
- `noro_tarefas`, `noro_interacoes`, `noro_notificacoes` - Tasks and Notifications
- `fin_*` - Financial module tables (revenues, expenses, bank accounts, etc.)
- `social_network_configs` - Social media integration configs

## Component Interactions

- **Billing Flow**: Stripe webhooks hit the Billing app (`apps/billing`), which communicates with the Control Plane (`apps/control`) to update the ledger in the database (`cp.ledger_entries`). The Financial module then displays this data.
- **Tenant Routing**: When a request comes to the core application, the system uses the `cp.domains` table to resolve the requested domain to a specific `tenant_id`, setting the context for subsequent database queries.
- **Shared Packages**: All apps leverage `@noro/ui`, `@noro/lib`, and `@noro/types` via workspace symlinks to maintain consistency and reduce duplication across the frontend.
