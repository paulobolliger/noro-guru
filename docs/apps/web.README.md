# App Web

App: `apps/web`

Status: manter como site publico/marketing, com residuos tecnicos a migrar.

## Papel

`apps/web` e o site publico da NORO. Ele concentra paginas institucionais, marketing, produto, pricing, blog, status, leads, geracao/preview de sites e entradas publicas do ecossistema.

Dominio alvo:

```txt
noro.guru
```

## Stack

- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind
- `@noro/renderer`
- `@noro/types`
- OpenAI SDK
- Supabase SDK ainda presente para rotas de sites gerados

## Estado Atual

O README antigo era generico de AI Studio e nao representava o app real.

Rotas relevantes encontradas:

- `/`
- `/features/*`
- `/ecosystem/*`
- `/pricing`
- `/blog`
- `/lead`
- `/demo`
- `/wizard`
- `/dashboard/sites/[id]/preview`
- `/api/sites/generate`
- `/api/lead`
- `/api/newsletter`
- `/api/ingest-lead`
- `/api/create-checkout-session`

## Residuos E Riscos

| Tema | Estado |
| --- | --- |
| Supabase | Ainda aparece em `package.json` e em rotas de sites gerados. |
| Billing | Existe rota de checkout legado; alinhar com plano Asaas. |
| Sites gerados | Depende de `@noro/renderer` e ainda precisa alinhar com `apps/sites`. |
| README antigo | Substituido por ponteiro para esta documentacao. |

## Diretriz

Novas alteracoes devem seguir:

- `docs/architecture/current-state.md`
- `docs/architecture/domains-cloudflare-dns-current-plan.md`
- `docs/architecture/billing-asaas-migration-plan.md`
- `docs/architecture/data-auth-transition.md`

Nao criar novo uso de Supabase em `apps/web`. Para dados novos, preferir PostgreSQL/Drizzle ou API interna conforme a arquitetura oficial.

## Comandos

```bash
cd apps/web
npm run dev
npm run build
npm run start
```

## Proximos Passos

1. Migrar `app/api/sites/generate/route.ts` para PostgreSQL/Drizzle ou API interna.
2. Migrar `app/dashboard/sites/[id]/preview/page.tsx` para a nova camada de dados.
3. Revisar `/api/create-checkout-session` no contexto do plano Asaas.
4. Remover `@supabase/supabase-js` quando nao houver mais uso funcional.
