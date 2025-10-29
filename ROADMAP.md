Noro Guru — Roadmap de Arquitetura e Migração
================================================

Este roadmap guia a consolidação do monorepo (web, control, core, visa-api), a padronização em Next.js App Router, a centralização no Supabase (auth + dados), e a adoção de multi-tenant com RLS. Mantém entregas incrementais e seguras.

Fase 1 — Descoberta e Mapeamento (feito em andamento)
- Inventário dos apps e libs: `apps/web`, `apps/control`, `apps/core`, `apps/visa-api`, `packages/*`.
- Supabase conectado via CLI. Dump inicial do schema coletado em `supabase/migrations/*`.
- Identificado schema `cp` (control plane) e tabelas `public/noro_*` (negócio).

Entregáveis:
- Relatório de tabelas e policies com lacunas de `tenant_id` e RLS.
- Dívidas arquiteturais priorizadas (App Router, duplicações, grants amplos, policies só para super admin, etc.).

Fase 2 — Decisões Base e Monorepo
- App Router em web/control/core; visa-api como serviço de API (pode ser Next API routes inicialmente).
- Monorepo com Turborepo + workspaces (`apps/*`, `packages/*`).
- Pacotes compartilhados: `@noro/auth`, `@noro/db`, `@noro/ui`, `@noro/config` (esqueleto inicial).
- Observabilidade: logging/tracing mínimo compatível.
- Versionamento: Changesets configurado (ver seção “Versionamento Automático”).

Fase 3 — Multi-tenant e RLS no Supabase
- Tenants e domínios
  - `cp.tenants` (id/slug/nome/plano/status) e `cp.user_tenant_roles` (vínculo usuário↔tenant com roles).
  - `cp.domains` mapeando `domain` → `tenant_id` (resolução por domínio/subdomínio).
- Dados de negócio
  - Padronizar `tenant_id` em `noro_clientes`, `noro_leads`, `noro_orcamentos`, `noro_orcamentos_itens`, `noro_pedidos`, `noro_pedidos_itens`, `noro_pedidos_timeline`.
  - Catálogos globais (ex.: visa) sem `tenant_id`; anotações/overrides com `tenant_id`.
- RLS
  - Habilitar RLS e policies “usuário é membro do tenant e registro.tenant_id = tenant ativo”.
  - Reduzir GRANTs amplos; confiar nas policies.

Entregáveis:
- Migrações SQL incrementais (adicionar `tenant_id`, criar índices, habilitar RLS, criar policies).
- Testes básicos de acesso por role (owner/admin/member/viewer).

Fase 4 — Control Plane Sólido
- Login unificado (Supabase Auth) e seleção de tenant ativo.
- CRUDs essenciais: tenants, domínios, usuários/roles, planos (Stripe), chaves de API.
- Webhooks Stripe e métrica mínima de uso.

Entregáveis:
- `control` navegável e funcional, com dados escopados por tenant.

Fase 5 — Web e Leads
- `web` servindo marketing (App Router) com envio de leads → `noro_leads` (tenant “noro”).
- Resolução por domínio para identificar o tenant padrão quando necessário.

Entregáveis:
- Form de leads validado ponta a ponta.

Fase 6 — Core (CRM/ERP)
- Shell protegido com sessão/tenant aplicados.
- Migração do schema do `nomade.guru` (incremental, com views de compatibilidade quando preciso).

Entregáveis:
- Módulos essenciais (clientes, orçamentos, pedidos) operando com `tenant_id`.

Fase 7 — visa-api
- API v1 com API keys por tenant (tabela `cp.api_keys`).
- Rate limit por tenant, logs mínimos.
- Consumo em `vistos.guru` lendo catálogo global; customizações por tenant quando aplicável.

Entregáveis:
- Especificação OpenAPI mínima e endpoints estáveis de leitura.

Decisões Confirmadas
- Um único projeto Supabase (auth + dados). Split futuro só se necessário.
- Stripe primeiro; Cielo depois por trás de uma interface de provider.
- Tenant “noro” como principal; subdomínios para tenants no `core` no futuro (ex.: `{slug}.core.noro.guru`).

Próximos Passos Imediatos
1) Relatório de lacunas de `tenant_id` e RLS em `noro_*` e `cp.*` (priorizar Control e dados críticos).
2) Proposta de migrações SQL mínimas para: adicionar `tenant_id`, habilitar RLS, criar policies multi-tenant e ajustar GRANTs.
3) Especificação de `cp.domains` e middleware de resolução de domínio/tenant.
4) Ajustes no `control` para login, tenant ativo e leitura securitizada.

Versionamento Automático
- Ferramenta: Changesets (monorepo-ready).
- Fluxo:
  - `pnpm changeset` → cria um changeset (define semver por pacote).
  - `pnpm changeset version` → aplica bump de versões.
  - `pnpm changeset publish` → publica (quando aplicável) e gera changelog.
- Scripts adicionados no `package.json` de raiz. Instale deps e rode conforme o README v2.

—

Este roadmap será atualizado a cada fase concluída e ao definir migrações específicas do banco.
