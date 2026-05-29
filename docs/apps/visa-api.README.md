# App Visa API

App: `apps/visa-api`

Status: manter como produto/app de vistos, mas revisar a arquitetura e dominio antes de producao.

## Papel

`apps/visa-api` e uma aplicacao Vite/React para gerenciar informacoes de vistos, paises, requisitos e pesquisas assistidas por IA.

Dominios em discussao:

```txt
api.noro.guru
visa-api.noro.guru
```

Leitura atual:

- `api.noro.guru` deve ser a camada tecnica/API para vistos e futuras APIs.
- `visa-api.noro.guru` pode fazer sentido como landing/documentacao comercial do servico.
- `vistos.noro.guru` nao existe hoje e nao deve ser assumido como destino oficial.

## Stack

- Vite
- React 19
- TypeScript
- `@google/genai`
- services locais em `apps/visa-api/services`
- dependencia indireta de servicos em `@noro/lib`

## Estado Atual

O README antigo era generico de AI Studio e nao representava o estado real.

Arquivos relevantes:

- `App.tsx`
- `components/DataManager.tsx`
- `components/CountryDetail.tsx`
- `components/AIResearchAssistant.tsx`
- `services/visaApiService.ts`
- `services/geminiService.ts`
- `services/dataService.ts`

## Residuos E Riscos

| Tema | Estado |
| --- | --- |
| Appwrite | `services/appwriteService.ts` removido; nao retomar como alvo. |
| Supabase | `metadata.json` ainda descreve combinacao com Supabase. |
| Persistencia | Precisa alinhar com PostgreSQL/Drizzle. |
| Auth | Precisa alinhar com Logto se houver painel protegido. |
| README antigo | Substituido por ponteiro para esta documentacao. |

## Diretriz

Nao retomar Appwrite como alvo. O app deve seguir:

- PostgreSQL/Drizzle para persistencia oficial;
- Logto para auth, se o app tiver area administrativa;
- API propria em `api.noro.guru` se a base de vistos virar produto tecnico;
- possivel landing em `visa-api.noro.guru`, se o servico precisar de uma camada comercial publica;
- `docs/conceito/07_noro_supplier_api_roadmap.md` apenas como referencia de produto, nao como estado atual de codigo.

## Comandos

```bash
cd apps/visa-api
npm run dev
npm run build
npm run preview
```

## Proximos Passos

1. Definir se `visa-api.noro.guru` sera landing/documentacao comercial ou se a landing ficara em `noro.guru`.
2. Criar contrato de dados para paises/requisitos em PostgreSQL/Drizzle.
3. Revisar uso de Gemini e env vars necessarias.
