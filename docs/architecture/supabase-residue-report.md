# Relatorio De Residuos Supabase

Data de referencia: 2026-05-27

## 1. Conclusao Executiva

Existe um problema arquitetural real: a direcao atual aponta para PostgreSQL em VPS, Drizzle e Logto, mas o repositorio ainda possui uso funcional de Supabase.

Supabase nao esta apenas em documentos antigos. Ele ainda aparece em:

- dependencias de runtime;
- clientes compartilhados;
- auth em telas e rotas;
- queries diretas em `apps/control`, `apps/web` e `apps/sites`;
- storage;
- migrations e edge functions congeladas;
- documentos que ainda descrevem Supabase como fluxo ativo.

Portanto, Supabase deve ser tratado como legado transicional ainda acoplado ao runtime. Remover os arquivos agora, sem migrar chamadas, pode quebrar login, consultas, paineis, APIs, sites gerados e rotas protegidas.

## 2. Estado Oficial Recomendado

| Camada | Estado desejado | Estado encontrado |
| --- | --- | --- |
| Banco | PostgreSQL na VPS via `DATABASE_URL` | Existe `packages/db`, mas varias rotas ainda usam Supabase client |
| ORM/acesso | Drizzle/Postgres | Muitas queries ainda usam `.from(...)` do Supabase |
| Auth | Logto | `packages/auth` aponta Logto, mas telas/rotas ainda usam `supabase.auth` |
| Storage | A definir fora de Supabase | Upload de logo ainda usa Supabase Storage |
| Migrations | Drizzle ou SQL controlado contra VPS | Pasta `supabase/migrations` ainda existe, mas esta congelada |
| Edge functions | Substituir por API routes/workers proprios | `supabase/functions` ainda existe como historico |

## 3. Por Que Existe Este Residuo?

A causa provavel e uma transicao em etapas:

1. O projeto nasceu ou evoluiu usando Supabase como backend principal.
2. Houve uma tentativa posterior de migracao para Appwrite.
3. Appwrite foi abandonado como alvo.
4. A direcao nova passou a ser PostgreSQL/Drizzle/Logto em infraestrutura propria.
5. A documentacao ja comecou a refletir isso, mas o codigo ainda nao foi migrado por completo.

O resultado e uma arquitetura hibrida temporaria:

```txt
PostgreSQL VPS / Drizzle / Logto
        ^
        | alvo oficial
        |
Supabase client/Auth/Storage/Migrations
        ^
        | legado ainda presente
```

## 4. Inventario Dos Residuos

### 4.1 Dependencias

Dependencias Supabase ainda aparecem nos packages:

| Arquivo | Residuo |
| --- | --- |
| `apps/control/package.json` | `@supabase/ssr`, `@supabase/supabase-js` |
| `apps/sites/package.json` | `@supabase/supabase-js` |
| `apps/web/package.json` | `@supabase/supabase-js` |
| `package-lock.json` | Pacotes transitivos Supabase: auth, functions, postgrest, realtime, storage |

Impacto:

- o build ainda aceita imports Supabase;
- novos codigos podem continuar usando o SDK sem perceber que e legado;
- o lockfile confirma que Supabase ainda e dependencia instalada.

### 4.2 Clientes Compartilhados

Arquivos centrais ainda exportam clientes Supabase:

| Arquivo | Papel atual |
| --- | --- |
| `packages/lib/supabase/client.ts` | Cliente browser compartilhado |
| `packages/lib/supabase/server.ts` | Cliente server/SSR compartilhado |
| `packages/lib/supabase/admin.ts` | Cliente admin/service role |
| `packages/lib/supabase/index.ts` | Export publico do pacote |
| `apps/control/lib/supabase/client.ts` | Cliente local do Control |
| `apps/control/lib/supabase/server.ts` | Cliente server local do Control |
| `apps/control/lib/supabase/admin.ts` | Cliente admin local do Control |
| `apps/control/lib/supabaseServer.ts` | Helper server usado por rotas/actions |

Impacto:

- Supabase continua sendo uma API de dados padrao dentro do app;
- muitos imports dependem desses helpers;
- remover `@supabase/*` antes de substituir esses pontos quebra compilacao.

### 4.3 Auth Supabase Ainda Ativo

O alvo novo existe:

| Arquivo | Observacao |
| --- | --- |
| `packages/auth/index.ts` | Define `AuthProvider = 'logto'` e le envs `LOGTO_*` |

Mas o runtime ainda usa Supabase Auth em varios pontos:

| Area | Exemplos encontrados |
| --- | --- |
| Login | `apps/control/app/login/page.tsx` usa `supabase.auth.signUp`, `signInWithPassword`, OAuth |
| Layout protegido | `apps/control/app/(protected)/layout.tsx` usa `supabase.auth.getUser()` |
| Dashboard | `apps/control/app/(protected)/page.tsx` usa `supabase.auth.getSession()` e `signOut()` |
| Hooks | `apps/control/hooks/useTenant.ts` usa `supabase.auth.getUser()` |
| APIs | rotas de support/search/tasks/tenants usam `supabase.auth.getUser()` |
| TopBar | `apps/control/components/TopBar.tsx` usa `supabase.auth.signOut()` |

Conclusao:

Logto ainda parece ser direcao/configuracao, nao substituicao completa. Hoje o Control ainda depende de Supabase Auth para sessoes e usuario em varias telas.

### 4.4 Queries De Dados Via Supabase

O maior acoplamento esta em `apps/control`.

Exemplos de dominios usando `.from(...)`/`.schema('cp')`:

| Dominio | Exemplos |
| --- | --- |
| Tenants | `tenants`, `user_tenant_roles`, `user_tenants`, `noro_empresa` |
| CRM | `noro_leads`, `leads`, `lead_activity`, `noro_clientes` |
| Pedidos | `pedidos`, `pedido_itens`, `noro_pedidos` |
| Orcamentos | `noro_orcamentos`, `noro_orcamentos_itens` |
| Financeiro | `cobrancas`, `invoices`, `ledger_accounts`, `ledger_entries` |
| Suporte | `support_tickets`, `support_messages` |
| Comunicacao | `conversations`, `noro_notificacoes`, `notifications` |
| Configuracao | `noro_configuracoes`, `api_keys`, `webhooks`, `domains` |

Arquivos com uso relevante incluem:

- `apps/control/hooks/useTenant.ts`
- `apps/control/hooks/useLeads.ts`
- `apps/control/hooks/useClients.ts`
- `apps/control/hooks/usePedidos.ts`
- `apps/control/hooks/useOrcamentos.ts`
- `apps/control/app/(protected)/layout.tsx`
- `apps/control/app/(protected)/page.tsx`
- `apps/control/app/(protected)/pedidos/pedidos-actions.ts`
- `apps/control/app/(protected)/tenants/tenant-actions.ts`
- `apps/control/app/(protected)/configuracoes/user-actions.ts`
- `apps/control/app/api/search/route.ts`
- `apps/control/app/api/support/**`
- `apps/control/app/api/webhooks/stripe/route.ts`
- `apps/control/app/api/webhooks/btg/route.ts`

Impacto:

- a migracao nao e somente trocar env vars;
- e preciso reescrever a camada de acesso a dados;
- schemas/tabelas precisam ser mapeados para Drizzle ou SQL tipado.

### 4.5 Apps Web E Sites

Supabase tambem aparece fora do Control:

| App | Arquivos |
| --- | --- |
| `apps/web` | `app/api/sites/generate/route.ts`, `app/dashboard/sites/[id]/preview/page.tsx` |
| `apps/sites` | `lib/get-site.ts` |

Impacto:

- runtime de sites gerados pode depender de Supabase para buscar `sites`;
- migrar apenas o Control nao elimina o Supabase do produto.

### 4.6 Storage Supabase

Uso de storage encontrado:

- `packages/lib/supabase/storage.ts`
- `apps/control/app/(protected)/tenants/tenant-actions.ts`

O caso visivel e upload/public URL de `tenant-logos`.

Risco:

- se Supabase Storage for removido sem substituto, logos e arquivos de tenant podem parar;
- antes de remover, definir destino: filesystem/S3/MinIO/R2/Cloudflare Images/VPS object storage.

### 4.7 Pasta `supabase/`

Conteudo encontrado:

| Pasta/arquivo | Quantidade/estado |
| --- | --- |
| `supabase/migrations` | 36 arquivos SQL |
| `supabase/functions` | 3 edge functions |
| `supabase/config.toml` | configuracao CLI Supabase |
| `supabase/FROZEN.md` | trava correta de congelamento |
| `supabase/README.md` | ainda conflitante, fala em fluxo ativo |

Edge functions preservadas:

- `supabase/functions/ingest-lead/index.ts`
- `supabase/functions/support-email/index.ts`
- `supabase/functions/visa-requirements/index.ts`

Risco:

- executar migrations antigas contra o PostgreSQL restaurado pode alterar schema indevidamente;
- `supabase/README.md` ainda instrui `supabase db push`, o que conflita com `FROZEN.md`.

## 5. Riscos Tecnicos

| Risco | Severidade | Motivo |
| --- | --- | --- |
| Supabase Auth e Logto coexistindo sem fronteira clara | Alta | Pode gerar sessoes duplicadas, usuario sem tenant e regra de autorizacao divergente |
| Remover dependencias Supabase cedo demais | Alta | Quebra build e rotas ativas |
| Rodar migrations Supabase antigas | Alta | Pode corromper ou divergir schema do PostgreSQL restaurado |
| Queries Supabase sem contrato Drizzle equivalente | Alta | Regressao em CRM, pedidos, financeiro, tenants e suporte |
| Storage sem substituto | Media/Alta | Perda de upload/logo/assets de tenant |
| Documentacao contraditoria | Media | Desenvolvedor novo pode implementar no stack errado |

## 6. Plano De Remocao Prudente

### Sprint 0: Trava E Inventario

Objetivo: impedir novas dependencias Supabase.

1. Atualizar `supabase/README.md` para abrir com aviso de congelamento.
2. Linkar este relatorio em `docs/architecture/current-state.md`.
3. Criar checklist de imports Supabase por app.
4. Definir regra: codigo novo nao deve importar `@supabase/*`.

Criterio de aceite:

- nenhum documento principal recomenda `supabase db push`;
- Supabase esta marcado como legado transicional.

### Sprint 1: Auth

Objetivo: remover Supabase Auth do fluxo de login/sessao.

1. Implementar Logto real no `apps/control`.
2. Substituir `apps/control/app/login/page.tsx`.
3. Substituir `supabase.auth.getUser()` e `getSession()` em layouts, APIs e actions.
4. Criar helper canonico de usuario/sessao em `packages/auth`.
5. Mapear `user_id` Logto para usuarios/tenants no PostgreSQL.

Criterio de aceite:

- login/logout nao usa Supabase;
- rotas protegidas usam Logto;
- `rg "supabase.auth" apps packages` retorna zero ocorrencias funcionais.

### Sprint 2: Data Access Do Control

Objetivo: trocar queries Supabase por Drizzle/Postgres.

Ordem sugerida:

1. Tenants e memberships.
2. Usuarios e permissoes.
3. CRM: leads/clientes.
4. Orcamentos/pedidos.
5. Financeiro/cobrancas.
6. Suporte/comunicacao/notificacoes.
7. Webhooks/domains/api keys.

Criterio de aceite:

- `apps/control` nao importa `@noro/lib/supabase` nem `@/lib/supabase`;
- principais telas passam build/typecheck;
- queries criticas possuem camada de repositorio ou servico.

### Sprint 3: Web/Sites

Objetivo: remover Supabase do runtime de sites gerados.

1. Migrar `apps/web/app/api/sites/generate/route.ts`.
2. Migrar `apps/web/app/dashboard/sites/[id]/preview/page.tsx`.
3. Migrar `apps/sites/lib/get-site.ts`.
4. Definir cache/consulta via PostgreSQL direto ou API interna.

Criterio de aceite:

- `apps/web` e `apps/sites` nao dependem de `@supabase/supabase-js`.

### Sprint 4: Storage

Objetivo: substituir Supabase Storage.

1. Escolher storage oficial.
2. Migrar `tenant-logos`.
3. Criar camada `FileStorageProvider`.
4. Atualizar URLs publicas ja salvas, se necessario.

Criterio de aceite:

- nenhum upload usa `supabase.storage`;
- arquivos de tenant continuam acessiveis.

### Sprint 5: Limpeza Final

Objetivo: remover Supabase fisicamente.

1. Remover exports `./supabase` de `packages/lib/package.json`.
2. Remover `packages/lib/supabase/*`.
3. Remover `apps/control/lib/supabase*`.
4. Remover dependencias `@supabase/*` dos package.json.
5. Atualizar `package-lock.json`.
6. Mover `supabase/` para `docs/archive/supabase/` ou manter somente sob regra de arquivo historico.
7. Rodar build/typecheck dos apps.

Criterio de aceite:

- `rg "@supabase|supabase\\.auth|@noro/lib/supabase|@/lib/supabase" apps packages` sem ocorrencias funcionais;
- `npm install` nao instala pacotes Supabase;
- docs principais citam Supabase apenas como historico.

## 7. Ordem Recomendada Antes De Billing/Asaas

Para a migracao Asaas, o ideal e nao misturar tres mudancas grandes ao mesmo tempo.

Ordem prudente:

1. Congelar Supabase documentalmente.
2. Definir Auth oficial com Logto.
3. Migrar dados centrais de tenants/clientes/pedidos/cobrancas para Drizzle/Postgres.
4. Implantar camada `PaymentProviderInterface`.
5. Implementar Asaas usando o modelo novo.
6. Remover providers antigos Stripe/Cielo/BTG depois que Asaas estiver validado.

Motivo:

Billing depende de tenant, cliente, pedido, cobranca, auth e webhook. Se Supabase ainda controla parte disso, a migracao para Asaas fica presa em uma base instavel.

## 8. Acoes Imediatas Recomendadas

1. Atualizar `supabase/README.md` para refletir `FROZEN.md`.
2. Criar `docs/architecture/data-auth-transition.md` ou usar este relatorio como base.
3. Abrir sprint tecnica "Remocao Supabase" separada da sprint Asaas.
4. Priorizar Logto antes de remover clientes Supabase.
5. Nao apagar `supabase/` ainda; primeiro remover dependencias funcionais do runtime.

## 9. Resposta Direta

Sim, e importante.

Se o banco oficial esta na VPS, Supabase deve sair do caminho. Mas o projeto ainda tem acoplamento funcional suficiente para exigir migracao planejada, nao limpeza cega. Hoje Supabase e um residuo critico, nao apenas sujeira documental.
