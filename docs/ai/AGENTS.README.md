# AI Agents Guide

Status: referencia operacional generica.

Data de referencia: 2026-05-27

## Objetivo

Este documento orienta qualquer IA ou coding agent que for trabalhar no projeto NORO.

Ele deve servir para Codex, Copilot, Gemini Code, Claude Code ou qualquer outra ferramenta. Nao e prompt especifico de uma plataforma. A finalidade e manter consistencia, contexto e continuidade entre agentes diferentes.

## Leitura Inicial Obrigatoria

Antes de editar codigo ou documentacao, ler:

1. `docs/architecture/current-state.md`
2. `docs/analise-documentacao-md-projeto.md`
3. `docs/architecture/data-auth-transition.md`
4. `docs/architecture/multi-tenant-current-model.md`
5. `docs/architecture/domains-cloudflare-dns-current-plan.md`
6. `docs/architecture/billing-asaas-migration-plan.md`
7. `docs/apps/README.md`
8. `scripts/README.md`

Leituras conforme a tarefa:

| Tema | Ler tambem |
| --- | --- |
| Supabase | `docs/architecture/supabase-residue-report.md`, `supabase/FROZEN.md` |
| Apps | `docs/apps/*.README.md` |
| Design | `docs/design/README.md`, `docs/design/current-brand-reference.md` |
| Backlog | `docs/backlog/README.md` e subpasta relacionada |
| Billing | `docs/architecture/billing-asaas-migration-plan.md` |
| Dominios | `docs/architecture/domains-cloudflare-dns-current-plan.md` |
| Auth/dados | `docs/architecture/data-auth-transition.md` |

## Fontes De Verdade

Documentos vigentes ficam principalmente em:

```txt
docs/architecture/
docs/apps/
docs/design/
scripts/README.md
```

Backlog fica em:

```txt
docs/backlog/
```

Historico fica em:

```txt
docs/archive/
```

Conceitos aspiracionais ficam em:

```txt
docs/conceito/
```

Arquivos em `docs/archive/`, `docs/conceito/` e prompts antigos nao devem ser tratados como estado implementado sem confirmacao nos documentos vigentes e no codigo.

## Decisoes Arquiteturais Atuais

- PostgreSQL via `DATABASE_URL` e a direcao oficial de dados.
- Drizzle em `packages/db` e a direcao para acesso novo a dados.
- Logto em `packages/auth` e a camada oficial de autenticacao; o servico ja esta configurado na VPS.
- Supabase e legado/transicional ate remocao completa; nao e base para implementacao nova.
- Appwrite foi eliminado como alvo arquitetural.
- Asaas e o gateway financeiro principal para novos fluxos.
- Stripe, Cielo, BTG e eRede sao legado durante a transicao financeira.
- Dominios oficiais seguem `docs/architecture/domains-cloudflare-dns-current-plan.md`.
- Multi-tenant atual deve seguir `docs/architecture/multi-tenant-current-model.md`.

## Regras De Trabalho

1. Ler os documentos de contexto antes de propor mudanca estrutural.
2. Verificar o codigo real antes de assumir que um documento antigo esta correto.
3. Preservar historico movendo para `docs/archive/` quando fizer sentido.
4. Usar `docs/backlog/` para planos futuros que nao sao arquitetura vigente.
5. Nao criar nova dependencia Supabase ou Appwrite.
6. Nao rodar migrations Supabase antigas sem plano aprovado.
7. Nao migrar billing antes de tenant/auth/modelo financeiro estarem claros.
8. Evitar reativar caminhos antigos apenas porque aparecem em docs historicos.
9. Ao mover documento, atualizar links e `docs/analise-documentacao-md-projeto.md`.
10. Ao mudar decisao arquitetural, atualizar `docs/architecture/current-state.md`.

## Acompanhamento De Sprints

Para tarefas de implementacao da fundacao NORO, todo agente deve ler antes:

- `docs/SPRINT_STATUS.md`
- `docs/backlog/implementation/noro-foundation-sprint-plan.md`

`docs/SPRINT_STATUS.md` e o painel operacional rapido do projeto. Ele deve ser atualizado ao final de cada tarefa ou sprint com:

- status atualizado;
- checklists executados;
- arquivos alterados;
- decisoes tomadas;
- decisoes pendentes para Paulo;
- bloqueios;
- resultado final.

O plano detalhado das sprints fica em:

`docs/backlog/implementation/noro-foundation-sprint-plan.md`

Nenhuma sprint deve ser considerada concluida sem atualizacao explicita de `docs/SPRINT_STATUS.md`.

## Como Classificar Uma Tarefa

Antes de agir, classificar a tarefa:

| Tipo | Destino/documentos |
| --- | --- |
| Arquitetura vigente | `docs/architecture/` |
| Documentacao de app | `docs/apps/` e ponteiro em `apps/*/README.md` |
| Backlog futuro | `docs/backlog/` |
| Historico | `docs/archive/` |
| Design curado | `docs/design/` |
| Script/migration/seed | `scripts/README.md` e area tecnica correspondente |

## Checklist Antes De Editar

- [ ] Entendi se a tarefa e vigente, backlog ou historico.
- [ ] Li o documento de arquitetura relacionado.
- [ ] Verifiquei se existe conflito com Supabase/Appwrite legado.
- [ ] Verifiquei se a mudanca afeta billing, auth, tenant ou dominios.
- [ ] Sei quais docs precisam ser atualizados no final.

## Checklist Ao Final

Atualizar, quando aplicavel:

- `docs/architecture/current-state.md`
- `docs/analise-documentacao-md-projeto.md`
- `docs/apps/README.md`
- `docs/apps/*.README.md`
- `docs/backlog/**`
- `docs/design/**`
- `scripts/README.md`
- READMEs ponteiro dentro de `apps/*/README.md`

Tambem verificar:

- links quebrados para arquivos movidos;
- referencias antigas a Supabase/Appwrite como se fossem alvo atual;
- dominios antigos `control`, `core`, `visa-api` como se fossem finais;
- docs em raiz que deveriam estar em `docs/architecture`, `docs/backlog` ou `docs/archive`.

## Padrao De Pedido Para Outros Agentes

Exemplo de uso:

```txt
Leia docs/ai/AGENTS.README.md para entender como trabalhar neste projeto.
Depois execute a tarefa: [descrever tarefa].
Ao final, atualize os documentos impactados e informe quais arquivos foram alterados.
```

## O Que Evitar

- Usar `docs/archive/` como fonte atual.
- Usar `docs/conceito/` como prova de implementacao.
- Criar solucao nova sem verificar `docs/architecture/current-state.md`.
- Fazer mudanca estrutural sem atualizar documentacao.
- Duplicar documentos com nomes parecidos em pastas diferentes.
- Deixar links apontando para caminhos removidos.

## Observacao Final

Este arquivo deve permanecer generico. Instrucoes especificas de uma ferramenta devem ficar fora dele, a menos que sejam regras realmente universais para qualquer agente.
