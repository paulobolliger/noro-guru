# STITCH-SETUP.md — Configuração inicial do projeto Stitch via MCP

> Execute este setup **uma única vez** por projeto Stitch.
> Após isso, os prompts dos arquivos `PROMPTS-*.md` funcionam sem repetir tokens.

---

## Passo 1 — Criar o projeto no Stitch

Instrução para o Claude Code (com MCP Stitch conectado):

```
Crie um novo projeto Stitch chamado "Noro Guru"
```

Anote o `projectId` retornado. Todos os próximos comandos usam esse ID.

---

## Passo 2 — Criar Design System: Core (Light)

Usado em: `app.noro.guru`

```
Crie um design system no projeto Stitch "Noro Guru" com as seguintes configurações:

displayName: "Noro Core — Light"
colorMode: DARK  (usar LIGHT)
headlineFont: MANROPE
bodyFont: PLUS_JAKARTA_SANS
labelFont: PLUS_JAKARTA_SANS
roundness: ROUND_EIGHT
customColor: "#342CA4"
colorVariant: FIDELITY
overridePrimaryColor: "#342CA4"
overrideSecondaryColor: "#1DD3C0"
overrideTertiaryColor: "#D4AF37"
overrideNeutralColor: "#1F2433"

designMd: (conteúdo abaixo)
```

**Conteúdo do `designMd` para o Core Light:**

```markdown
# Noro Guru — Design System Core (Light)

## Identidade
Produto: Sistema operacional para agências de turismo modernas.
Tagline: "O sistema operacional da agência moderna."

## Tema
- Modo: LIGHT (painel operacional de tenant)
- Fundo padrão: #FFFFFF (surface) ou #F6F7FB (surface_2)
- Texto principal: #1F2433
- Texto muted: rgba(31, 36, 51, 0.55)
- Border: #ECEEF3
- Border forte: #DFE2EA

## Cores
- Primária: #342CA4 (botões principais, item ativo na sidebar, links)
- Primária escura: #232452 (hover)
- Accent teal: #1DD3C0 (IA, destaques secundários, badges especiais)
- Gold: #D4AF37 (VIP, badges premium)
- Sucesso: #16A34A
- Aviso: #CA8A04
- Erro/Destrutivo: #E11D48
- Info: #2563EB

## Tipografia
- Display/Títulos: Manrope 700–800 (headings de página, números KPI)
- Corpo: Plus Jakarta Sans 400–500 (texto geral, labels, inputs)
- Mono: JetBrains Mono (IDs, códigos, tokens)

## Espaçamento e Raio
- Radius padrão: 8px (md), 12px (lg), 6px (sm)
- Padding de card: 24px
- Gap entre elementos: 16px ou 24px
- Altura de input/botão: 40px (padrão), 44px (primário)

## Sidebar
- Largura: 240px expandida / 56px colapsada
- Background: #FFFFFF com border-right 1px #ECEEF3
- Item ativo: bg #F0EFFF, borda esquerda 3px #342CA4, texto #342CA4 bold

## Topbar
- Altura: 56px
- Background: #FFFFFF, border-bottom 1px #ECEEF3

## Cards
- Background: #FFFFFF
- Border: 1px #ECEEF3
- Border-radius: 12px
- Shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)

## Botões
- Primário: bg #342CA4, texto branco, hover #232452
- Secundário: border 1px #ECEEF3, texto #1F2433, hover bg #F6F7FB
- Destrutivo: bg #E11D48, texto branco
- Ghost: sem fundo, texto #342CA4, hover bg #F0EFFF
- Accent IA: bg #1DD3C0, texto branco (apenas para ações de IA)

## Ícones
- Biblioteca: Lucide React
- Tamanho padrão: 16px (inline), 20px (botão), 24px (destaque)
- Cor padrão: herda do texto muted

## DataTable
- Header: bg #F6F7FB, texto #1F2433 bold 13px
- Linha: border-bottom 1px #ECEEF3, hover bg #F6F7FB
- Texto: Plus Jakarta Sans 14px #1F2433
- Badges de status: pill com background semântico suave

## Estados canônicos
- Loading: skeleton shimmer (cinza claro animado)
- Empty: ícone centralizado + título + subtítulo + botão opcional
- Error: banner vermelho topo + mensagem + botão retry
- Success toast: bottom-right, auto-dismiss 4s, máx 3 simultâneos
```

---

## Passo 3 — Criar Design System: Control (Dark)

Usado em: `admin.noro.guru`

```
Crie um design system no projeto Stitch "Noro Guru" com as seguintes configurações:

displayName: "Noro Control — Dark"
colorMode: DARK
headlineFont: MANROPE
bodyFont: PLUS_JAKARTA_SANS
roundness: ROUND_EIGHT
customColor: "#342CA4"
colorVariant: FIDELITY
overridePrimaryColor: "#342CA4"
overrideSecondaryColor: "#D4AF37"
overrideTertiaryColor: "#1DD3C0"

designMd: (conteúdo abaixo)
```

**Conteúdo do `designMd` para o Control Dark:**

```markdown
# Noro Guru — Design System Control (Dark)

## Contexto
Painel de administração da plataforma Noro. Acesso restrito a super_admins.
Visual "enterprise dark" — denso, confiável, orientado a dados.

## Tema
- Modo: DARK
- Fundo página: #0B1220 (noro_dark)
- Fundo sidebar/cards: #12152C (noro_dark_purple)
- Fundo inputs/células: #1a1d35
- Fundo secundário: #2B2E48 (noro_surface_dark)
- Border: rgba(255,255,255,0.08)
- Border forte: rgba(255,255,255,0.15)

## Cores
- Primária: #342CA4 (botões de ação principal)
- Accent gold: #D4AF37 (badge "Control", item ativo na sidebar, destaques admin)
- Accent teal: #1DD3C0 (impersonation, botões especiais, links de docs)
- Sucesso: #16A34A
- Aviso: #CA8A04
- Erro: #E11D48

## Texto
- Principal: #FFFFFF
- Secundário: #E0E3FF
- Muted: #B8C1E0
- Body: #D1D5F0

## Tipografia
- Display/Títulos: Manrope 700–800 (branco)
- Corpo: Plus Jakarta Sans 400–500 (#D1D5F0)
- Mono: JetBrains Mono (IDs, audit logs, timestamps, JSON)

## Sidebar
- Largura: 240px expandida / 56px colapsada
- Background: #12152C
- Border-right: 1px rgba(255,255,255,0.08)
- Item ativo: bg rgba(212,175,55,0.15), borda esquerda 3px #D4AF37, texto #D4AF37

## Topbar
- Altura: 56px
- Background: #12152C
- Border-bottom: 1px rgba(255,255,255,0.08)

## Cards
- Background: #12152C
- Border: 1px rgba(255,255,255,0.08)
- Border-radius: 12px
- Shadow: 0 4px 16px rgba(0,0,0,0.4)

## DataTable
- Header: bg #1a1d35, texto muted 13px bold
- Linha: border-bottom 1px rgba(255,255,255,0.05), hover bg rgba(255,255,255,0.03)
- Linha crítica (delete/suspend): bg rgba(225,29,72,0.06)

## Botões
- Primário: bg #342CA4, texto branco
- Admin especial (impersonation): bg #1DD3C0, texto #0B1220
- Destrutivo: bg #E11D48, texto branco
- Ghost dark: border rgba(255,255,255,0.15), texto branco, hover bg rgba(255,255,255,0.05)

## Badges de Status (todos com pill style)
- Ativo/Operacional: bg rgba(22,163,74,0.15), texto #4ADE80
- Suspeso/Aviso: bg rgba(202,138,4,0.15), texto #FCD34D
- Erro/Outage: bg rgba(225,29,72,0.15), texto #F87171
- Muted/Cancelado: bg rgba(255,255,255,0.06), texto #B8C1E0

## Audit Log
- Timestamps em JetBrains Mono, cor #1DD3C0
- Eventos críticos: texto em vermelho muted
- JSON viewer: syntax highlight estilo Monokai dark
```

---

## Passo 4 — Criar Design System: Web (Dark Marketing)

Usado em: `noro.guru`

```
Crie um design system no projeto Stitch "Noro Guru" com as seguintes configurações:

displayName: "Noro Web — Dark Marketing"
colorMode: DARK
headlineFont: MANROPE
bodyFont: PLUS_JAKARTA_SANS
roundness: ROUND_TWELVE
customColor: "#342CA4"
colorVariant: VIBRANT
overridePrimaryColor: "#342CA4"
overrideSecondaryColor: "#1DD3C0"
overrideTertiaryColor: "#D4AF37"

designMd: (conteúdo abaixo)
```

**Conteúdo do `designMd` para o Web Dark:**

```markdown
# Noro Guru — Design System Web (Dark Marketing)

## Contexto
Site público de marketing. Estilo "produto SaaS enterprise moderno".
Deve impressionar, converter e transmitir confiança.

## Tema
- Modo: DARK
- Fundo base: #0B1220
- Fundo seções alternadas: #12152C
- Fundo cards: #12152C ou #1a1d35
- Border: rgba(255,255,255,0.08)

## Efeitos visuais
- Hero: gradiente radial de #12152C para #0B1220 + orbs de glow (#342CA4 e #1DD3C0) em cantos
- Grade sutil: linhas finas rgba(255,255,255,0.03) em grid de 40px
- Cards hover: leve elevação + borda com glow da cor primária
- Glow accent: box-shadow com cor #342CA4 ou #1DD3C0 em elementos de destaque

## Cores
- Primária: #342CA4 (CTAs, links, destaques)
- Accent: #1DD3C0 (badges, links secundários, ícones de destaque)
- Gold: #D4AF37 (elementos premium)
- Sucesso: #16A34A
- Texto principal: #FFFFFF
- Texto secundário: #E0E3FF
- Texto muted: #B8C1E0
- Texto body: #D1D5F0

## Tipografia
- H1: Manrope 800, 56–72px, branco
- H2: Manrope 700, 40–48px, branco
- H3: Manrope 700, 28–32px, branco
- Body: Plus Jakarta Sans 16–18px, #D1D5F0, line-height 1.75
- Labels/muted: Plus Jakarta Sans 13–14px, #B8C1E0

## Header (Navbar)
- Posição: fixed, backdrop-blur 20px
- Estado inicial: bg rgba(11,18,32,0.7)
- Estado scroll: bg #0B1220 sólido + border-bottom rgba(255,255,255,0.08)
- Links: #E0E3FF, hover branco

## Botões
- Primário: bg #342CA4, hover #3B2CA4, texto branco, border-radius 8px, padding 12px 24px
- Ghost light: border rgba(255,255,255,0.3), texto branco, hover bg rgba(255,255,255,0.08)
- Ghost accent: border #1DD3C0, texto #1DD3C0, hover bg rgba(29,211,192,0.1)
- CTA grande: mesmas cores, padding 16px 32px, font 18px

## Cards
- Background: #12152C
- Border: 1px rgba(255,255,255,0.08)
- Border-radius: 16px
- Hover: border rgba(52,44,164,0.6) + shadow glow

## Seções
- Padding vertical de seção: 80px–120px
- Max-width de conteúdo: 1200px (layout), 760px (texto/documentação)
- Padding horizontal: 80px desktop, 24px mobile

## Footer
- Background: #12152C
- Texto: #B8C1E0
- Links: hover branco
- Border-top: 1px rgba(255,255,255,0.08)
```

---

## Passo 5 — Criar Design System: API/Developer (Dark Dev)

Usado em: `visa.noro.guru` + `api.noro.guru`

```
Crie um design system no projeto Stitch "Noro Guru" com as seguintes configurações:

displayName: "Noro API — Dark Developer"
colorMode: DARK
headlineFont: MANROPE
bodyFont: PLUS_JAKARTA_SANS
roundness: ROUND_EIGHT
customColor: "#1DD3C0"
colorVariant: TONAL_SPOT
overridePrimaryColor: "#342CA4"
overrideSecondaryColor: "#1DD3C0"
overrideTertiaryColor: "#F59E0B"

designMd: (conteúdo abaixo)
```

**Conteúdo do `designMd` para API Dark:**

```markdown
# Noro Guru — Design System API (Dark Developer)

## Contexto
Portal de desenvolvedor e landing da Visa API. "Developer-first".
Estilo técnico, preciso, com muito código em destaque.

## Tema
- Modo: DARK (igual ao Web, mas com accent em teal no lugar de roxo)
- Fundo: #0B1220
- Fundo sidebar docs: #12152C
- Fundo blocos de código: #1a1d35
- Accent principal: #1DD3C0 (links docs, item ativo na sidebar, badges de endpoint)

## Cores
- Primária ação: #342CA4 (botões de CTA)
- Accent docs: #1DD3C0 (links, item ativo, highlights)
- Endpoint GET: #16A34A (verde)
- Endpoint POST: #2563EB (azul)
- Endpoint DELETE: #E11D48 (vermelho)
- Endpoint PATCH: #CA8A04 (amarelo)
- Aviso/deprecated: #CA8A04
- Texto código: #D1D5F0

## Tipografia
- Títulos: Manrope 700, branco
- Body docs: Plus Jakarta Sans 15px, #D1D5F0, line-height 1.75
- Código inline: JetBrains Mono 14px, #1DD3C0
- Blocos de código: JetBrains Mono 13px, fundo #1a1d35

## Syntax Highlight (Monokai Dark)
- Keyword/chave JSON: #1DD3C0
- String: #F59E0B
- Number/boolean: #A78BFA
- Comentário: #B8C1E0 com opacidade 60%
- Operador: #E0E3FF

## Sidebar de Docs
- Largura: 280px
- Background: #12152C
- Border-right: 1px rgba(255,255,255,0.08)
- Item ativo: bg rgba(29,211,192,0.1), borda esquerda 2px #1DD3C0, texto #1DD3C0
- Label de seção: caps 11px #B8C1E0

## Blocos de código
- Background: #1a1d35
- Border: 1px rgba(255,255,255,0.08)
- Border-radius: 8px
- Padding: 20px
- Header com tabs de linguagem (cURL/JS/Python): bg #12152C, border-bottom rgba(255,255,255,0.08)
- Botão "Copiar": ghost pequeno, top-right

## Callouts
- Info: bg rgba(37,99,235,0.1), border-left 4px #2563EB
- Warning: bg rgba(202,138,4,0.1), border-left 4px #CA8A04
- Success: bg rgba(22,163,74,0.1), border-left 4px #16A34A

## Badges de método HTTP (pill)
- GET: bg rgba(22,163,74,0.15), texto #4ADE80
- POST: bg rgba(37,99,235,0.15), texto #60A5FA
- DELETE: bg rgba(225,29,72,0.15), texto #F87171
- PATCH: bg rgba(202,138,4,0.15), texto #FCD34D
```

---

## Passo 6 — Aplicar Design System por tela

Após gerar cada tela com `generate_screen_from_text`, aplicar o design system correto:

```
# Para telas do Core (Light):
apply_design_system → assetId do "Noro Core — Light"

# Para telas do Control (Dark):
apply_design_system → assetId do "Noro Control — Dark"

# Para telas do Web (Dark Marketing):
apply_design_system → assetId do "Noro Web — Dark Marketing"

# Para telas da Visa/API (Dark Developer):
apply_design_system → assetId do "Noro API — Dark Developer"
```

---

## Resumo do fluxo completo

```
1. create_project → "Noro Guru" → anota projectId

2. create_design_system (4x):
   → "Noro Core — Light"       (app.noro.guru)
   → "Noro Control — Dark"     (admin.noro.guru)
   → "Noro Web — Dark"         (noro.guru)
   → "Noro API — Dark Dev"     (visa + api)
   
   → anota os 4 assetIds

3. Por tela (usando PROMPTS-*.md):
   generate_screen_from_text → projectId + prompt da tela
   → apply_design_system → projectId + screenId + assetId correto

4. Para editar uma tela existente:
   edit_screens → projectId + screenId + instrução de ajuste
```

---

## Nota sobre o campo `designMd`

O `designMd` é passado uma vez na criação/atualização do design system e funciona como **contexto permanente** para todas as telas que usam aquele design system. Os prompts dos `PROMPTS-*.md` **não precisam repetir cores, fontes ou espaçamentos** — eles descrevem apenas o conteúdo e comportamento da tela.

---

*Documento gerado em: 2026-05-24 · Versão: 1.0*
