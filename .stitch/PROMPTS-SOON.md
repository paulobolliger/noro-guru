---
file: .stitch/PROMPTS-SOON.md
module: Soon Page Prompts
status: Active
related: [.stitch/DESIGN-WEB.md, apps/web/app/page.tsx]
---

# PROMPTS-SOON.md — Prompt Stitch para soon.noro.guru

> App: `soon.noro.guru` · Tema: **Light** (Noro Core — Light adaptado para Marketing)
> Propósito: Landing Page de "Em Breve" clara, moderna e de alta conversão, com formulário de Lista de Espera e grid Bento assimétrico de alto impacto.

---

## TELA PRINCIPAL: COMING SOON / WAITLIST (VERSÃO CLARA - BENTO GRID)

**Prompt Stitch:**
Crie a Landing Page de "Em Breve" (soon.noro.guru) com foco em conversão e lista de espera (waitlist). 
Estilo de design: **LIGHT THEME** — visual limpo, moderno, exclusivo, transmitindo a sensação de entrar para um clube selecionado de agências de alta performance. 
Background base: #FFFFFF (branco puro).

**Seção 1 — Header Minimalista:**
Altura 64px, padding horizontal 80px desktop / 24px mobile:
- Logo Noro Guru à esquerda (versão colorida/roxa #342CA4, 28px altura)
- Badge pill à direita: "✦ Beta Fechado — Vagas Limitadas" em roxo #342CA4, bg #F0EFFF, border rgba(52, 44, 164, 0.2), font-size 13px bold

**Seção 2 — Hero & Captura de Leads:**
Fundo: Branco puro #FFFFFF com manchas suaves e translúcidas de cores pastel de fundo (glowing blobs em roxo #342CA4 e teal #1DD3C0 com 5% de opacidade apenas) e uma grade quadriculada ultra-suave cinza-claro rgba(0,0,0,0.015) com blocos de 40px.
Padding vertical: 120px desktop, 60px mobile. Max-width 1100px centralizado.

Layout em 2 colunas no desktop (1 coluna no mobile), gap 48px:

* **Coluna Esquerda (Conteúdo & Proposta de Valor):**
  - Tagline: "PARA AGÊNCIAS QUE QUEREM CRESCER DE VERDADE" em roxo #342CA4, bold, uppercase, 13px, letter-spacing 2px
  - H1: "Pare de improvisar. Comece a operar." (Manrope 800, 52px, cor escura #1F2433, line-height 1.15)
  - Subtítulo: "O Noro Guru é o sistema operacional da sua agência de turismo. CRM, financeiro, propostas com IA e site de vendas — tudo integrado, tudo no controle." (#4B5563, 18px, line-height 1.6)
  - Separador fino roxo: altura 2px, largura 48px, cor #342CA4, margin-top 16px, margin-bottom 16px
  - Lista de benefícios (gap 12px, com checkmark verde #16A34A, font-size 16px):
    - "CRM feito para o ciclo de vendas de viagens"
    - "Financeiro com controle de câmbio e margem em tempo real"
    - "IA que gera propostas e roteiros em minutos"
    - "Site de vendas profissional grátis para sua agência"
    - "Consulta de vistos integrada ao itinerário do cliente"
  - Social Proof (itálico, cor #6B7280, margin-top 24px, font-size 14px): "Mais de 200 agências já estão na fila de espera."

* **Coluna Direita (Card de Inscrição Premium):**
  - Card: bg #FFFFFF, border 1px #ECEEF3, border-radius 16px, padding 32px, shadow suave: `0 10px 30px rgba(31, 36, 51, 0.06)`
  - Eyebrow acima do título: "ACESSO ANTECIPADO" em roxo #342CA4, uppercase, 11px, bold
  - Título: "Garanta sua vaga no Beta" (#1F2433, 22px, Manrope 700, margin-bottom 6px)
  - Subtítulo: "Quem entrar agora terá condições exclusivas que nunca mais serão oferecidas." (#4B5563, 14px, margin-bottom 24px)
  - Formulário:
    - Campo E-mail: input claro (bg #F6F7FB, border 1px #DFE2EA, cor do texto #1F2433, placeholder "seu@email.com", padding 12px, border-radius 8px, full-width)
    - Campo WhatsApp: input claro (mesma estilização, placeholder "+55 11 99999-9999")
    - Campo "Quantos agentes na sua equipe?": select claro (opções: Só eu / 2 a 5 agentes / 6 a 15 agentes / Mais de 15 agentes)
    - Botão "Quero meu acesso antecipado →": bg #342CA4, hover #232452, texto branco, font-size 15px bold, padding 14px, border-radius 10px, full-width, margin-top 12px
  - Micro-copy abaixo do botão (12px, center, cor #9CA3AF): "Sem cartão de crédito. Sem compromisso. Só você na frente da fila."

**Seção 3 — Preview / Mockup:**
Abaixo do Hero, centralizado, com max-width 960px. Coloque um mockup de alta qualidade da interface do dashboard em frame de browser claro com bordas finas e uma sombra bem desfocada e elegante em volta (`box-shadow: 0 20px 50px rgba(0,0,0,0.08)`).

**Seção 4 — O que está sendo construído para você (Bento Grid Assimétrico):**
Padding vertical 80px. Título da seção centralizado: "O que está sendo construído para você" (Manrope 700, 28px, #1F2433).
Subtítulo: "Cada módulo foi pensado para a realidade de quem vende viagens." (16px, #4B5563, center, margin-bottom 48px).

Abaixo do título, monte uma grade de cards no estilo **Bento Grid** (assimétrica e premium). O layout deve conter:
- **Linha 1:** 2 Cards de Destaque Grandes (largura 50% / 50% desktop, 100% mobile).
- **Linha 2:** 3 Cards Padrão Menores (largura 33% / 33% / 33% desktop, 100% mobile).

### Configurações de Cores e Estilos dos Cards (Opções de Variação):

*(Recomenda-se a **Versão C** por destacar visualmente a tecnologia e diferenciais)*

- **Versão A (Roxo Dominante):**
  Todos os 5 cards com fundo #F6F7FB, borda #ECEEF3, texto escuro #1F2433 e ícones na cor roxo #342CA4.
  
- **Versão B (Roxo e Teal Alternados):**
  Todos os cards com fundo #F6F7FB e borda #ECEEF3. Cards 1, 2 e 4 têm ícones roxos #342CA4. Cards 3 e 5 têm ícones teal #1DD3C0.

- **Versão C (Bento Grid com Destaque Premium - RECOMENDADA):**
  - **Cards Destaque da Linha 1 (Cards 3 e 4):** Fundo roxo escuro premium **#1F2433**, borda sutil, texto principal em branco, texto secundário em #D1D5F0, e ícones na cor teal #1DD3C0.
  - **Cards Menores da Linha 2 (Cards 1, 2 e 5):** Fundo cinza-claro **#F6F7FB**, borda #ECEEF3, texto principal em #1F2433, e ícones na cor roxa #342CA4.

---

### Conteúdo dos Cards (Bento Grid Layout):

#### **LINHA 1 — Cards de Destaque Grandes (50% de largura cada)**

* **Card 3 — IA Operacional (Destaque Premium - Versão C: fundo #1F2433, ícone Sparkles em teal #1DD3C0, texto branco):**
  - Título: "Sua IA que entende de viagem"
  - Copy: "Gere propostas completas, roteiros detalhados e follow-ups personalizados em minutos. Você foca no cliente — a IA cuida do trabalho operacional pesado."

* **Card 4 — Sites de Vendas (Destaque Premium - Versão C: fundo #1F2433, ícone Globe em teal/roxo, texto branco):**
  - Título: "Seu site profissional, grátis"
  - Copy: "Toda agência na plataforma ganha um site de vendas integrado ao CRM. Seus pacotes publicados, suas propostas convertendo — tudo sem precisar de um desenvolvedor."

#### **LINHA 2 — Cards Padrão Menores (33% de largura cada, fundo #F6F7FB, ícone roxo #342CA4, texto escuro)**

* **Card 1 — CRM & Pipelines (Ícone: Users):**
  - Título: "CRM feito para quem vende viagens"
  - Copy: "Gerencie leads, propostas e clientes num funil desenhado para o ciclo real de vendas de turismo. Sem adaptar o sistema — ele fala a sua língua."

* **Card 2 — Financeiro & Câmbio (Ícone: Wallet):**
  - Título: "Margem protegida, câmbio sob controle"
  - Copy: "Saiba exatamente quanto ganha em cada venda em real ou dólar. Composição automática de preço e taxas aplicadas na hora da conversão."

* **Card 5 — API de Vistos (Ícone: Passport/FileText):**
  - Título: "Vistos sem complicação"
  - Copy: "Consulte requisitos, prazos e documentação de vistos direto no sistema, integrado ao itinerário do cliente. Menos pesquisa, mais segurança."

**Seção 5 — Footer Minimalista:**
Divider horizontal 1px #ECEEF3.
Padding vertical 24px. Alinhado no centro: texto "Noro Guru © 2026. Todos os direitos reservados." em Plus Jakarta Sans 13px, #4B5563.
