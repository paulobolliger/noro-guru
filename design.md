# Design System Specification

## 1. Design Tokens

Os tokens abaixo representam a fundação visual do ecossistema NORO GURU, unificando as propriedades encontradas em `theme.css`, `globals.css` e nas configurações do Tailwind (`tailwind.config.js/ts`).

### 1.1 Cores (Color Palette)

**Brand / Primary**
- `--color-noro-primary` / `noro-primary`: `#342CA4` (Web/Marketing base)
- `--color-noro-primary-deep`: `#3B2CA4`
- `--color-noro-primary-dark`: `#23214F` / `#232452` (Core/App base)

**Accent & Highlights**
- `--color-noro-accent` / `noro-accent`: `#1DD3C0` (Turquoise)
- `--color-noro-gold` / `noro-gold`: `#D4AF37`
- `--color-noro-gold-hover`: `#E5C04B`

**Neutrals & Backgrounds (Light/App Theme)**
- `--surface`: `#FFFFFF`
- `--surface-2`: `#F6F7FB` (Backgrounds de seções/sidebars)
- `--fg`: `#1F2433` (Texto base em light mode)
- `--border`: `#ECEEF3`
- `--border-strong`: `#DFE2EA`
- `--muted`: `rgba(31, 36, 51, 0.55)`

**Neutrals & Backgrounds (Dark/Web Theme)**
- `--color-noro-dark`: `#0B1220` (Background escuro padrão)
- `--color-noro-dark-purple`: `#12152C`
- `--color-noro-surface-dark`: `#2B2E48`
- `--color-noro-gray-future`: `#2E2E3A`
- `--color-noro-light`: `#F8F9FB`
- `--color-noro-gray-accent`: `#E2E8F0`

**Text Colors**
- `--color-noro-text-primary`: `#FFFFFF` (Dark mode headers)
- `--color-noro-text-secondary`: `#E0E3FF`
- `--color-noro-text-muted`: `#B8C1E0`
- `--color-noro-text-body`: `#D1D5F0` (Textos longos em dark mode)

**Semantic / Feedback**
- `Success`: `bg-green-600`
- `Warning`: `bg-yellow-600`
- `Error / Destructive`: `bg-rose-600` / `text-destructive`
- `Info`: `bg-blue-600`

### 1.2 Tipografia (Typography)

As fontes são configuradas via CSS Variables nativas do `next/font`.
- **Sans-serif (Base/UI):** `Plus Jakarta Sans` (`var(--font-sans)`) - Pesos: 400, 500, 600, 700, 800.
- **Display / Serif:** `Fraunces` (`var(--font-display)`) - Utilizado em títulos impactantes. Eixos variáveis (`opsz`, `WONK`).
- **Monospace:** `JetBrains Mono` (`var(--font-mono)`) - Pesos: 400, 500, 600, 700. Para códigos e dados técnicos.

### 1.3 Bordas e Sombras (Borders & Shadows)

**Espaçamento (Spacing Scale / Tailwind Defaults)**
- Valores numéricos seguem a escala base de `0.25rem` (4px) do Tailwind.
- `p-2` / `m-2`: `0.5rem` (8px)
- `p-4` / `m-4`: `1rem` (16px) - Usado em containers pequenos.
- `p-6` / `m-6`: `1.5rem` (24px) - Utilizado como padding base padrão em cards e containers maiores.
- Content main padding: `24px 28px` (Hardcoded em `AdminLayoutClient`).

**Border Radius (`border-radius`)**
- `sm`: `6px`
- `md`: `8px`
- `lg`: `10px`
- Componentes Web (Cards): `1rem` (16px)

**Box Shadows (`box-shadow`)**
- `--shadow-noro-base`: `0 2px 8px rgba(0, 0, 0, 0.25)`
- `--shadow-noro-glow-gold`: `0 0 10px #D4AF37`
- `--shadow-noro-glow-turquoise`: `0 0 15px rgba(29, 211, 192, 0.3)`

---

## 2. Elementos Base & Estilos Globais

- **Resets:** Margens e paddings zerados globalmente em `html, body`.
- **Scrollbar:** Customizada globalmente. No tema escuro: track `#12152C`, thumb `#2B2E48`. No tema claro: track `transparent` ou `#f1f5f9`, thumb `rgba(255,255,255,0.15)` ou `#dfe2ea`.
- **Focus Rings:** Elementos interativos (`*:focus-visible`) recebem `outline: 2px solid var(--color-noro-accent); outline-offset: 2px; border-radius: 4px;` para acessibilidade.
- **Animações (Utilitários):**
  - `.animate-fade-in-down` / `.animate-fade-in-up` para transições de carregamento.
  - `.animate-pulse-slow`, `.animate-float`, `.animate-shimmer` para estados de loading e microinterações.
  - `.animate-bounce-subtle` para CTAs na Web.

---

## 3. Catálogo de Componentes (Component Library)

Os componentes base estão no pacote `@noro/ui` implementados utilizando Shadcn UI, Radix UI e Tailwind CSS.

### 3.1 Button (`Button`)
- **Propósito:** Disparo de ações.
- **Variantes (`variant`):**
  - `default`: Fundo gradiente (`from-indigo-600 to-purple-600`) com texto branco. Hover sutil.
  - `destructive`: Fundo `#e11d48` (`rose-600`).
  - `outline`: Borda translúcida, fundo transparente (`bg-white/5`), texto claro.
  - `secondary`: Fundo semitransparente (`bg-white/10`).
  - `ghost`: Fundo transparente, fundo semitransparente no hover.
  - `link`: Texto sublinhado.
- **Tamanhos (`size`):** `default` (h-10), `sm` (h-9), `lg` (h-11), `icon` (h-10 w-10).
- **Props Base:** `variant`, `size`, `asChild`, `disabled`, `className`.
- **Comportamento:** `active:scale-[0.98]` fornece feedback táctil no clique; `disabled:opacity-50` desativa ponteiro.

### 3.2 Input (`Input`) & Textarea (`Textarea`)
- **Propósito:** Entrada de dados textuais.
- **Estilos:** Fundo levemente visível (`bg-white/5` ou `bg-background`), borda definida (`border-white/10` ou `border-input`), altura fixa (`h-10` ou `min-h-[80px]`).
- **Estados:** `focus-visible:ring-2`, `disabled:opacity-50`, `disabled:cursor-not-allowed`.
- **Props Base:** Ref-forwarding padrão HTML, `type` (para Input), `className`.

### 3.3 Card (`Card`)
- **Propósito:** Container semântico para agrupar informações relacionadas (ex: dados de usuários, gráficos de dashboard).
- **Composição:** `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.
- **Comportamento na Web:** Transições de hover via classe `.card-noro:hover` que adiciona `transform: translateY(-4px)` e `box-shadow: var(--shadow-noro-glow-turquoise)`.

### 3.4 Badge (`Badge`)
- **Propósito:** Indicação visual de status, tags ou categorias.
- **Variantes (`variant`):** `default`, `secondary`, `destructive`, `outline`, `success`, `warning`, `info`.
- **Estilos Base:** `rounded-md`, `text-xs`, `font-semibold`, `px-2.5`, `py-0.5`.

### 3.5 Avatar (`Avatar`)
- **Propósito:** Exibição da imagem de perfil de usuários.
- **Composição:** `Avatar` (Root circular `h-10 w-10`), `AvatarImage` (img render), `AvatarFallback` (placeholder renderizado caso falhe a imagem).

### 3.6 Formulários (`Form`, `FormField`, `FormItem`, `FormLabel`, `FormMessage`)
- **Propósito:** Infraestrutura de validação conectada via `react-hook-form`.
- **Comportamento Esperado:** Propagação de IDs de acessibilidade (`aria-describedby`, `aria-invalid`), exibição automática de mensagens de erro (`text-destructive`).

### 3.7 Tabela (`Table`)
- **Propósito:** Exibição estruturada de dados densos (ex: leads, clientes).
- **Composição:** `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`.
- **Estilos:** Scroll horizontal automático (`overflow-auto`), bordas inferiores (`border-b`), hover no row (`hover:bg-muted/50`).

### Outros Componentes Identificados
- `Alert`, `Calendar` / `DatePickerWithRange`, `Checkbox`, `Dialog`, `Label`, `Popover`, `Select`, `Separator`, `Sheet`, `Skeleton`, `Switch`, `Tabs`, `Toast` / `use-toast`.

---

## 4. Padrões de Layout e Grids

**Control Plane / Core App (`AdminLayoutClient`)**
- Estrutura baseada em Flexbox em tela cheia: `min-h-screen flex bg-surface-2 text-fg`.
- **Sidebar:** Fixa ou colapsável (largura controlada condicionalmente), com barra de rolagem customizada invisível (`.sidebar-scroll`).
- **Main Content:** Coluna flexível `flex-1 flex flex-col overflow-hidden` que contém um `TopBar` (Header) e um elemento `main` (`overflow-y-auto` com padding interno padronizado: `padding: '24px 28px'`).

**Web / Public App (`RootLayout`)**
- Estrutura: `relative flex flex-col min-h-screen`.
- Navegação: Um `Header` no topo, o conteúdo flexível intermediário (`flex-grow`), seguido por um `Footer`.
- Padrão do site em dark theme (por default devido a `theme.css`) utilizando fundos gradientes (`gradient-noro-hero`).

---

## 5. Diretrizes de Acessibilidade (a11y) & UX

- **Focus Management:** Todos os inputs e botões possuem `focus-visible:ring-2 focus-visible:outline-none`, garantindo que a navegação por teclado exiba claramente qual elemento está ativo sem degradar o design do mouse. No CSS global, `*:focus-visible` aplica outline utilizando a cor `accent`.
- **Contraste de Cores:** Textos utilizam cores calculadas para padrões WCAG (ex: `--color-noro-text-muted` alterado para `#B8C1E0` e `--color-noro-text-body` para `#D1D5F0` com ratios acima de 7:1).
- **Acessibilidade de Componentes (ARIA):** Componentes Radix UI (Shadcn) injetam nativamente controles de teclado corretos, `aria-expanded`, e focus trapping (ex: `Dialog`, `Popover`, `Select`). Os `Forms` vinculam os labels aos campos usando `htmlFor` e descrevem os erros com `aria-describedby` e `aria-invalid`.
- **Animações (UX):** Interações incluem feedback visual através de scale/bounce sutil no clique do botão (`active:scale-[0.98]`), e animações fluídas em carregamento de páginas (`.animate-fade-in`). Recomenda-se adicionar um fallback `prefers-reduced-motion` no CSS para desabilitar animações (`animate-*`) caso requerido pelo usuário no sistema operacional.
## 6. Plano de Páginas e Subpáginas (apps/web)

**Core de conversão**
- Home: `/`
- Pricing: `/pricing`
- Contact: `/contact`
- Lead: `/lead`
- Wizard: `/wizard`

**Institucional**
- About: `/about`
- Case Studies: `/case-studies`
- Blog index: `/blog`
- Blog detalhe: `/blog/[slug]`

**Ecossistema**
- Hub: `/ecosystem`
- Dados de Vistos: `/ecosystem/dados-de-vistos`
- Intelligent Websites: `/ecosystem/intelligent-websites`
- Intelligent CRM/ERP: `/ecosystem/intelligent-crm-erp`
- ITTD: `/ecosystem/ittd`

**Suporte e confiança**
- Suporte: `/suporte`
- Política de Privacidade: `/privacy-policy`
- Termos: `/terms-of-service`

**Rota funcional interna**
- Preview de site: `/dashboard/sites/[id]/preview`

## 7. Blueprint Completo de Conteúdo/UX (apps/web)

Abaixo está o blueprint completo de conteúdo/UX para todas as páginas e subpáginas de /web, projetado para facilitar o design via Stitch e implementação subsequente.

### 7.1 Estrutura Global (Todas as páginas)

**Elementos Globais Obrigatórios:**
- Header consistente (Logo, Navegação Principal: Produto, Preços, Ecossistema, Suporte; Ações: Entrar e Começar grátis).
- Footer consistente (Links institucionais, legais, contatos, CTA final).
- CTA principal visível acima da dobra.
- CTA secundário para usuários em fase inicial de funil (menos quentes).
- Bloco de confiança (Prova social, clientes, etc).

**UX:**
- Breadcrumb ativo em páginas internas.
- Estado de loading/skeleton padronizado.
- Estado de erro amigável.

**SEO:**
- Title e Description únicos.
- Open Graph otimizado.
- H1 único por página.

**Acessibilidade (A11y):**
- Contraste nível AA (no mínimo).
- Estado `focus-visible` claro para navegação via teclado.
- Uso de `labels` e `aria` onde a semântica visual é insuficiente.

**Tracking:**
- Tracking ativo em: clique em CTA, envio de formulários, início/conclusão de wizards, clique em planos, e scroll depth.

### 7.2 Tree de Páginas e Conexões

**Fluxo Principal de Funil:**
Home -> Pricing -> Lead ou Wizard -> Preview -> App.

### 7.3 Especificação por Página

**`/` (Home)**
- **Objetivo:** Posicionamento e primeiro impacto. Direcionar para Pricing, Lead ou Wizard.
- **Blocos:** Hero com headline forte, subheadline de valor, CTA primário, CTA secundário, prova social, benefícios principais, seção de ecossistema, depoimentos, CTA final.
- **Conexões:** `/pricing`, `/ecosystem`, `/suporte`, `/lead`, `/wizard`.

**`/pricing`**
- **Objetivo:** Converter visitante quente.
- **Blocos:** Comparativo de planos, toggle mensal/anual, destaque de plano recomendado, matriz de recursos, FAQ comercial, garantias/política de cancelamento, CTA por plano.
- **Conexões:** `/lead`, `/wizard`, `app.noro.guru`.

**`/contact`**
- **Objetivo:** Captura de contato inbound.
- **Blocos:** Hero curto de contato, formulário completo, motivo do contato, canal alternativo (email/WhatsApp), SLA de resposta, FAQ rápido.
- **Conexões:** `/lead`, `/suporte`, `/privacy-policy`.

**`/lead`**
- **Objetivo:** Captura rápida de lead de alta intenção.
- **Blocos:** Form short-form, campos mínimos, prova de segurança/privacidade, mensagem de próximo passo.
- **Conexões:** `/wizard`, `/pricing`, `/contact`.

**`/wizard`**
- **Objetivo:** Qualificação guiada e geração de solução.
- **Blocos:** Stepper de progresso, perguntas por etapa, upload/URL de logo, preferências visuais, confirmação final, estado de processamento.
- **Conexões:** `/dashboard/sites/[id]/preview`, `/contact` (em caso de erro/abandono).

**`/dashboard/sites/[id]/preview`**
- **Objetivo:** Mostrar resultado gerado e empurrar para ativação.
- **Blocos:** Preview principal, resumo de personalizações, próximos passos, CTA para app.
- **Conexões:** `app.noro.guru`, `/pricing`.

**`/about`**
- **Objetivo:** Construir autoridade e confiança.
- **Blocos:** Manifesto, história da empresa, missão/visão/valores, time, diferenciais, CTA para teste.
- **Conexões:** `/pricing`, `/ecosystem`, `/lead`.

**`/ecosystem`**
- **Objetivo:** Apresentar a suíte completa de produtos.
- **Blocos:** Hero do ecossistema, grid dos 4 produtos, como os módulos se conectam, casos de uso, CTA por módulo.
- **Conexões:** Subpáginas do ecossistema, `/pricing`, `/lead`, `/wizard`.

**`/ecosystem/dados-de-vistos`**
- **Objetivo:** Vender valor da solução de dados e inteligência.
- **Blocos:** Problema do mercado, cobertura de dados, atualização/frequência, casos de uso, CTA demo.
- **Conexões:** `/lead`, `/pricing`, `/ecosystem`.

**`/ecosystem/intelligent-websites`**
- **Objetivo:** Vender serviço de geração de sites inteligentes.
- **Blocos:** Hero produto, antes/depois, fluxo de criação, integrações, CTA para wizard.
- **Conexões:** `/wizard`, `/lead`, `/ecosystem`.

**`/ecosystem/intelligent-crm-erp`**
- **Objetivo:** Vender operação unificada (Core/App).
- **Blocos:** Hero, módulos CRM + ERP, automações, benefícios operacionais, CTA comercial.
- **Conexões:** `/lead`, `/pricing`, `/ecosystem`.

**`/ecosystem/ittd`**
- **Objetivo:** Explicar e vender solução ITTD.
- **Blocos:** Definição clara, benefícios técnicos/comerciais, exemplo prático, CTA de contato.
- **Conexões:** `/lead`, `/contact`, `/ecosystem`.

**`/suporte`**
- **Objetivo:** Reduzir fricção e volume de tickets de atendimento.
- **Blocos:** Busca de ajuda, FAQs, base de conhecimento, chat/contato, status de serviços e canais.
- **Conexões:** `/contact`, artigos internos, `/privacy-policy`.

**`/blog`**
- **Objetivo:** Tráfego de SEO e educação de mercado.
- **Blocos:** Hero editorial, lista de artigos, filtros/categorias, destaques, assinatura de newsletter.
- **Conexões:** `/blog/[slug]`, `/lead`, `/pricing`.

**`/blog/[slug]`**
- **Objetivo:** Consumo de conteúdo com conversão contextualizada.
- **Blocos:** Título, autor, data, tempo de leitura, conteúdo estruturado, bloco de CTA contextual, artigos relacionados.
- **Conexões:** `/blog`, `/pricing`, `/lead`.

**`/case-studies`**
- **Objetivo:** Prova de resultado (Casos de sucesso).
- **Blocos:** Lista de estudos de caso, KPIs por caso, segmentação por tipo, CTA para diagnóstico.
- **Conexões:** `/lead`, `/pricing`, `/contact`.

**`/privacy-policy`**
- **Objetivo:** Conformidade e transparência legal (LGPD/GDPR).
- **Blocos:** Escopo, dados coletados, base legal, retenção, direitos do titular, contato do DPO.
- **Conexões:** `/contact`, `/terms-of-service`.

**`/terms-of-service`**
- **Objetivo:** Regras claras de uso da plataforma.
- **Blocos:** Aceite, uso permitido, limitações, regras de pagamento e cancelamento, responsabilidades, foro/contato.
- **Conexões:** `/contact`, `/privacy-policy`.

## 8. Diretrizes de Produto, Marca e Implementação

As seções a seguir definem o contexto estratégico e as diretrizes operacionais para geração de interfaces com foco no processo de implementação via Stitch.

### 8.1 Direção de Marca
- **Adjetivos de marca:** Confiável, Estratégica, Premium, Clara, Eficiente.
- **Sensação que a interface deve transmitir:** “Controle total da operação sem caos”; sofisticação sem parecer distante; tecnologia aplicada ao resultado comercial.
- **Referências de linguagem visual:**
  - *Gostamos:* Linear, Vercel, Stripe Docs (clareza, hierarquia, ritmo).
  - *Não gostamos:* Visual “template genérico SaaS”, excesso de gradiente decorativo, motion constante sem função.
- **Princípios de identidade:**
  - Dark profissional como base.
  - Contraste alto para legibilidade.
  - Destaques de cor só em pontos de ação/ênfase.

### 8.2 Público e Contexto
- **ICP primário:** Agências de viagem e consultorias de vistos no Brasil, com operação em múltiplos processos simultâneos. Personas: Dono(a), gestor(a) comercial, gestor(a) operacional.
- **Perfil de uso:** Baixa tolerância a fricção; precisa entender valor em menos de 30 segundos; decisão baseada em produtividade, previsibilidade e ganho de tempo.
- **Dores principais:** Ferramentas fragmentadas, falta de previsibilidade comercial/financeira, gargalo em processos manuais, dificuldade de escalar atendimento sem perder qualidade.
- **Momento do funil:**
  - Topo: entende problema, busca clareza.
  - Meio: compara solução e risco.
  - Fundo: quer prova, preço transparente e próximo passo simples.

### 8.3 Objetivo de Negócio e KPIs por Página
- **Home:** Levar para Pricing (Primário) ou Lead/Wizard. KPI: CTR do CTA principal.
- **Pricing:** Iniciar conversão. Reduzir fricção (FAQ/Garantias). KPI: Taxa de clique no plano.
- **Lead:** Captura qualificada. KPI: Taxa de envio do form.
- **Wizard:** Conclusão do fluxo e preview. KPI: Conclusão por sessão.
- **Contact:** Contato comercial ou pré-venda. KPI: Taxa de envio + SLA.
- **Ecosystem:** Aprofundar valor e mandar pro Lead. KPI: CTR por módulo.
- **Institucional (About/Blog/Cases):** Autoridade. KPI: Tempo na página + CTR contextual.
- **Suporte:** Autoatendimento. KPI: Resolução sem contato.
- **Legais:** Conformidade sem fricção no funil.

### 8.4 Copy Framework
- **Tom de voz:** Consultivo, direto, seguro, sem jargão vazio. "Português claro de operação".
- **Fórmula base:** Dor real -> promessa concreta -> prova -> ação simples.
- **Estrutura de mensagem:** Headline (benefício direto), Subheadline (como e pra quem), Prova, CTA (verbo de ação + resultado esperado).
- **Regras:** Evitar exageros verbais; mostrar o que acontece "depois do clique".

### 8.5 Regras Visuais Obrigatórias
- **Paleta Restrita:**
  - Base dark: `#0B1220`
  - Estrutura: `#342CA4`
  - CTA primário/acento: `#1DD3C0`
  - Destaque premium: `#D4AF37`
  - Texto principal: `#E0E3FF`
  - Texto secundário: `#B8C1E0`
- **Tipografia:** Display em *Poppins*, Interface/Body em *Inter*. Usar escala modular.
- **Forma e Profundidade:**
  - Radius: Containers 16px, Cards 12px, Inputs/Botões menores 10-12px (CTA primário pode usar "pill").
  - Elevação sutil em camadas, sem "glow" exagerado.
- **Proibições:** Cores fora da paleta, animações contínuas (exceção loading), hardcode de hex massivo (usar tokens), seções light quebrando o tema dark sem motivo claro.

### 8.6 Componentes e Variantes
- **Globais:** Header, Footer, Hero, Button, Card, Form controls, FAQ accordion, Testimonial card, CTA section, Badge/status.
- **Variantes Mínimas:**
  - Button: primary, secondary, ghost, outline, danger.
  - Card: default, elevated, highlighted.
  - Input: default, focus, error, success, disabled.
  - Badge: neutral, success, warning, premium.
- **Estados:** default, hover, focus-visible, active, disabled, loading, error.

### 8.7 Responsividade
- **Breakpoints:** Mobile (320-767), Tablet (768-1279), Desktop (1280+).
- **Comportamento:** Menu colapsável mobile; CTAs visíveis sem overflow horizontal; tabelas viram cards/listas no mobile; grids viram 1 ou 2 colunas dependendo da largura.
- **Legibilidade:** Texto de conteúdo funcional >= 14px; max-width para linha de leitura confortável no desktop.

### 8.8 Acessibilidade, SEO e Performance
- **Acessibilidade:** WCAG AA mínimo; focus-visible óbvio; labels/aria injetados; teclado 100% funcional.
- **SEO:** Meta title/description por rota, Open Graph otimizado, estrutura H1 única, H2/H3 coerentes.
- **Performance:** Evitar assets pesados, focar LCP e TTI no conteúdo acima da dobra.

### 8.9 Analytics Detalhado
- **Eventos Base:** `page_view`, `cta_click`, `form_submit_start`, `form_submit_success`, `form_submit_error`, `pricing_plan_click`, `wizard_start`, `wizard_step_complete`, `wizard_complete`, `checkout_start`, `support_contact_click`, `scroll_depth`.
- **Parâmetros Genéricos:** `page_name`, `page_type`, `cta_name`, `cta_position`, `plan_name`, `wizard_step`, `form_name`, `traffic_source`, `device_type`.
- **Regras:** Nomenclatura consistente (`snake_case` ou padrão GA4), evitar disparos duplicados, alta prioridade para CTAs vitais do funil.

### 8.10 Definição de Pronto e Ordem de Implementação
**Ondas de Lançamento:**
1. Home, Pricing, Lead, Wizard, Contact
2. Ecosystem + 4 subpáginas
3. About, Case Studies, Blog, Blog post
4. Suporte, Privacy, Terms
5. Polimento final e auditoria

**Definição de Pronto (DoD):**
1. Objetivo de negócio (KPI) atendido.
2. Blocos de UX/Conteúdo completos.
3. Design System aplicado sem violações graves.
4. Responsivo validado.
5. Acessibilidade AA mínima e SEO aplicados.
6. Tracking Ativo.
7. QA sem bloqueadores (0 bugs visuais/funcionais graves).

## 9. Estrutura e Diretrizes para o App Administrativo (/control)

*(Nota: O app `/control` é hospedado no subdomínio de gestão `app.noro.guru`)*

### 9.1 Estrutura Global de /control

**Arquitetura de Layout:**
- Layout raiz da aplicação: `layout.tsx`
- Layout de área protegida: `apps/control/app/(protected)/layout.tsx`
- Layout contextual de Cliente: `apps/control/app/(protected)/clientes/[id]/layout.tsx`
- Layout contextual de Tenant: `apps/control/app/(protected)/tenants/[id]/layout.tsx`

**Padrões globais obrigatórios para /control:**
- Sidebar + Topbar consistentes na área protegida.
- Busca global e atalhos de navegação sempre disponíveis.
- Breadcrumb em rotas de detalhe/edição para orientação de profundidade.
- Estado vazio, loading e erro em tabelas/listas.
- Ações críticas obrigatoriamente exigem modal de confirmação.
- Auditoria nativa de ações administrativas.
- Controle rigoroso de permissão por módulo (RBAC).

### 9.2 Módulos, Subpáginas e Objetivo de Negócio

**Autenticação e Entrada**
- `/login`, `/debug`
- **Objetivo:** Acesso seguro e diagnóstico técnico.

**Operação Comercial**
- `/clientes`, `/clientes/novo`, `/clientes/[id]`
- `/leads`
- `/orcamentos/*`
- `/pedidos/*`
- **Objetivo:** Converter e operar pipeline ponta a ponta.

**Comunicação e Atendimento**
- `/comunicacao`, `/comunicacao/chatbot`, `/comunicacao/chat/[id]`
- `/support`, `/support/[id]`
- `/notificacoes`, `/admin/notificacoes`
- **Objetivo:** Centralizar relacionamento omni-channel, acompanhar SLA e histórico da conta.

**Financeiro e Cobrança**
- `/financeiro`, `/billing`, `/pagamentos`
- `/settings/stripe`, `/settings/stripe/metrics`
- **Objetivo:** Receita previsível, conciliação e monitoramento de cobrança.

**Multi-tenant e Governança**
- `/tenants`, `/tenants/[id]` e subpáginas
- `/domains`, `/custom-domains`
- `/users`
- `/configuracoes/planos/*`
- `/api-keys`
- `/webhooks/endpoints`
- **Objetivo:** Administrar contas, planos, acesso de terceiros e integrações.

**Administração Central (Superadmin)**
- `/control`, `/control/leads`, `/control/leads/kanban`
- `/control/orgs`, `/control/orgs/[id]`, `/control/tenants`, `/control/tasks`
- `/auditoria`, `/tarefas`
- **Objetivo:** Visão macro e orquestração global da plataforma.

**Apoio de Produto**
- `/marketing`, `/email`, `/relatorios`, `/sobre-noro`
- **Objetivo:** Crescimento, comunicação transacional/massiva e inteligência de gestão.

### 9.3 Layout e Blocos por Tipo de Página (Control)

**Página de Listagem (Tabelas/Grids)**
- Header do módulo claro.
- Filtros e barra de busca.
- Tabela/lista com paginação ativa.
- Seleção e Ações em lote.
- Exportação de dados (CSV/Excel).
- Renderização apropriada de estados vazios/loading/erro.

**Página de Detalhe (Contextual)**
- Header com resumo principal de dados.
- Tabs de navegação contextual.
- Timeline de atividade/log.
- Métricas relacionadas rápidas.
- Menu de ações rápidas.

**Página de Criação/Edição (Forms)**
- Formulário dividido em seções visuais lógicas.
- Validação inline ativa (via Zod/RHF).
- Autosave opcional onde aplicável.
- Botões organizados: Salvar, Salvar e Continuar, Cancelar.
- Feedback por toast/alert pós-ação.

**Página de Monitoramento (Dashboards)**
- Cards de KPI no topo.
- Gráficos de série temporal (Recharts).
- Alertas críticos/destaques.
- Funcionalidade de Drill-down para visualizar os registros atrelados.

### 9.4 Conexões Principais de Fluxo (Control)

- **Fluxo Comercial:** Leads → Clientes → Orçamentos → Pedidos → Financeiro/Pagamentos.
- **Fluxo de Atendimento:** Comunicação/Chat → Support Ticket → Notificações.
- **Fluxo de Plataforma:** Tenants → Domínios/Configuração/Usuários/Assinatura.
- **Fluxo Superadmin:** Control (orgs/tenants/leads/tasks) → Ações Globais → Auditoria.

### 9.5 Prioridade por Onda (/control)

**Onda 1. Núcleo Operacional e Receita**
- **Rotas:** login, dashboard protegido, clientes, leads, orçamentos, pedidos, financeiro, pagamentos, billing.
- **Motivo:** Sustenta a operação diária e a geração de caixa.
- **Dependências:** Autenticação, permissões básicas, componentes base de listagem/formulário.

**Onda 2. Atendimento e Comunicação**
- **Rotas:** comunicação, chatbot, chat por id, support, support por id, notificações, admin notificações.
- **Motivo:** Reduz fricção de atendimento e melhora SLA.
- **Dependências:** Estrutura de tickets, timeline, notificações em tempo real ou polling.

**Onda 3. Multi-tenant e Governança de Conta**
- **Rotas:** tenants, tenants por id e subáreas, users, domains, custom-domains, webhooks, api-keys, configurações de planos.
- **Motivo:** Escalabilidade da plataforma e controle de clientes B2B.
- **Dependências:** RBAC mais granular e auditoria de mudanças.

**Onda 4. Superadmin e Orquestração Global**
- **Rotas:** control, control leads, kanban, orgs, org por id, control tenants, control tasks, auditoria, tarefas.
- **Motivo:** Visão executiva e governança transversal.
- **Dependências:** Dados consolidados e trilha de auditoria confiável.

**Onda 5. Produto, Crescimento e Hardening**
- **Rotas:** relatórios, marketing, email, sobre-noro, settings stripe e metrics, debug.
- **Motivo:** Otimização contínua, observabilidade e operação avançada.
- **Dependências:** Tracking operacional consolidado e baseline de performance.

### 9.6 Critérios de Aceite por Tipo de Página

**Listagem:**
- Carrega em até 2 segundos no cenário médio.
- Busca e filtros funcionam com combinação de critérios.
- Paginação/sort preserva estado na URL.
- Estados vazios, loading e erro implementados.
- Ações em lote com confirmação quando houver risco.

**Detalhe:**
- Identificador visível e contexto claro da entidade.
- Seções/tabs com navegação sem perda de estado.
- Ações críticas protegidas por confirmação.
- Histórico/atividade disponível quando aplicável.
- Links de retorno preservam filtros da listagem.

**Criação/Edição:**
- Validação client e server alinhadas.
- Mensagens de erro por campo e erro global.
- Não perde dados em erro de submit.
- Ação de salvar exibe feedback claro de sucesso.
- Bloqueio para sair sem salvar quando houver alterações (dirty form).

**Dashboard/KPI:**
- KPIs com definição e período explícitos.
- Filtros de período e tenant aplicam em todos os cards.
- Drill-down para lista origem do número.
- Estado de ausência de dados com ação recomendada.
- Atualização previsível e sem inconsistência entre widgets.

**Configuração/Admin:**
- Apenas perfis autorizados acessam.
- Toda alteração relevante gera trilha de auditoria.
- Ações destrutivas com dupla confirmação.
- Rollback possível para configurações críticas.
- Mensagens de impacto exibidas antes de confirmar.

### 9.7 Mapa de Permissões por Perfil (RBAC)

**Regra Transversal Obrigatória:**
- **Modelo Deny by Default.**
- Escopo de permissão por ação: `view`, `create`, `update`, `delete`, `manage`.
- Escopo por `tenant_id` ou `org_id` sempre validado no backend via RLS.

**Super Admin:**
- Acesso total a todas as rotas e ações.
- Gerencia organizações, tenants, planos, webhooks, api-keys, auditoria.
- Pode executar ações globais irreversíveis.

**Admin Operacional:**
- Acesso completo ao escopo da sua organização.
- Gerencia clientes, leads, pedidos, orçamentos, suporte, comunicação.
- Não pode alterar configurações globais da plataforma.

**Financeiro:**
- Acesso a financeiro, billing, pagamentos, relatórios financeiros.
- Pode exportar e conciliar.
- Sem acesso a administração técnica e chaves.

**Comercial:**
- Acesso a leads, clientes, orçamentos, pedidos.
- Pode criar/editar pipeline comercial.
- Sem acesso a configurações financeiras sensíveis.

**Suporte:**
- Acesso a support, comunicação, notificações.
- Pode atualizar status, responder e escalar tickets.
- Sem acesso a billing e governança global.

**Marketing:**
- Acesso a marketing, email e relatórios de campanha.
- Pode criar e acompanhar comunicações.
- Sem acesso a dados financeiros sensíveis.

**Viewer/Auditor:**
- Acesso somente leitura em módulos autorizados.
- Pode consultar auditoria e relatórios.
- Não cria, edita ou exclui registros.

### 9.8 Eventos de Analytics Operacional

**Padrão de Nomeclatura:**
- Formato: `dominio_modulo_acao`. Exemplo: `control_leads_status_changed`.
- Regras de Qualidade: Sem dados pessoais em payload, idempotência contra eventos duplicados, timestamps em UTC, catálogo versionado e alerta para queda de eventos críticos.

**Eventos de Autenticação e Sessão:**
- `auth_login_success`, `auth_login_failed`, `auth_logout`, `auth_session_expired`.

**Eventos Comerciais:**
- `leads_created`, `leads_qualified`, `leads_status_changed`.
- `clientes_created`.
- `orcamentos_created`, `orcamentos_converted_to_pedido`.
- `pedidos_created`, `pedidos_status_changed`.

**Eventos Financeiros:**
- `financeiro_receita_lancada`, `financeiro_pagamento_confirmado`.
- `billing_assinatura_alterada`, `billing_inadimplencia_detectada`.
- `stripe_webhook_processed`, `stripe_webhook_failed`.

**Eventos de Suporte/Comunicação:**
- `support_ticket_created`, `support_ticket_first_response`, `support_ticket_resolved`, `support_ticket_reopened`.
- `chat_conversation_started`, `chatbot_handoff_to_human`.

**Eventos de Governança:**
- `tenant_created`, `tenant_config_updated`, `user_role_changed`.
- `api_key_created`, `api_key_revoked`.
- `webhook_endpoint_created`, `webhook_delivery_failed`, `auditoria_export_requested`.

**Eventos de Confiabilidade Operacional:**
- `page_load_slow_detected`, `api_request_failed`, `retry_action_triggered`, `background_job_failed`, `background_job_reprocessed`.

**Propriedades Padrão de Evento:**
- `user_id`, `role`, `org_id`, `tenant_id`, `entity_type`, `entity_id`, `previous_status`, `new_status`, `source_page`, `latency_ms`, `success`, `error_code`.
