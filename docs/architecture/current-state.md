# Current State Architecture

Documento de referencia curta sobre o estado atual do projeto NORO.

Data de referencia: 2026-05-27

## 1. Proposito

Este documento substitui o relatorio antigo `ANALISE_COMPLETA_PROJETO.md` como ponto de partida para decisoes tecnicas.

O relatorio antigo foi preservado como historico em:

```txt
docs/archive/2025-analise-completa-projeto.md
```

## 2. Leitura Atual

O projeto esta em transicao arquitetural.

Ha codigo e documentacao de fases anteriores envolvendo:

- Supabase como backend principal;
- Appwrite como tentativa de migracao, ja eliminada como arquitetura alvo;
- Stripe, Cielo, BTG e eRede como providers de pagamento;
- hosts legados como `control.noro.guru`, `core.noro.guru` e `visa-api.noro.guru`.

A direcao atual indicada pelos documentos e pelo codigo mais recente aponta para:

- PostgreSQL central via `DATABASE_URL`;
- Drizzle em `packages/db`;
- Logto em `packages/auth`, com servico ja configurado na VPS;
- dominios oficiais registrados na Cloudflare: `noro.guru`, `www.noro.guru`, `app.noro.guru`, `admin.noro.guru`, `sites.noro.guru`, `*.sites.noro.guru`, `api.noro.guru` e `visa-api.noro.guru`; `vistos.noro.guru` nao existe;
- Asaas como gateway financeiro principal;
- Supabase como camada legada/transicional a ser totalmente substituida por PostgreSQL/Drizzle/Logto;
- Appwrite eliminado do alvo arquitetural; residuos ativos removidos da arvore de apps/packages/scripts.

## 3. Apps Atuais

| App | Papel atual | Estado recomendado |
| --- | --- | --- |
| `apps/web` | Site publico e marketing | Manter. README precisa substituir texto generico de AI Studio. |
| `apps/control` | Control Plane da NORO em `admin.noro.guru` | Manter separado do portal tenant. Responsavel por gestao global da plataforma: tenants, APIs, operacao, billing, configuracoes e governanca. |
| `apps/core` | Portal operacional de cada tenant/agencia em `app.noro.guru` | Manter como app separado. Tratar como parcialmente legado ate revisar rotas/actions desativadas. |
| `apps/financeiro` | Financeiro legado em reavaliacao | Nao tratar como produto independente no modelo final. O dominio financeiro deve existir como modulo em `apps/control` e `apps/core`, com responsabilidades separadas. |
| `apps/billing` | Billing/cobranca legado | Nao tratar como produto independente no modelo final. Cobranca deve existir como feature em `apps/control` e `apps/core`, usando Asaas como alvo. |
| `apps/sites` | Runtime de sites gerados | Documentado em `docs/apps/sites.README.md`; deve se alinhar ao plano de dominios e ao modelo multi-tenant. |
| `apps/visa-api` | Produto/API de vistos | `api.noro.guru` e `visa-api.noro.guru` ja apontam para a VPS `45.32.169.173`. Usar `api.noro.guru` para endpoints tecnicos; avaliar `visa-api.noro.guru` como landing/documentacao comercial. Nao assumir `vistos.noro.guru`. |

## 4. Packages Atuais

| Package | Papel | Observacao |
| --- | --- | --- |
| `packages/db` | Acesso PostgreSQL/Drizzle | Direcao recomendada para nova camada de dados. |
| `packages/auth` | Auth oficial Logto | Servico Logto ja configurado na VPS; integrar runtime dos apps. |
| `packages/lib` | Utilitarios compartilhados | Ainda contem Supabase legado/transicional. Residuos Appwrite ativos foram removidos. |
| `packages/types` | Tipos compartilhados | Parte ainda baseada em Supabase; revisar conforme migração. |
| `packages/ui` | Componentes UI compartilhados | Manter. |
| `packages/renderer` | Renderizacao de sites/blueprints | Usado por `web` e `sites`. |
| `packages/control-worker` | Workers assíncronos | Graphile Worker; tasks ainda precisam implementacao real. |

## 5. Dados E Auth

### Estado atual

O codigo ainda possui muito uso de Supabase:

- clientes Supabase em `packages/lib/supabase`;
- chamadas Supabase em `apps/control`;
- tipos e comentarios baseados em Supabase;
- migrations e functions preservadas em `supabase/`.

Ao mesmo tempo, existem travas claras:

- `supabase/FROZEN.md` diz que os artefatos Supabase sao historicos e nao devem ser executados contra o banco restaurado sem plano manual;
- `scripts/README.md` define caminho permitido por `DATABASE_URL`, `packages/db` e `packages/auth`;
- residuos Appwrite ativos foram removidos de `apps`, `packages`, `scripts`, `package.json` e `package-lock.json`;
- referencias a Appwrite ficam apenas em documentacao historica/arquitetural.

### Diretriz

Para novas implementacoes estruturais:

1. Nao criar nova dependencia Appwrite.
2. Nao rodar migrations Supabase antigas sem plano aprovado.
3. Preferir `packages/db` e `DATABASE_URL` para nova camada de persistencia.
4. Tratar Supabase como legado/transicional ate a remocao completa.
5. Tratar Logto como auth oficial e implementar a integracao runtime dos apps.

### Appwrite

Appwrite esta eliminado como arquitetura alvo.

Limpeza fisica concluida em 2026-05-27:

- `node-appwrite` removido de `package.json` e `package-lock.json`;
- `scripts/appwrite/create-control-plane-schema.ts` removido;
- `packages/lib/appwrite.ts` removido;
- `packages/lib/constants/appwrite-collections.ts` removido;
- `packages/lib/services/appwriteCrud.ts` removido;
- `packages/types/appwrite.ts` removido;
- `apps/core/types/appwrite.ts` renomeado para `apps/core/types/database.ts`;
- imports `@/types/appwrite` substituidos por `@/types/database`;
- `apps/visa-api/services/appwriteService.ts` removido;
- mensagens de erro em apps substituidas por linguagem neutra de legado.

Diretriz daqui para frente:

1. Nao reinstalar SDK Appwrite.
2. Nao recriar scripts Appwrite ativos.
3. Se for necessario consultar a fase antiga, usar apenas `docs/archive/`.
4. Novas camadas de dados devem usar PostgreSQL/Drizzle.
5. `npm run guard:no-appwrite` deve continuar no CI para impedir reintroducao.

## 6. Billing E Pagamentos

O estado atual possui Stripe, Cielo, BTG e eRede espalhados em apps diferentes.

Decisao nova:

- Asaas deve ser o gateway principal para novos fluxos financeiros.
- Stripe/Cielo/BTG/eRede devem ser tratados como legado durante a transicao.
- A migracao deve seguir o plano em:

```txt
docs/architecture/billing-asaas-migration-plan.md
```

Separacao obrigatoria:

| Dominio financeiro | Descricao |
| --- | --- |
| `platform_billing` | Mensalidade, setup, add-ons e modulos da NORO cobrados da agencia. |
| `agency_collections` | Cobrancas da agencia contra cliente final. |
| `commission_split` | Comissao/split da NORO sobre transacoes da agencia. |

Distribuicao por app no modelo alvo:

| App | Billing/cobranca | Financeiro |
| --- | --- | --- |
| `apps/control` | Cobranca dos tenants: mensalidades, setup, add-ons, servicos, inadimplencia e status de contrato. | Financeiro da NORO: fluxo de caixa, contas a receber dos tenants, contas a pagar, conciliacao, visao global e relatorios gerenciais. |
| `apps/core` | Ferramenta de cobranca do tenant contra seus clientes finais: Pix, boleto, cartao, links, assinaturas, cobranças e status. | Financeiro operacional do tenant: recebiveis de clientes finais, despesas, fluxo de caixa, duplicatas, centros de custo, conciliacao e indicadores. |

Regra: `apps/billing` e `apps/financeiro` podem existir durante a transicao tecnica, mas nao devem orientar a fronteira final de produto. A fronteira final e por contexto: plataforma NORO em `control`, operacao tenant em `core`.

## 7. Dominios

Fonte oficial atual:

```txt
docs/architecture/domains-cloudflare-dns-current-plan.md
```

Mapa alvo:

| Dominio | Papel |
| --- | --- |
| `noro.guru` | Marketing institucional |
| `app.noro.guru` | Produto para agencias/clientes |
| `admin.noro.guru` | Operacao interna/Control Plane |
| `sites.noro.guru` | Sites gerados/oferta de sites IA |
| `api.noro.guru` | APIs tecnicas, incluindo API de vistos e futuras APIs |
| `visa-api.noro.guru` | Registrado na Cloudflare, aponta para a VPS `45.32.169.173`; possivel landing/documentacao comercial do servico de API de vistos |

Hosts legados/nao oficiais:

- `control.noro.guru`;
- `core.noro.guru`;
- `vistos.noro.guru`, que nao existe no DNS atual.

## 8. Documentacao Vigente

Documentos que devem orientar novas decisoes:

| Documento | Uso |
| --- | --- |
| `docs/architecture/current-state.md` | Estado atual consolidado. |
| `docs/architecture/data-auth-transition.md` | Fonte oficial para transicao Supabase Auth/dados -> Logto/PostgreSQL/Drizzle. |
| `docs/architecture/multi-tenant-current-model.md` | Modelo multi-tenant atual sem Supabase/RLS como premissa. |
| `docs/architecture/supabase-residue-report.md` | Inventario dos residuos Supabase ainda presentes no runtime. |
| `docs/apps/README.md` | Indice oficial da documentacao dos apps. |
| `docs/backlog/README.md` | Indice de propostas futuras que ainda nao sao arquitetura vigente. |
| `docs/architecture/domains-cloudflare-dns-current-plan.md` | Dominios e DNS. |
| `docs/architecture/billing-asaas-migration-plan.md` | Migracao financeira e billing. |
| `docs/analise-documentacao-md-projeto.md` | Auditoria da documentacao `.md`. |
| `supabase/FROZEN.md` | Trava operacional de Supabase legado. |
| `scripts/README.md` | Politica oficial de seguranca para scripts, migrations, seeds e automacoes. |

### Politica Oficial De Scripts

O arquivo `scripts/README.md` e a fonte oficial para scripts que podem alterar schema, seed, migrar dados, bootstrapar providers legados ou tocar infraestrutura sensivel.

Regra:

- qualquer script novo com efeito em dados, schema, auth, billing ou providers externos deve seguir `scripts/README.md`;
- scripts legados Supabase devem permanecer congelados ou protegidos por guards explicitos;
- quando um script novo alterar uma direcao arquitetural, atualizar tambem `docs/architecture/current-state.md` e o documento de dominio afetado;
- revisoes automaticas podem detectar divergencias, mas a atualizacao final da decisao arquitetural deve ser validada antes de virar fonte oficial.

Documentos historicos ou de baixa confiabilidade arquitetural:

- `docs/archive/2025-analise-completa-projeto.md`;
- `docs/archive/supabase-rls-multi-tenant-architecture.md`;
- `migracao_supabase.md`;
- `apps/core/CORE-IMPLEMENTATION-COMPLETE.md`;
- `docs/design/TELAS_STITCH.md`;
- `.stitch/*.md`.

## 9. Prioridades Tecnicas

Ordem prudente:

1. Executar migracao completa de dados/auth para PostgreSQL/Drizzle/Logto, mantendo Supabase apenas como transicao temporaria.
2. Atualizar READMEs dos apps para refletir estado real.
3. Implementar modelo financeiro canonico antes de telas Asaas.
4. Migrar billing/pagamentos conforme plano Asaas.
5. Reativar `apps/financeiro` sobre modelo financeiro novo.
6. Revisar `apps/core` e remover mensagens/rotas legadas ou reativar com backend oficial.
7. Consolidar decisao final de `visa-api.noro.guru` como landing/documentacao comercial ou descartar esse uso.

## 10. Riscos Atuais

| Risco | Impacto | Mitigacao |
| --- | --- | --- |
| Documentos antigos com status "production-ready" | Decisoes erradas de roadmap | Arquivar e linkar este documento como fonte atual. |
| Supabase README conflitando com FROZEN | Execucao acidental de migrations antigas | Atualizar `supabase/README.md`. |
| Reintroducao de Appwrite | Risco de retomar caminho abandonado | Manter Appwrite fora de `apps`, `packages`, `scripts` e dependencias. |
| Billing legado espalhado | Risco financeiro e duplicidade de status | Seguir plano Asaas incremental. |
| Financeiro documentado como completo, mas codigo desativado | Planejamento incorreto de produto | Substituir README do app financeiro. |

## 11. Proximo Passo Recomendado

Antes de alterar arquitetura de produto, fazer uma Sprint Docs curta:

1. Arquivar `apps/core/CORE-IMPLEMENTATION-COMPLETE.md`.
2. Manter Appwrite fora da arvore ativa apos limpeza concluida.
3. Criar rotina recorrente de auditoria documental para apontar divergencias entre codigo, scripts e docs.
4. Migrar dados/auth conforme `docs/architecture/data-auth-transition.md`.
5. Migrar billing conforme `docs/architecture/billing-asaas-migration-plan.md`.

Isso reduz o risco de novas decisoes serem tomadas com base em documentacao obsoleta.
