# Analise Da Documentacao Markdown Do Projeto

Escopo analisado:

- Todos os arquivos `.md` proprios do projeto.
- Arquivos em `.stitch/` incluidos como referencia gerada de design/produto.
- Analise complementar de arquivos `.py` e `.csv` proprios do projeto.
- Arquivos em `node_modules/`, `venv/` e `.git/` ignorados por nao serem documentacao propria.
- Pasta `docs/conceito/` ignorada conforme solicitacao.

Data de referencia: 2026-05-27

## 1. Resumo Executivo

A documentacao atual esta fragmentada em tres momentos historicos diferentes:

1. Supabase como fonte ativa de dados.
2. Tentativa/transicao para Appwrite, hoje eliminada como arquitetura alvo.
3. Nova direcao indicada por arquivos recentes: PostgreSQL central, Drizzle, Logto, dominios oficiais e migracao de billing para Asaas.

Isso cria conflito direto entre documentos. O maior risco hoje nao e falta de documentacao, e excesso de documentos antigos com tom de "fonte da verdade".

Recomendacao central:

- Criar uma fonte unica de arquitetura atual.
- Arquivar relatorios antigos e documentos gerados.
- Atualizar READMEs dos apps para refletir o estado real do codigo.
- Separar documentacao vigente, backlog e historico.

## 2. Estado Atual Inferido Pelo Repositorio

### Apps existentes

| App | Existe | Observacao |
| --- | --- | --- |
| `apps/web` | Sim | Site publico/marketing |
| `apps/control` | Sim | Control Plane da NORO em `admin.noro.guru`; gestao global de tenants, APIs, operacao e plataforma |
| `apps/core` | Sim | Portal operacional de cada tenant/agencia em `app.noro.guru`; muitas rotas/actions ainda estao desativadas como legado |
| `apps/financeiro` | Sim | Legado funcional em reavaliacao; financeiro deve virar modulo dentro de `control` e `core`, nao produto independente |
| `apps/billing` | Sim | Legado Stripe/Cielo/BTG/eRede; cobranca deve virar feature dentro de `control` e `core`, com Asaas como alvo |
| `apps/sites` | Sim | Runtime de sites gerados; documentado em `docs/apps/sites.README.md` |
| `apps/visa-api` | Sim | Vite/React; documentado em `docs/apps/visa-api.README.md`, com decisao final de landing ainda pendente |

### Packages existentes

| Package | Existe | Observacao |
| --- | --- | --- |
| `packages/db` | Sim | Indica direcao PostgreSQL/Drizzle |
| `packages/auth` | Sim | Indica direcao Logto, ainda esqueleto |
| `packages/lib` | Sim | Ainda contem Supabase legado/transicional; residuos Appwrite ativos foram removidos |
| `packages/control-worker` | Sim | Worker Graphile com tasks placeholders |
| `packages/renderer` | Sim | Usado por `apps/web` e `apps/sites` |
| `packages/types` | Sim | Tipos compartilhados, parte ainda baseada em Supabase |
| `packages/ui` | Sim | UI compartilhada |

### Tensoes arquiteturais detectadas

| Tema | Documentos antigos dizem | Codigo/novos docs indicam |
| --- | --- | --- |
| Banco | Supabase ativo e RLS como padrao | `supabase/FROZEN.md` diz que artefatos Supabase estao congelados; `scripts/README.md` aponta PostgreSQL/Drizzle |
| Auth | Supabase Auth | `packages/auth` e mensagens no codigo indicam Logto futuro |
| Appwrite | Plano de migracao Supabase -> Appwrite | Appwrite foi eliminado como alvo; residuos ativos foram removidos e novas camadas devem usar `packages/db` |
| Billing | Stripe/Cielo/BTG como foco | Novo plano oficial aponta Asaas como gateway principal; cobranca nao deve ser app isolado no produto final |
| Dominios | `control.noro.guru`, `core.noro.guru`, `visa-api.noro.guru` | Cloudflare atual tem `noro.guru`, `www`, `app`, `admin`, `sites`, `*.sites`, `api` e `visa-api`; `vistos.noro.guru` nao existe e nao deve ser assumido |
| Financeiro | Modulo completo | Codigo tem varias rotas/telas desativadas; no modelo alvo, financeiro e modulo em `control` e `core`, nao produto separado |

## 3. Classificacao Recomendada Dos Arquivos

Legenda:

- `MANTER`: documento ainda util como fonte vigente.
- `ATUALIZAR`: util, mas precisa refletir a arquitetura atual.
- `ARQUIVAR`: historico/gerado/obsoleto; nao deve orientar implementacao.
- `SUBSTITUIR`: conteudo atual deve ser trocado por README novo.

| Arquivo | Acao | Motivo |
| --- | --- | --- |
| `docs/architecture/billing-asaas-migration-plan.md` | FEITO | Movido de `docs/plano-migracao-billing-asaas.md`; documento atual da migracao financeira Asaas. |
| `docs/architecture/domains-cloudflare-dns-current-plan.md` | FEITO | Revisado e movido de `docs/plano-dominios-cloudflare.md`; Supabase marcado como legado/transicional. |
| `docs/architecture/data-auth-transition.md` | MANTER | Plano oficial de transicao de Supabase Auth/dados para Logto/PostgreSQL/Drizzle. |
| `docs/architecture/supabase-residue-report.md` | MANTER | Relatorio especifico dos residuos Supabase ainda funcionais no runtime. |
| `supabase/FROZEN.md` | MANTER | Importante como trava operacional. Deve ser destacado. |
| `scripts/README.md` | FEITO | Linkado como politica oficial de scripts, migrations, seeds e automacoes. |
| `supabase/README.md` | FEITO | Atualizado para refletir `FROZEN.md` e bloquear uso operacional de migrations/functions Supabase. |
| `docs/multi-tenant-architecture.md` | FEITO | Substituido por `docs/architecture/multi-tenant-current-model.md`; historico preservado em `docs/archive/supabase-rls-multi-tenant-architecture.md`. |
| `apps/control/README.md` | FEITO | Substituido por ponteiro para `docs/apps/control.README.md`. |
| `apps/core/CORE-CONTEXT.md` | FEITO | Substituido por aviso legado apontando para `docs/apps/core.README.md`. |
| `apps/core/CORE-IMPLEMENTATION-COMPLETE.md` | FEITO | Movido para `docs/archive/core-implementation-complete.md`; afirma "production-ready", mas ficou historico. |
| `ANALISE_COMPLETA_PROJETO.md` | FEITO | Movido para `docs/archive/2025-analise-completa-projeto.md`; substituido por `docs/architecture/current-state.md`. |
| `apps/financeiro/README.md` | FEITO | Substituido por ponteiro para `docs/apps/financeiro.README.md`. |
| `apps/web/README.md` | FEITO | Substituido por ponteiro para `docs/apps/web.README.md`. |
| `apps/visa-api/README.md` | FEITO | Substituido por ponteiro para `docs/apps/visa-api.README.md`. |
| `packages/control-worker/README.md` | FEITO | Atualizado para PostgreSQL oficial, Logto/Drizzle como direcao e Supabase apenas legado/transicional. |
| `migracao_supabase.md` | FEITO | Movido para `docs/archive/supabase-appwrite-migration.md`; plano Supabase -> Appwrite ficou historico. |
| `docs/design/TELAS_STITCH.md` | MANTER TEMPORARIAMENTE | Stitch ainda esta ativo; documento ja esta na area de design, nao na raiz. |
| `docs/backlog/web-redesign/jules-redesign-prompt.md` | FEITO | Movido de `docs/ai/prompt-jules-redesign-web.md` para backlog de redesign. |
| `docs/backlog/web-redesign/jules-redesign-sprints.md` | FEITO | Movido de `docs/ai/prompt-jules-redesign-web-sprints.md` para backlog de redesign. |
| `docs/ai/AGENTS.README.md` | FEITO | Guia generico para agentes IA manterem consistencia ao trabalhar no projeto. |
| `docs/arquitetura-comunicacao-omnichannel.md` | FEITO | Revisado e movido para `docs/backlog/communication/omnichannel.md` como backlog tecnico para execucao futura. |
| `docs/arquitetura-email-marketing.md` | FEITO | Movido para `docs/backlog/email-marketing/aws-ses-future-reference.md`; AWS SES fica como referencia futura, nao MVP. |
| `docs/guia-configuracao-canais.md` | FEITO | Revisado e movido para `docs/backlog/communication/channel-setup-whatsapp-telegram-future-reference.md`. |
| `docs/guia-integracao-redes-sociais.md` | FEITO | Revisado e movido para `docs/backlog/social-integrations/oauth-social-networks-future-reference.md`. |
| `.changeset/README.md` | MANTER | Documentacao padrao de changesets, baixo risco. |
| `.stitch/*.md` | MANTER TEMPORARIAMENTE | Stitch ainda esta ativo; nao mover agora para nao quebrar o fluxo da ferramenta. |
| `docs/design/README.md` | FEITO | Criada area curada para decisoes visuais sem mover `.stitch/`. |
| `docs/design/current-brand-reference.md` | FEITO | Inventario provisorio do estado atual de marca/design; nao e Brand Book oficial. |

## 4. Documentos Com Maior Risco De Confundir Decisao

### 4.1 `ANALISE_COMPLETA_PROJETO.md`

Problemas:

- Data antiga: 2025-11-13.
- Afirma Control/Core/Web como "producao ready".
- Lista pagamentos como Stripe, BTG e Cielo, enquanto a nova decisao e Asaas.
- Trata Supabase/RLS como arquitetura ativa.
- Ignora `apps/sites`, que existe no repo.
- Nao reflete congelamento de Supabase nem direcao Drizzle/Logto.

Acao:

- [x] Movido para `docs/archive/2025-analise-completa-projeto.md`.
- [x] Criado novo `docs/architecture/current-state.md`.

### 4.2 `apps/core/CORE-IMPLEMENTATION-COMPLETE.md`

Problemas:

- Diz que `/core` esta "production-ready".
- Codigo atual tem varias actions e paginas com mensagens de legado desativado.
- Pode induzir implementacao baseada em Supabase/Appwrite legado.

Acao:

- [x] Arquivado em `docs/archive/core-implementation-complete.md`.
- Substituir por README curto com estado real:
  - rotas ativas;
  - rotas desativadas;
  - dependencias de backend;
  - proximo passo para reativacao via PostgreSQL/Drizzle/Logto.

### 4.3 `apps/financeiro/README.md`

Problemas:

- Descreve produto completo.
- Cita pagamentos Stripe/Cielo/PayPal.
- Codigo atual mostra endpoints legados desativados em massa.
- Conflita com plano Asaas.

Acao:

- [x] Substituido por ponteiro curto em `apps/financeiro/README.md`.
- [x] Criado `docs/apps/financeiro.README.md` dizendo que o financeiro e modulo em reativacao, dependente do modelo financeiro canonico.

### 4.4 `migracao_supabase.md`

Problemas:

- Documento de introspeccao Supabase -> Appwrite.
- Appwrite aparece desativado no codigo e eliminado como arquitetura alvo.
- Pode levar alguem a retomar caminho que ja foi abandonado.

Acao:

- [x] Arquivado em `docs/archive/supabase-appwrite-migration.md`.
- Referenciar apenas se precisar entender a tentativa antiga.

### 4.5 `supabase/README.md` vs `supabase/FROZEN.md`

Problema:

- `supabase/README.md` instrui fluxo ativo de migrations.
- `supabase/FROZEN.md` diz para nao rodar migrations/functions/config contra o banco restaurado sem plano manual.

Acao:

- [x] Atualizado `supabase/README.md` para abrir com aviso de congelamento.
- [x] Deixado claro que migrations ali sao historicas, salvo plano aprovado.

## 5. Documentos Bons, Mas Que Precisam Virar Fonte Oficial

### 5.1 `docs/architecture/domains-cloudflare-dns-current-plan.md`

Esta e a fonte oficial atual para dominios e DNS Cloudflare.

Acao:

- [x] Movido de `docs/plano-dominios-cloudflare.md` para `docs/architecture/domains-cloudflare-dns-current-plan.md`.
- [x] Atualizado para tratar `supabase.noro.guru` como legado/transicional, nao destino obrigatorio.
- [x] Mantidos hosts legados como aliases temporarios.
- [x] Adicionados padroes futuros para OAuth e webhooks em `api.noro.guru`/`webhook.noro.guru`.

### 5.2 `docs/architecture/billing-asaas-migration-plan.md`

Esta e a melhor referencia atual para billing.

Acao:

- [x] Movido de `docs/plano-migracao-billing-asaas.md` para `docs/architecture/billing-asaas-migration-plan.md`.
- [x] Mantido como documento atual da migracao financeira Asaas.
- [ ] Futuro: atualizar quando a implementacao real comecar.

### 5.3 `scripts/README.md`

Este arquivo e importante porque aponta uma mudanca estrutural:

- PostgreSQL central por `DATABASE_URL`;
- Drizzle bootstrap em `packages/db`;
- Logto bootstrap em `packages/auth`;
- Appwrite eliminado como alvo e Supabase ad-hoc congelado.

Acao:

- [x] Linkado no documento de arquitetura atual como politica oficial.
- [x] Expandido com regra de manutencao documental.
- Futuro: adicionar auditoria recorrente para detectar drift entre scripts, codigo e docs.

## 6. Documentos De Design E Stitch

Arquivos:

- `.stitch/DESIGN*.md`
- `.stitch/PROMPTS*.md`
- `.stitch/STITCH-SETUP.md`
- `docs/design/TELAS_STITCH.md`
- `docs/backlog/web-redesign/jules-redesign-*.md`

Leitura:

- Sao uteis para inspiracao visual, escopo de produto e backlog.
- Nao sao confiaveis como estado atual do sistema.
- Muitos nomes de rotas/dominos estao aspiracionais.
- Alguns documentos citam `visa.noro.guru` ou `vistos.noro.guru`, mas `vistos.noro.guru` nao existe hoje. A recomendacao atual e usar `api.noro.guru` para endpoint tecnico e avaliar `visa-api.noro.guru` como landing/documentacao comercial do servico.

Acao recomendada:

- [x] Criar `docs/design/` como area curada de decisoes visuais.
- [x] Criar `docs/design/current-brand-reference.md` como referencia provisoria do estado atual de marca/design, sem tratar como Brand Book final.
- Manter `.stitch/` no lugar enquanto o ciclo Stitch ainda estiver ativo.
- Nao usar arquivos gerados do Stitch como fonte de verdade arquitetural.
- Quando o ciclo Stitch encerrar, mover para `docs/archive/stitch/` ou resumir decisoes aprovadas em `docs/design/`.

## 7. Nova Estrutura Recomendada Para `docs/`

Proposta:

```txt
docs/
  architecture/
    current-state.md
    multi-tenant-current-model.md
    domains-cloudflare-dns-current-plan.md
    billing-asaas-migration-plan.md
    data-auth-transition.md
    apps-and-packages.md
  operations/
    scripts-safety.md
    supabase-frozen.md
    env-vars.md
  design/
    README.md
    current-brand-reference.md
  backlog/
    README.md
    web-redesign/
      jules-redesign-prompt.md
      jules-redesign-sprints.md
    communication/
      README.md
      channel-setup-whatsapp-telegram-future-reference.md
      omnichannel.md
    email-marketing/
      README.md
      aws-ses-future-reference.md
    social-integrations/
      README.md
      oauth-social-networks-future-reference.md
  archive/
    2025-analise-completa-projeto.md
    supabase-rls-multi-tenant-architecture.md
    supabase-appwrite-migration.md
    stitch/
```

Observacao:

- Evitar muitos documentos soltos na raiz.
- README de app deve ser curto e apontar para `docs/architecture/current-state.md`.

## 8. Analise Complementar De Arquivos `.py` E `.csv`

Data da verificacao: 2026-05-27

Escopo:

- arquivos `.py` e `.csv` proprios do projeto;
- ignorados `node_modules`, `.git`, `.next`, `dist`, `build`, `venv`, `.venv` e `__pycache__`.

Resultado:

- nenhum arquivo `.py` ativo encontrado fora de `docs/archive/`;
- existem `.py` historicos em `docs/archive/migracao-bd/`, ja arquivados;
- quatro arquivos `.csv` proprios encontrados;
- tres CSVs sao snapshots/exportacoes Supabase;
- um CSV e template ativo de importacao de leads no `apps/control`.

### Classificacao

| Arquivo | Acao recomendada | Motivo |
| --- | --- | --- |
| `Supabase Snippet Column metadata with primary and foreign key details.csv` | FEITO | Movido para `docs/archive/supabase-schema-snapshots/Supabase Snippet Column metadata with primary and foreign key details.csv`. |
| `docs/Supabase Snippet Public Schema Column Inventory.csv` | FEITO | Movido para `docs/archive/supabase-schema-snapshots/Supabase Snippet Public Schema Column Inventory.csv`. |
| `docs/Supabase Snippet Foreign Key Constraints Overview.csv` | FEITO | Movido para `docs/archive/supabase-schema-snapshots/Supabase Snippet Foreign Key Constraints Overview.csv`. |
| `apps/control/public/templates/leads_import.csv` | MANTER | Template ativo usado por `apps/control/components/leads/LeadImportModal.tsx` via `/templates/leads_import.csv`. |

### Destino Recomendado

Criar:

```txt
docs/archive/supabase-schema-snapshots/
```

Movidos para esse destino:

```txt
docs/archive/supabase-schema-snapshots/Supabase Snippet Column metadata with primary and foreign key details.csv
docs/archive/supabase-schema-snapshots/Supabase Snippet Public Schema Column Inventory.csv
docs/archive/supabase-schema-snapshots/Supabase Snippet Foreign Key Constraints Overview.csv
```

Manter no lugar:

```txt
apps/control/public/templates/leads_import.csv
```

### Observacoes

- Os CSVs Supabase podem ajudar na migracao para PostgreSQL/Drizzle, mas devem ser tratados como snapshot historico.
- Nao devem ficar na raiz nem misturados em `docs/` como se fossem documentacao atual.
- O template de leads e arquivo publico funcional; mover quebraria o botao de download do modal de importacao.
- Existem exportacoes CSV geradas em runtime por componentes de dashboard, mas elas nao sao arquivos estaticos do repositorio.
- Scripts Python em `docs/archive/migracao-bd/` ja estao em arquivo morto; nao devem orientar execucao atual sem revisao explicita.

## 9. Ordem Recomendada De Limpeza

### Sprint Docs 1: Travas E Fonte Unica

1. [x] Criar `docs/architecture/current-state.md`.
2. [x] Criar `docs/architecture/supabase-residue-report.md` para mapear residuos funcionais Supabase.
3. [x] Atualizar `supabase/README.md` para refletir `FROZEN.md`.
4. [x] Criar `docs/architecture/data-auth-transition.md`.
5. [x] Linkar `scripts/README.md` como politica oficial.

### Sprint Docs 2: READMEs Dos Apps

1. [x] Substituir `apps/web/README.md`. Destino: `docs/apps/web.README.md`.
2. [x] Substituir `apps/visa-api/README.md`. Destino: `docs/apps/visa-api.README.md`.
3. [x] Substituir `apps/financeiro/README.md`. Destino: `docs/apps/financeiro.README.md`.
4. [x] Atualizar `apps/control/README.md`. Destino: `docs/apps/control.README.md`.
5. [x] Atualizar `apps/core/CORE-CONTEXT.md` ou substituir por `apps/core/README.md`. Destino: `docs/apps/core.README.md`.
6. [x] Documentar `apps/sites`. Destino: `docs/apps/sites.README.md`.

### Sprint Docs 3: Arquivo Historico

1. [x] Mover `ANALISE_COMPLETA_PROJETO.md` para archive. Destino: `docs/archive/2025-analise-completa-projeto.md`.
2. [x] Mover `CORE-IMPLEMENTATION-COMPLETE.md` para archive. Destino: `docs/archive/core-implementation-complete.md`.
3. [x] Mover `migracao_supabase.md` para archive. Destino: `docs/archive/supabase-appwrite-migration.md`.
4. [x] Criar `docs/design/` para decisoes visuais curadas; manter `TELAS_STITCH.md` e `.stitch/*` ativos enquanto o ciclo Stitch nao terminar.

### Sprint Docs 4: Backlogs De Produto

1. [x] Atualizar docs de comunicacao omnichannel. Destino: `docs/backlog/communication/omnichannel.md`.
2. [x] Atualizar email marketing para usar modelo financeiro novo. Destino: `docs/backlog/email-marketing/aws-ses-future-reference.md`.
3. [x] Atualizar guias de redes sociais e canais com dominios oficiais. Destinos: `docs/backlog/communication/channel-setup-whatsapp-telegram-future-reference.md` e `docs/backlog/social-integrations/oauth-social-networks-future-reference.md`.
4. [x] Mover prompts Jules para backlog de redesign. Destinos: `docs/backlog/web-redesign/jules-redesign-prompt.md` e `docs/backlog/web-redesign/jules-redesign-sprints.md`.

### Sprint Docs 5: Consistencia Para Agentes

1. [x] Criar `docs/ai/AGENTS.README.md` como manual generico para Codex, Copilot, Gemini Code, Claude Code e outros agentes.

### Sprint Docs 6: Arquivos Soltos `.py` E `.csv`

1. [x] Criar `docs/archive/supabase-schema-snapshots/`.
2. [x] Mover os tres CSVs de snapshot Supabase para `docs/archive/supabase-schema-snapshots/`.
3. [x] Manter `apps/control/public/templates/leads_import.csv` no lugar por ser arquivo funcional.
4. [x] Confirmar que nao ha arquivos `.py` ativos fora de `docs/archive/` a classificar.

### Sprint Docs 7: Codigo Legado E Arquivos Sem Uso Claro

1. [x] Criar auditoria tecnica de codigo legado. Destino: `docs/codebase-unused-legacy-audit.md`.
2. [x] Classificar Supabase como runtime transicional, nao como arquitetura futura.
3. [x] Classificar Stripe/Cielo/BTG/e.Rede como billing legado que deve migrar para Asaas antes de remocao.
4. [x] Identificar e remover `*.tsbuildinfo` versionados; regra `*.tsbuildinfo` adicionada ao `.gitignore`.
5. [x] Identificar `apps/billing` e `apps/financeiro` como fontes de reaproveitamento antes de absorcao por `control`/`core`.
6. [x] Identificar e remover duplicacao inativa em `packages/control-worker/src/jobs/*`; registry ativo permanece em `packages/control-worker/src/tasks/*`.
7. [x] Criar `npm run guard:legacy-refs` e adicionar ao CI.

### Sprint Tecnica: Remocao De Residuos Appwrite

Objetivo: remover Appwrite fisicamente do repositorio sem quebrar build.

Itens conhecidos:

1. [x] Remover `node-appwrite` de `package.json` e `package-lock.json`.
2. [x] Remover `scripts/appwrite/create-control-plane-schema.ts`.
3. [x] Remover `packages/lib/appwrite.ts`.
4. [x] Remover `packages/lib/constants/appwrite-collections.ts`.
5. [x] Substituir exports/tipos Appwrite em `packages/types`.
6. [x] Substituir imports `@/types/appwrite` no `apps/core`.
7. [x] Trocar mensagens de erro que mencionam "collection Appwrite oficial" por linguagem de legado generica.
8. [x] Remover `packages/lib/services/appwriteCrud.ts`.
9. [x] Remover `apps/visa-api/services/appwriteService.ts`.
10. [x] Rodar build/typecheck dos apps afetados.

## 10. Decisoes Que Precisam Ser Fechadas Antes De Reescrever Tudo

1. [x] Supabase sera totalmente substituido por PostgreSQL/Drizzle/Logto. Uso restante e apenas transicional enquanto a migracao esta em andamento.
2. [x] Logto sera a camada oficial de auth. O servico ja esta configurado na VPS e pronto para uso; falta integrar o runtime dos apps.
3. [x] Impedir reintroducao de Appwrite com `npm run guard:no-appwrite` no CI. Referencias historicas ficam permitidas apenas em `docs/archive/`.
4. [x] `apps/core` continua como app separado e sera o portal de acesso de cada tenant em `app.noro.guru`. `apps/control` continua separado como Control Plane da plataforma em `admin.noro.guru`.
5. [x] `apps/billing` nao deve ser produto separado no modelo final. Cobranca e feature dentro de `apps/control` para cobrar tenants, mensalidades e servicos da plataforma, e dentro de `apps/core` para tenants cobrarem clientes finais.
6. [x] `apps/financeiro` nao deve ser produto independente no modelo final. Financeiro e modulo dentro de `apps/control` para fluxo de caixa, mensalidades, recebiveis dos tenants e operacao NORO, e dentro de `apps/core` para o financeiro operacional do tenant contra clientes finais. Billing e financeiro devem se integrar nos dois contextos.
7. [ ] `visa-api`: Cloudflare ja possui `api.noro.guru` e `visa-api.noro.guru` como A records para a VPS `45.32.169.173`. Recomendacao atual: `api.noro.guru` para endpoint tecnico de vistos e futuras APIs; `visa-api.noro.guru` para possivel landing/documentacao comercial. `vistos.noro.guru` nao existe hoje e nao deve ser tratado como destino oficial.

## 11. Recomendacao Final

Status apos revisao:

- limpeza documental principal: concluida;
- residuos Appwrite ativos: removidos e bloqueados por guard;
- snapshots Supabase CSV: arquivados;
- READMEs principais dos apps: substituidos por ponteiros ou documentacao central;
- auditoria tecnica de codigo legado criada em `docs/codebase-unused-legacy-audit.md`;
- pendencias restantes: decisao final de `visa-api.noro.guru` como landing/documentacao, atualizacao futura do plano Asaas quando a implementacao real comecar e execucao das sprints tecnicas de limpeza.

Nao recomendo apagar documentos adicionais agora. Recomendo manter historico em `docs/archive/`, backlog em `docs/backlog/` e fontes atuais em `docs/architecture/`, `docs/apps/`, `docs/design/`, `scripts/README.md` e `supabase/FROZEN.md`.

Os documentos mais perigosos devem sair do caminho principal:

- `ANALISE_COMPLETA_PROJETO.md`: FEITO, movido para `docs/archive/2025-analise-completa-projeto.md`
- `apps/core/CORE-IMPLEMENTATION-COMPLETE.md`: FEITO, movido para `docs/archive/core-implementation-complete.md`
- `apps/financeiro/README.md`: FEITO, substituido por ponteiro para `docs/apps/financeiro.README.md`
- `migracao_supabase.md`: FEITO, movido para `docs/archive/supabase-appwrite-migration.md`
- `supabase/README.md` sem aviso de congelamento: FEITO, aviso adicionado

Os documentos que devem virar base oficial:

- `docs/apps/README.md`
- `docs/apps/*.README.md`
- `docs/architecture/domains-cloudflare-dns-current-plan.md`
- `docs/architecture/billing-asaas-migration-plan.md`
- `docs/codebase-unused-legacy-audit.md`
- `supabase/FROZEN.md`
- `scripts/README.md`

A prioridade e criar uma arquitetura atual curta e confiavel. Depois disso, os READMEs antigos podem ser reescritos sem risco de perder contexto historico.

Observacao sobre Appwrite:

- Appwrite nao deve voltar ao roadmap.
- Residuos Appwrite ativos foram removidos de `apps`, `packages`, `scripts` e dependencias.
