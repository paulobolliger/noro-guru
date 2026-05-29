# App Control

App: `apps/control`

Status: manter como eixo operacional, mas reconhecer dependencia transicional de Supabase.

## Papel

`apps/control` e o Control Plane/admin da NORO. Ele deve operar em `admin.noro.guru` e concentra a gestao global da plataforma: tenants, usuarios, APIs, operacao, billing, notificacoes, suporte, comunicacao, webhooks, dominios, configuracoes e governanca.

Ele nao e o portal operacional do tenant. Essa responsabilidade fica em `apps/core`, publicado em `app.noro.guru`.

Dominio alvo:

```txt
admin.noro.guru
```

Hosts legados podem existir apenas como alias temporario:

```txt
control.noro.guru
```

## Stack

- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind
- Supabase SSR/SDK ainda em uso funcional
- Stripe SDK ainda presente em fluxos legados
- Twilio/Resend/AWS SES em areas de comunicacao
- `@noro/lib`
- `@noro/types`
- `@noro/ui`

## Estado Atual

O README antigo tratava Supabase Auth/SQL Editor como fluxo principal. Isso nao deve orientar novas implementacoes.

Hoje o Control ainda usa Supabase em runtime:

- login;
- layout protegido;
- APIs;
- actions;
- queries de tenants, clientes, leads, pedidos, orcamentos, financeiro e suporte;
- webhooks Stripe/BTG.

Isso e transicional. O alvo e Logto + PostgreSQL/Drizzle.

## Residuos E Riscos

| Tema | Estado |
| --- | --- |
| Supabase Auth | Ainda usado em login/sessao e rotas protegidas. |
| Supabase Client | Ainda usado extensivamente em queries. |
| Stripe/Cielo/BTG | Providers legados ainda aparecem no app. |
| Asaas | Deve ser implementado conforme plano novo. |
| README antigo | Substituido por ponteiro para esta documentacao. |

## Diretriz

Novas implementacoes devem seguir:

- `docs/architecture/data-auth-transition.md`
- `docs/architecture/supabase-residue-report.md`
- `docs/architecture/billing-asaas-migration-plan.md`
- `scripts/README.md`

Nao criar novos fluxos em Supabase Auth. Nao criar novas migrations Supabase. Para dados novos, preferir PostgreSQL/Drizzle via `packages/db`.

## Comandos

Na raiz do monorepo:

```bash
npm run dev:control
```

No app:

```bash
cd apps/control
npm run dev
npm run build
npm run start
```

## Proximos Passos

1. Migrar auth do Control para Logto.
2. Migrar tenants/memberships para PostgreSQL/Drizzle.
3. Migrar queries Supabase por dominio.
4. Migrar billing/pagamentos para Asaas.
5. Remover dependencias Supabase quando o runtime nao depender mais delas.
