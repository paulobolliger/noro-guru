# Auditoria Tecnica De Codigo Legado E Arquivos Sem Uso Claro

Data: 2026-05-27

Escopo: varredura de `apps/`, `packages/`, `scripts/` e arquivos tecnicos de raiz para identificar residuos, codigo legado, arquivos gerados versionados e areas que exigem migracao antes de remocao.

Fora do escopo: `node_modules/`, `.next/`, `dist/`, `build/`, `docs/archive/` como fonte de arquitetura ativa.

## Resumo Executivo

Nao recomendo apagar codigo de negocio em lote neste momento. Ainda existe muito codigo transicional que compila e pode estar servindo como ponte enquanto PostgreSQL/Drizzle/Logto/Asaas nao substituem completamente Supabase, Stripe, Cielo, BTG e e.Rede.

O que pode ser tratado primeiro com baixo risco:

1. [x] remover arquivos `*.tsbuildinfo` do versionamento;
2. [x] adicionar regra `*.tsbuildinfo` no `.gitignore`;
3. [x] congelar novas referencias a Supabase fora dos arquivos ja mapeados;
4. [x] congelar novas referencias a Stripe/Cielo/BTG/e.Rede ate a abstracao Asaas estar pronta;
5. [x] revisar duplicacao de tasks em `packages/control-worker`.

## Achados De Baixo Risco

### Arquivos Gerados Versionados

Estes arquivos sao gerados pelo TypeScript e nao devem estar versionados:

```txt
apps/core/tsconfig.tsbuildinfo
apps/financeiro/tsconfig.tsbuildinfo
apps/web/tsconfig.tsbuildinfo
packages/control-worker/tsconfig.tsbuildinfo
```

Acao recomendada:

- remover do Git;
- adicionar `*.tsbuildinfo` no `.gitignore`;
- rodar build novamente para confirmar que sao recriados localmente.

Status: pode virar sprint tecnica curta.

Atualizacao 2026-05-27:

- arquivos `*.tsbuildinfo` removidos do workspace;
- regra `*.tsbuildinfo` adicionada ao `.gitignore`;
- os arquivos ainda aparecem em `git ls-files` como deletados ate o proximo commit, o que e esperado.

### CSVs Supabase

Os snapshots Supabase ja foram movidos para:

```txt
docs/archive/supabase-schema-snapshots/
```

Status: concluido. Nao ha acao adicional agora.

### Python

Nao foram encontrados scripts Python ativos fora de arquivo morto. Os `.py` conhecidos ficam em `docs/archive/migracao-bd/`.

Status: manter arquivado. Nao usar como referencia operacional sem revisao.

## Achados Que Nao Devem Ser Apagados Ainda

### Supabase Transicional

Ainda ha uso funcional de Supabase em:

```txt
packages/lib/supabase/*
apps/control/lib/supabase*
apps/control/hooks/*
apps/control/app/*
apps/sites/lib/get-site.ts
apps/web/app/api/sites/generate/route.ts
apps/web/app/dashboard/sites/[id]/preview/page.tsx
supabase/functions/*
```

Tambem existem dependencias em `package.json` de apps:

```txt
apps/control/package.json
apps/sites/package.json
apps/web/package.json
```

Leitura correta: Supabase nao e arquitetura futura, mas ainda e runtime transicional. Apagar agora quebraria auth, consultas, sites gerados, webhooks e telas do control plane.

Acao recomendada:

1. manter `supabase/FROZEN.md` e `supabase/README.md` como aviso de congelamento;
2. criar sprint de inventario por modulo antes de cada remocao;
3. migrar primeiro auth para Logto;
4. migrar depois queries para PostgreSQL/Drizzle;
5. remover `@supabase/*` somente quando a ultima chamada runtime sumir.

### Billing Legado: Stripe, Cielo, BTG E e.Rede

Ainda ha implementacao ou referencias em:

```txt
apps/billing/lib/stripe.ts
apps/billing/lib/cielo.ts
apps/billing/lib/checkout.ts
apps/billing/app/api/webhooks/stripe/route.ts
apps/billing/app/api/webhooks/cielo/route.ts
apps/control/app/api/webhooks/stripe/route.ts
apps/control/app/api/webhooks/btg/route.ts
apps/control/app/(protected)/pedidos/providers/stripe-provider.ts
apps/control/app/(protected)/pedidos/providers/cielo-provider.ts
apps/control/app/(protected)/pedidos/providers/btg-provider.ts
apps/core/app/(protected)/pedidos/providers/erede-provider.ts
apps/core/app/api/webhooks/erede-3ds/route.ts
apps/core/app/api/webhooks/erede-pix/route.ts
apps/web/app/api/create-checkout-session/route.ts
packages/lib/services/billingService.ts
packages/types/financeiro.ts
```

Leitura correta: esses providers conflitam com a direcao Asaas, mas ainda documentam fluxos reais/anteriores e podem alimentar a migracao para `PaymentProviderInterface`.

Acao recomendada:

1. nao apagar antes de criar a interface oficial de provider;
2. mover regras aproveitaveis para testes ou arquivo historico tecnico;
3. implementar `AsaasPaymentProvider`;
4. trocar UI para Asaas como provider unico de MVP;
5. remover Stripe/Cielo/BTG/e.Rede quando builds de `core`, `control`, `billing` e `web` passarem sem imports.

### `apps/billing`

O app ainda existe, mas a decisao atual diz que billing sera feature dentro de `apps/control` e `apps/core`.

Leitura correta: nao apagar ate extrair o que ainda serve como fluxo de assinatura, portal, planos e webhooks.

Acao recomendada:

- manter como legado operacional ate a sprint Asaas;
- depois mover o que for util para `control`/`core`;
- arquivar ou remover o app quando nao houver rota produtiva dependente dele.

### `apps/financeiro`

O app ainda possui muitas telas, APIs e componentes. A decisao atual diz que financeiro sera modulo em `apps/control` e `apps/core`, nao produto separado.

Leitura correta: e base de reaproveitamento, nao lixo imediato.

Acao recomendada:

- mapear quais telas pertencem ao financeiro NORO/control;
- mapear quais telas pertencem ao financeiro do tenant/core;
- migrar rotas e componentes por dominio;
- so depois remover o app isolado.

## Achados Que Merecem Revisao

### Endpoints 410 Em `apps/financeiro`

Existem rotas propositalmente desativadas com status `410`, principalmente em:

```txt
apps/financeiro/app/api/*
apps/financeiro/pages/api/cambial/index.ts
apps/financeiro/pages/api/comissoes/index.ts
apps/financeiro/pages/api/duplicatas/index.ts
```

Leitura correta: isso e uma trava de compatibilidade. Nao e necessariamente erro, mas indica que o app financeiro carrega um modelo de dados antigo.

Acao recomendada:

- manter enquanto telas antigas ainda possam chamar essas rotas;
- remover apos confirmar que nenhuma tela/cliente usa os endpoints;
- preferir remover diretorios inteiros por dominio, nao arquivo por arquivo.

### Control Worker Com Dois Registries

O worker usa:

```txt
packages/control-worker/src/tasks/registry.ts
```

Mas tambem existe:

```txt
packages/control-worker/src/jobs/registry.ts
packages/control-worker/src/jobs/tasks/*
```

Pelo `src/index.ts`, o registry ativo e `src/tasks/registry.ts`. O grupo `src/jobs/*` parece uma camada alternativa ou antiga.

Acao recomendada:

- [x] confirmar se `src/jobs/registry.ts` e importado por algum script externo;
- [x] se nao houver import, mover `src/jobs/*` para archive tecnico ou remover;
- [x] manter apenas um padrao de task no worker.

Atualizacao 2026-05-27:

- busca por referencias encontrou uso apenas dentro do proprio `src/jobs/*`;
- `src/index.ts` usa `src/tasks/registry.ts`;
- `src/jobs/*` foi removido;
- `npm run build --workspace=control-worker` passou.

### Duplicacao De UI

Ha componentes UI locais em:

```txt
apps/control/components/ui/*
apps/core/components/ui/*
apps/financeiro/components/ui/*
apps/web/components/ui/*
packages/ui/*
```

Leitura correta: isso nao e lixo imediato, mas aumenta custo de manutencao visual.

Acao recomendada:

- nao centralizar agora se isso atrasar produto;
- quando houver design system mais firme, mover componentes comuns para `packages/ui`;
- manter componentes especificos dentro de cada app.

### Mocks, TODOs E Placeholders

Existem mocks e TODOs funcionais em areas como:

```txt
apps/control/app/(protected)/comunicacao/actions.ts
apps/control/app/(protected)/comunicacao/page.tsx
apps/control/app/(protected)/comunicacao/chatbot/ChatbotConfigClient.tsx
apps/web/components/support/ContactForm.tsx
apps/web/app/demo/page.tsx
apps/web/app/status/page.tsx
apps/web/app/api/sites/generate/route.ts
packages/control-worker/src/jobs/tasks/*
```

Leitura correta: sao lacunas de produto ou integrações futuras, nao necessariamente arquivos mortos.

Acao recomendada:

- transformar TODOs relevantes em backlog;
- remover mocks apenas quando houver backend real substituto;
- nao misturar limpeza tecnica com implementacao de produto.

## Ordem Recomendada De Execucao

### Sprint Tecnica 1: Higiene De Artefatos

1. [x] Remover `*.tsbuildinfo` do Git.
2. [x] Adicionar `*.tsbuildinfo` no `.gitignore`.
3. [x] Rodar build afetado do `control-worker`.

### Sprint Tecnica 2: Guardrails De Legado

1. [x] Manter `guard:no-appwrite`.
2. [x] Criar guard ou relatorio para novas referencias Supabase fora de allowlist.
3. [x] Criar guard ou relatorio para novas referencias Stripe/Cielo/BTG/e.Rede enquanto Asaas vira padrao.

Atualizacao 2026-05-27:

- [x] criado `scripts/guard-legacy-references.mjs`;
- [x] criado script `npm run guard:legacy-refs`;
- [x] CI atualizado para executar o guard apos `guard:no-appwrite`.

### Sprint Tecnica 3: Supabase Para Logto/PostgreSQL

1. Migrar auth de Supabase para Logto.
2. Migrar queries por modulo para PostgreSQL/Drizzle.
3. Remover Supabase dos apps conforme cada modulo ficar verde.

### Sprint Tecnica 4: Billing Para Asaas

1. Criar `PaymentProviderInterface`.
2. Implementar `AsaasPaymentProvider`.
3. Migrar cobrancas NORO/control.
4. Migrar cobrancas tenant/core.
5. Arquivar/remover Stripe/Cielo/BTG/e.Rede.

### Sprint Tecnica 5: Reposicionar Apps `billing` E `financeiro`

1. Extrair fluxos uteis de `apps/billing` para `control` e `core`.
2. Extrair modulos uteis de `apps/financeiro` para `control` e `core`.
3. Desativar apps isolados quando nao forem mais deployables oficiais.

### Sprint Tecnica 6: Worker E UI

1. [x] Escolher um unico registry em `packages/control-worker`.
2. [x] Remover ou arquivar `src/jobs/*` se confirmado como inativo.
3. Consolidar UI compartilhada em `packages/ui` quando o design system estiver mais maduro.

## Conclusao

Existe codigo legado, mas pouco pode ser apagado com seguranca imediata. O risco maior nao e quantidade de arquivos; e remover providers, Supabase ou apps auxiliares antes de terminar as migracoes estruturais.

Primeiro passo recomendado: limpar `*.tsbuildinfo` versionado e criar guards de reintroducao. Depois seguir a ordem Supabase/Logto/PostgreSQL, Asaas, e so entao aposentar apps/features antigos.
