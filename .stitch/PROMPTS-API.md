# PROMPTS-API.md — Prompts Stitch para visa.noro.guru + api.noro.guru

> Apps: `visa.noro.guru` + `api.noro.guru` · Tema: **Dark** developer-first
> Tokens de design, paleta e tipografia: ver [DESIGN.md](./DESIGN.md)
> Especificação completa: ver [DESIGN-API.md](./DESIGN-API.md)

---

## SHELL — visa.noro.guru

### Header (Visa)

**Prompt Stitch:**
Crie o Header do site visa.noro.guru. Tema dark. Background #0B1220 com backdrop-blur no scroll. Altura 64px.

Logo Noro Guru branco + badge "Visa API" em teal (#1DD3C0), border-radius full, padding 4px 10px, font 12px bold.

Nav central: "Funcionalidades" | "Preços" | "Documentação" | "FAQ" | "Changelog" — Plus Jakarta Sans 15px #E0E3FF, hover branco.

Direita: link "Ver Docs" muted + botão "Começar grátis" bg #342CA4 texto branco border-radius 8px padding 10px 20px.

---

### Header (api.noro.guru — Developer Portal)

**Prompt Stitch:**
Crie o Header do developer portal api.noro.guru. Tema dark. Background #12152C, border-bottom 1px rgba(255,255,255,0.08), altura 56px.

Esquerda: logo Noro Guru branco + badge "Developers" em #1DD3C0.

Nav: "Docs" | "Referência" | "Playground" | "SDKs" | "Changelog" | "Status" — 14px, espaçados.

Campo de busca semântica (centro): input dark 280px, bg #1a1d35, placeholder "Buscar na documentação... (Ctrl+K)", ícone lupa.

Dropdown de versão da API: pill "v1 ▾" bg #2B2E48, border-radius full.

Direita (não autenticado): "Entrar" link + botão "Criar Conta" #342CA4.
Direita (autenticado): badge plano "Free" + "Meu Painel" link + avatar.

---

### Sidebar de Documentação

**Prompt Stitch:**
Crie a sidebar de documentação do api.noro.guru. Dark. Largura 280px, posição fixa, altura 100vh, bg #12152C, border-right 1px rgba(255,255,255,0.08), overflow-y scroll.

Estrutura hierárquica (grupos colapsáveis):

Seções com label em caps 11px muted e itens com padding 8px 16px, border-radius 6px:

PRIMEIROS PASSOS:
- Introdução
- ← Quickstart (badge "5 min" pill verde)
- Autenticação
- Erros & Códigos
- Versionamento

GUIAS:
- Consulta de Vistos
- Webhooks
- Pagination
- Rate Limits
- Ambientes

REFERÊNCIA:
- Vistos (endpoint badge "GET" verde)
- Países (badge "GET")
- Webhooks (badges "GET" "POST" "DELETE")
- Quotas (badge "GET")

SDKs & FERRAMENTAS:
- SDK Node.js (badge "npm" âmbar)
- SDK Python (badge "pip" âmbar)
- Postman Collection
- OpenAPI Spec

SUPORTE:
- FAQ
- Status
- Contato

Item ativo: bg rgba(29,211,192,0.1), borda esquerda 2px solid #1DD3C0, texto #1DD3C0.
Hover: bg rgba(255,255,255,0.05).

---

## visa.noro.guru

### Home — `/` (visa.noro.guru)

**Prompt Stitch:**
Crie a homepage do visa.noro.guru. Tema dark completo. Background #0B1220. Header + Footer dark.

**Hero Section:**
Background com efeito de grade técnica sutil (linhas finas rgba(255,255,255,0.04) em grid 40px) + orbs de glow (#342CA4 e #1DD3C0) nos cantos superiores.

Conteúdo centralizado, padding top 140px, max-width 900px:
- Badge pill: "API de Vistos · 150+ países cobertos" — bg rgba(29,211,192,0.1), borda rgba(29,211,192,0.3), ícone globe, texto #1DD3C0
- H1 (Manrope 800, 60px, branco, line-height 1.1): "Consulte requisitos de" (branco) + " visto em segundos." (gradiente #1DD3C0 → #342CA4)
- Subtítulo (18px, #B8C1E0): "API REST para agências, plataformas de turismo e integradores. Dados em tempo real. 150+ países."
- CTAs: botão "Começar grátis" #342CA4 + botão ghost "Ver documentação" borda #1DD3C0 texto #1DD3C0
- Abaixo dos CTAs: código de exemplo em card dark (bg #12152C, border-radius 12px, font mono):

```text
GET /v1/visa/requirements?origin=BR&destination=PT

{
  "visa_required": false,
  "visa_type": "free",
  "stay_limit_days": 90,
  "documents_required": ["Passaporte válido"],
  "updated_at": "2026-05-20T10:00:00Z"
}
```

Syntax highlight: keyword em #1DD3C0, strings em #F59E0B, numbers em #A78BFA.

**Seção Números:**
Background #12152C. Row centralizado: 3 stats grandes — "150+ países" | "99.9% uptime" | "< 200ms latência" — Manrope 700, 48px, branco, dividers verticais muted.

**Seção Features:**
Grid 3x2 de cards dark (bg #1a1d35, border rgba(255,255,255,0.08), border-radius 12px, padding 24px):
- Ícone 40px em círculo bg rgba(29,211,192,0.1) + nome em branco bold + descrição muted 14px
- Features: Checklist de Requisitos / Dados em Tempo Real / Webhooks de Atualização / Multi-idioma / Sandbox Gratuito / SLA Garantido

**Seção Como Funciona:**
Background #0B1220. 3 steps com número grande muted (1, 2, 3):
1. "Crie sua conta" — snippet: obtenha API Key
2. "Autentique sua requisição" — snippet com header Authorization
3. "Consulte qualquer visto" — snippet do request
Cada step tem tabs: cURL | JavaScript | Python.

---

### Pricing — `/pricing` (visa.noro.guru)

**Prompt Stitch:**
Crie a página de preços do visa.noro.guru. Tema dark. Background #0B1220. Header + Footer.

Hero: "Preços simples. Escale sem surpresas." Manrope 700 48px branco. Toggle Mensal/Anual com pill indicator.

Grid de planos (4 cards):

Card padrão dark (bg #12152C, border rgba(255,255,255,0.08), border-radius 16px, padding 32px):
- Nome do plano (bold 20px branco)
- Preço grande (Manrope 700 40px branco) + "/mês" + "equivale a R$X por consulta"
- Lista com ✓ items em #B8C1E0: consultas incluídas, rate limit, suporte, SLA, extras
- Botão CTA full-width

Card "Starter" destaque (borda #1DD3C0 2px + badge "Mais popular" pill teal no topo):
Leve glow teal atrás do card.

Planos: Free (1k consultas/mês, grátis) | Starter R$197/mês | Professional R$597/mês | Enterprise.

Tabela comparativa dark abaixo: heading coluna muted + checks + X + valores específicos. Rows alternam rgba(255,255,255,0.02).

FAQ accordion dark: 5 perguntas sobre billing, sandbox, overages.

---

### FAQ — `/faq` (visa.noro.guru)

**Prompt Stitch:**
Crie a página de FAQ do visa.noro.guru. Dark. Header + Footer.

Hero mínimo: "Perguntas frequentes" Manrope 700 40px. Busca de perguntas (input dark).

Categorias como tabs horizontais: Sobre a API | Técnico | Cobertura | Billing | Suporte.

Accordion dark por categoria (max-width 760px centralizado):
Item fechado: bg #12152C, borda rgba(255,255,255,0.08), padding 20px 24px, pergunta bold branco, ícone chevron-down.
Item aberto: mesma estética, resposta em #B8C1E0 com padding extra, chevron-up. Animação suave de expand.

---

## api.noro.guru — Developer Portal

### Dashboard do Desenvolvedor — `/dashboard`

**Prompt Stitch:**
Crie o Dashboard do developer portal api.noro.guru. Tema dark. Header dark + sidebar de docs colapsada (ou nav horizontal). Sem sidebar de docs completa nesta tela.

Background #0B1220. Layout: max-width 1200px, padding 40px 80px.

PageHeader: "Meu Painel" (Manrope 700 28px branco) + badge plano "Starter" pill teal + badge "Sandbox mode" pill amarelo se em sandbox.

Row de KPIs (4 cards bg #12152C, border, border-radius 12px):
- "Consultas este mês" — barra de progresso: X / 10.000 (% e cores: verde < 70%, amarelo 70-90%, vermelho > 90%)
- "Consultas restantes" — número grande branco
- "API Keys ativas" — contagem + botão "Gerenciar"
- "Plano atual" — nome + "Renovação em X dias" muted

Gráfico (card dark, border-radius 12px):
"Consultas por dia — últimos 30 dias". Gráfico de área: linha #1DD3C0, área fill rgba(29,211,192,0.1), grid muted, eixos muted.

Seção "Minhas API Keys" (tabela dark):
Colunas: Nome | Prefixo (ex: noro_***abc, mono font) | Ambiente (badge: Produção verde / Sandbox amarelo) | Criada em | Último uso | Ações (Copiar / Revogar).
Botão "Criar nova API Key" no header da seção.

Seção "Webhooks" (lista compacta):
URL truncada + eventos inscritos (chips) + status (badge) + "Último: 2min atrás". Botão "Novo webhook".

---

### Playground — `/playground`

**Prompt Stitch:**
Crie a página Playground do api.noro.guru. Tema dark. Header dark sem sidebar de docs.

Background #0B1220. Layout 2 colunas (50/50, sem gap, full height sem scroll de página).

Coluna esquerda — Request builder (bg #12152C, border-right rgba(255,255,255,0.08)):
Header: "Playground" (Manrope 700 20px branco) + select ambiente (pill: "Sandbox ▾" / "Produção ▾").
Padding 24px.

Select de endpoint (estilo code, bg #1a1d35, border, mono font): dropdown com lista de endpoints agrupados.
Exibe: badge método (GET verde pill) + path (mono branco).

Parâmetros: formulário gerado dinamicamente por endpoint. Labels em muted 13px, inputs dark mono font.
- Query params: key-value rows com add/remove
- Headers: Authorization (pré-preenchido com API Key do dashboard)
- Body (se POST): editor JSON com syntax highlight e line numbers

Botão "Enviar requisição" full-width bg #342CA4 com ícone Play.

Botão "Copiar como cURL" ghost abaixo.

Coluna direita — Response viewer (bg #0B1220):
Header: badge status HTTP (200 bg verde / 400 bg vermelho / 429 bg amarelo) + "200ms" muted + "application/json" muted.

Corpo: JSON viewer com syntax highlight (Monokai dark), collapsible objects/arrays (ícone ▶/▼), botão "Copiar" no canto.

Tabs: "Response" (ativa) | "Headers de resposta".

Estado vazio: ilustração muted + "Configure uma requisição e clique em Enviar" em muted.
Estado loading: spinner centralizado + "Enviando requisição...".

---

### Documentação — Layout Base

**Prompt Stitch:**
Crie o layout base das páginas de documentação do api.noro.guru. Tema dark. Header dark.

Layout 3 colunas full-height:
- Sidebar esquerda (280px fixo): componente sidebar de docs (ver prompt de sidebar acima)
- Área de conteúdo (flex 1, max-width 760px, padding 40px 48px, overflow-y scroll):
  - Breadcrumb muted: "Docs > Primeiros Passos > Quickstart"
  - Conteúdo em markdown renderizado dark:
    - H1: Manrope 700 32px branco, border-bottom 1px rgba(255,255,255,0.08), margin-bottom 24px
    - H2: Manrope 600 24px branco, margin-top 40px
    - H3: 18px branco
    - Body: Plus Jakarta Sans 15px #D1D5F0, line-height 1.75
    - Links: #1DD3C0, hover underline
    - Blocos de código: bg #1a1d35, border-radius 8px, mono 14px, padding 20px, botão "Copiar" top-right, syntax highlight
    - Tabs de código: "cURL" | "JavaScript" | "Python" — tabs dark acima do bloco
    - Tabelas: header bg #1a1d35, rows alternadas, borders muted
    - Callout info (bg rgba(37,99,235,0.1), border-left 4px #2563EB): dica, nota
    - Callout warning (bg rgba(202,138,4,0.1), border-left 4px #CA8A04): atenção
  - Navegação de página no footer: "← Anterior" + "Próximo →" links
- TOC direita (240px fixo, desktop): "Nesta página" + lista de H2/H3 clicáveis, item ativo em #1DD3C0

---

### Referência de API — Layout

**Prompt Stitch:**
Crie o layout de Referência de API do api.noro.guru. Tema dark. Header dark + sidebar de docs.

Layout especial 3 colunas dentro da área de conteúdo (depois da sidebar de docs):
- Esquerda (55%): descrição do endpoint
- Direita (45%): playground inline + response

Para o endpoint `GET /v1/visa/requirements`:

Coluna esquerda:
- Badge método: "GET" pill verde + path "/v1/visa/requirements" em mono branco grande
- Descrição curta em #B8C1E0
- Seção "Query Parameters" (tabela dark):
  | Parâmetro | Tipo | Obrigatório | Descrição |
  Linhas: origin_country (string, sim, "Código ISO 3166-1 alpha-2 do país de origem") | destination_country | passport_type | travel_purpose
- Seção "Responses": tabs "200 Success" | "400 Bad Request" | "401 Unauthorized" | "429 Rate Limited"
- Por tab: schema do response + descrição dos campos (tabela)

Coluna direita (sticky no scroll):
Card dark bg #12152C:
- Select ambiente (Sandbox/Prod)
- Campos de parâmetros (pré-preenchidos com exemplo)
- Botão "Testar endpoint" #342CA4
- Resultado: JSON com syntax highlight, badge status, latência

---

### Quickstart — `/quickstart`

**Prompt Stitch:**
Crie a página Quickstart do api.noro.guru. Tema dark. Header + sidebar de docs + TOC.

H1: "Quickstart — sua primeira consulta em 5 minutos"

Step 1 — "Crie sua conta":
Texto breve. Callout: "Já tem conta? Pule para o passo 2."
Botão "Criar conta gratuita →" #342CA4.

Step 2 — "Obtenha sua API Key":
Texto. Screenshot do dashboard mostrando a API Key (placeholder dark com dados fictícios). Instrução de copiar a key.

Step 3 — "Faça sua primeira requisição":
Texto. Bloco de código com tabs: cURL | JavaScript | Python | PHP.

cURL:
```bash
curl -X GET "https://api.noro.guru/v1/visa/requirements?origin=BR&destination=PT" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

Response esperada (bloco separado, label "Response"):
```json
{
  "visa_required": false,
  "visa_type": "free",
  "stay_limit_days": 90,
  "documents_required": ["Passaporte válido"],
  "fee": null,
  "updated_at": "2026-05-20T10:00:00Z"
}
```

Callout verde "🎉 Funcionou? Parabéns! Você fez sua primeira consulta."

Step 4 — "Próximos passos":
Grid 3 cards de links: "Ver referência completa" | "Configurar webhooks" | "Entender rate limits".

---

### Cadastro no Developer Portal — `/cadastro`

**Prompt Stitch:**
Crie a tela de cadastro do api.noro.guru. Dark. Sem sidebar de docs. Header mínimo.

Background #0B1220. Card centralizado max-width 460px, bg #12152C, border, border-radius 16px, padding 48px.

Logo + "Criar conta de desenvolvedor".

Formulário dark:
- Nome completo
- Email
- Senha (com força visual: barra colorida abaixo do campo — cinza > amarelo > verde)
- "Nome da empresa / projeto"
- "Tipo de uso" (select: Agência de Turismo / Plataforma OTA / App Mobile / Integração Interna / Outro)
- Checkbox "Concordo com os Termos de API" com link em #1DD3C0

Botão "Criar conta" full-width #342CA4.
Divider + "ou entrar com Google".
Link "Já tem conta? Entrar →" em #1DD3C0.

Após submit: alerta de confirmação de email (substitui o form): ícone envelope animado + "Confirme seu e-mail" + instrução.

---

*Documento gerado em: 2026-05-24 · Versão: 1.0*
*Para especificação completa, consulte [DESIGN-API.md](./DESIGN-API.md)*
