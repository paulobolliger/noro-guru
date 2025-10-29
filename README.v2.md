# Noro Guru — README v2 (Draft)

Este README descreve a arquitetura alvo, execução local e práticas operacionais do monorepo Noro Guru. É um rascunho que será iterado conforme avançamos nas fases do ROADMAP.

## Estrutura do Monorepo
- Apps
  - `apps/web` — Marketing site (noro.guru), App Router.
  - `apps/control` — Control plane (control.noro.guru): tenants, billing, domínios, API keys.
  - `apps/core` — CRM/ERP multi-tenant (core.noro.guru), App Router.
  - `apps/visa-api` — API de vistos (visa-api.noro.guru).
- Packages
  - `packages/ui` — Design System.
  - `packages/lib` — Supabase clients (browser/server/admin) e utilitários.
  - `packages/types` — Tipos do Supabase e domínios.

## Padrões de Arquitetura
- Next.js App Router nos frontends.
- Supabase central (Auth + DB). Multi-tenant por `tenant_id` e RLS.
- Resolução por domínio (`cp.domains`) definindo o tenant ativo.
- Stripe como billing inicial (Cielo depois via provider).

## Desenvolvimento
Requisitos: Node 18+, PNPM/NPM, Supabase CLI.

Instalação:
- npm i
- supabase link (se aplicável)
- supabase db pull (opcional) para atualizar migrations locais

Executar:
- npm run dev — roda o pipeline de dev do monorepo via Turborepo
- npm run dev:control — foca no app Control

Variáveis de Ambiente (gerais):
- SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
- STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET (para Control)

## Banco de Dados
- Schema `cp`: tenants, user_tenant_roles, domains, api_keys, plans, webhooks, etc.
- Schema `public`: tabelas de negócio `noro_*` (clientes, leads, orçamentos, pedidos, etc.).
- Catálogos globais (ex.: visa) sem `tenant_id`; overrides por tenant com `tenant_id`.
- RLS: políticas restringem acesso por `tenant_id` e role.

### Visa API (catálogo + overrides)
- `visa_countries`: catálogo global de países (iso2/iso3).
- `visa_sources`: fontes de dados e proveniência.
- `visa_requirements`: requisitos normalizados por `country_from`,`country_to`,`purpose`,`duration` com JSON `requirement`.
- `visa_overrides`: ajustes por tenant sobre o `requirement` (mesma chave lógica) com RLS por tenant.
- View de compat: `v_visa_info_basic` para consumo leg legados.

ETL inicial (exemplo BR):
- Importar CSV de `vistos.guru.public.visa_info` para `staging_vistos.visa_info` no projeto central.
- Inserir países e requisitos (vide scripts ETL fornecidos nas instruções do chat).

Índices úteis:
- `ux_visa_requirements_key(country_from,country_to,purpose,duration)`
- `idx_vr_from_to`, `idx_vr_updated_at`

Migrações:
- SQL versionado em `supabase/migrations` via Supabase CLI.
- Fluxo: ajustar SQL → supabase db push (dev) → validar → promover.

## Versionamento Automático (Changesets)
Scripts (raiz):
- npm run changeset — cria changeset
- npm run version — aplica bump de versões
- npm run release — publica (quando aplicável) e gera changelog

Uso básico:
1) npm run changeset
2) npm run version
3) Commit e push das mudanças de versão/changelog

## Observabilidade (mínimo viável)
- Logs estruturados (console) com contexto de request/tenant.
- Planejado: OpenTelemetry básico quando estabilizar.

## Segurança e Acesso
- RLS habilitado por padrão nas tabelas sensíveis.
- Evitar GRANTs amplos; confiar em policies.
- Chaves de API atreladas a `cp.api_keys` e `tenant_id` (visa-api).

### Visa API — Edge Function e Autenticação
- Edge function: `visa-requirements`
- Endpoint: `GET /?from=BR&to=CA[&purpose=&duration=]`
- Headers: `x-api-key: <key>` (provisionada em `cp.api_keys`)
- Respostas:
  - 200: `{ country_from, country_to, purpose, duration, requirement, updated_at, last_checked_at, source: { base, override } }`
  - 404: `{ error: "Not found" }`
  - Health: `GET /?ping=1` retorna `{ ok: true }`

 Gerando API keys (SQL Editor — projeto central):
```
-- Exemplo: salva hash SHA-256 e last4.
-- Substitua PLAINTEXT_KEY por sua chave real (guarde com segurança).
insert into cp.api_keys (id, tenant_id, name, hash, last4, scope, expires_at)
select gen_random_uuid(), t.id, 'Visa Read', encode(digest('PLAINTEXT_KEY','sha256'),'hex'), right('PLAINTEXT_KEY',4), array['visa:read'], null
from cp.tenants t
where t.slug = 'noro';
```
Use a chave em texto claro no header `x-api-key` ao chamar a função. A função calcula SHA-256 e compara com `cp.api_keys.hash`.

## Roadmap
Consulte `ROADMAP.md` para fases, entregáveis e decisões.

—

Este README v2 será atualizado conforme definirmos o middleware de domínio/tenant e consolidarmos as migrações do banco.
