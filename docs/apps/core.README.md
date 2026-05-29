# App Core

App: `apps/core`

Status: portal tenant oficial, ainda parcialmente legado no runtime. Revisar rotas/actions antes de assumir cada modulo como pronto.

## Papel

`apps/core` representa o portal de acesso de cada tenant/agencia. Ele deve operar em `app.noro.guru` e concentrar a experiencia operacional do cliente NORO: CRM, clientes, leads, orcamentos, pedidos, financeiro, marketing, conteudo, custos, relatorios, site e configuracoes.

Dominio alvo oficial:

```txt
app.noro.guru
```

Host legado:

```txt
core.noro.guru
```

## Stack

- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind
- `@noro/lib`
- providers legados de pagamento em partes do app

## Estado Atual

`CORE-CONTEXT.md` e `CORE-IMPLEMENTATION-COMPLETE.md` descrevem uma fase antiga e citam Supabase como base. Eles nao devem ser usados como fonte atual sem revisao.

O codigo possui rotas e actions operacionais, mas tambem possui endpoints legados desativados com status 410 e mensagens neutras de legado.

Areas visiveis:

- dashboard;
- clientes;
- leads;
- comunicacao;
- configuracoes;
- conteudo;
- custos;
- financeiro;
- marketing;
- orcamentos;
- pedidos;
- relatorios;
- site;
- tarefas.

## Residuos E Riscos

| Tema | Estado |
| --- | --- |
| Appwrite | Residuos ativos removidos; nao retomar como alvo. |
| Supabase | Documentos antigos tratam Supabase como base ativa. |
| eRede | Webhooks e provider legado ainda aparecem em pedidos. |
| Status do app | Nao assumir "production-ready" sem nova validacao. |

## Diretriz

Antes de reativar ou expandir o Core:

- manter `apps/core` separado de `apps/control`;
- tratar `app.noro.guru` como dominio oficial do portal tenant;
- manter Appwrite fora da arvore ativa;
- alinhar auth com Logto;
- alinhar dados com PostgreSQL/Drizzle;
- alinhar financeiro/billing com Asaas.

Referencias obrigatorias:

- `docs/architecture/current-state.md`
- `docs/architecture/data-auth-transition.md`
- `docs/architecture/billing-asaas-migration-plan.md`

## Comandos

```bash
cd apps/core
npm run dev
npm run build
npm run start
```

Porta padrao:

```txt
3004
```

## Proximos Passos

1. Arquivar `CORE-IMPLEMENTATION-COMPLETE.md`.
2. Remover ou substituir `CORE-CONTEXT.md` por esta documentacao.
3. Mapear rotas realmente ativas versus rotas desativadas.
4. Manter a limpeza Appwrite validada antes de expandir features.
5. Manter fronteira clara com `apps/control`: Core atende tenants; Control administra a plataforma.
