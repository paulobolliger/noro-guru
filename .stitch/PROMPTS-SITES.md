# PROMPTS-SITES.md — Prompts Stitch para sites.noro.guru

> App: `sites.noro.guru` · Tema: **definido pelo tenant** (exemplo: light com cor primária da agência)
> Tokens de design, paleta e tipografia: ver [DESIGN.md](./DESIGN.md)
> Especificação completa: ver [DESIGN-SITES.md](./DESIGN-SITES.md)

---

## Nota sobre personalização do tenant

Os prompts abaixo usam uma **agência fictícia de exemplo**:
- Nome: "Horizonte Viagens"
- Cor primária: #1A56DB (azul vibrante)
- Cor secundária: #F59E0B (âmbar)
- Fonte: Plus Jakarta Sans
- Logo: placeholder

Ao gerar para um tenant real, substitua as cores, nome e logo conforme as configurações do tenant.

---

## SHELL GLOBAL

### Header da Agência

**Prompt Stitch:**
Crie o Header de um site de agência de turismo no sites.noro.guru. Tema light (bg branco). Tenant: "Horizonte Viagens".

Posição: sticky no topo. Background branco. Border-bottom 1px #E5E7EB. Altura 68px. Padding horizontal 80px.

Esquerda: Logo "Horizonte Viagens" (placeholder retangular com nome em texto #1A56DB, Manrope 700).

Centro: navegação com links em #374151, 15px, hover #1A56DB:
- "Início" (link ativo com underline #1A56DB)
- "Destinos"
- "Sobre nós"
- "Blog"
- "Contato"

Direita: botão CTA "Solicitar Orçamento" — bg #1A56DB, texto branco, border-radius 8px, padding 10px 20px. Hover: bg #1345B8.

Mobile: logo + hamburger. Drawer overlay branco com nav em lista, CTA no final.

Comportamento scroll: sem mudança visual (já sólido). Shadow sutil em scroll > 60px.

---

### Footer da Agência

**Prompt Stitch:**
Crie o Footer de um site de agência de turismo. Tema light. Bg #1A56DB. Texto branco.

Grid 3 colunas desktop, gap 48px, padding 64px 80px.

Coluna 1 — Marca:
Logo branco + tagline "Realizamos os melhores momentos da sua vida." em rgba(255,255,255,0.8), 14px.
Ícones sociais: Instagram, Facebook, YouTube, WhatsApp — círculos 36px bg rgba(255,255,255,0.15), ícones brancos.

Coluna 2 — "Navegação":
Links brancos: Início, Destinos, Sobre Nós, Blog, Contato.

Coluna 3 — "Contato":
📍 Rua das Palmeiras, 123 — São Paulo, SP
📞 (11) 98765-4321
✉ contato@horizonteviagens.com.br
CNPJ: 12.345.678/0001-90

Divider rgba(255,255,255,0.15). Rodapé: copyright esquerda + "Site criado com Noro Guru" muted direita (ou oculto conforme plano).

---

### Botão WhatsApp Flutuante

**Prompt Stitch:**
Crie o botão flutuante de WhatsApp para sites de agências no sites.noro.guru. Posição fixed bottom-right (24px, 24px).

Círculo 56px, bg #25D366 (verde WhatsApp), ícone WhatsApp branco 28px, sombra verde suave.
Hover: scale(1.1), shadow maior.
Tooltip ao hover: "Fale conosco no WhatsApp" — pill dark, aparece à esquerda.

---

## HOMEPAGE DA AGÊNCIA

### `/[slug]` — Homepage

**Prompt Stitch:**
Crie a homepage de um site de agência de turismo no sites.noro.guru. Tenant: "Horizonte Viagens". Tema light.

A página é composta por seções (blocos) empilhadas. Gere todas as seções abaixo em sequência, com o header e footer da agência.

**Seção 1 — Hero:**
Background: imagem full-width de destino tropical (placeholder, overlay gradiente dark bottom 40%). Altura 90vh mínimo.
Conteúdo centralizado: badge pill branco "✈ 15 anos de experiência" + H1 branco Manrope 800 60px "Viagens que transformam vidas." + subtítulo branco 20px + 2 CTAs: "Ver destinos" (#1A56DB) + "Solicitar orçamento" (ghost branco).
Setas de scroll suave abaixo.

**Seção 2 — Destinos em destaque:**
Background branco. Título "Destinos em destaque" Manrope 700 36px #111827. Subtítulo muted.
Grid de cards 3 colunas:
Card: foto de destino (250px altura, border-radius 16px, hover scale 1.02) + badge (ex: "🔥 Popular") + nome do destino bold 18px + país muted + botão "Saiba mais →" ghost #1A56DB.
Destinos exemplo: Cancún (México), Santorini (Grécia), Maldivas.

**Seção 3 — Serviços:**
Background #F9FAFB. Título "O que fazemos de melhor". Grid 3 cards: ícone (64px circle bg #EEF2FF) + título + descrição. Serviços: Viagens Nacionais, Internacionais, Pacotes Personalizados.

**Seção 4 — Formulário de cotação:**
Background #1A56DB. Título branco "Solicite seu orçamento gratuito". Card branco centralizado, border-radius 16px, padding 40px, max-width 700px.
Formulário 2 colunas: Nome + Email (linha 1) | WhatsApp + Destino de interesse (linha 2) | Datas (date range, linha 3) | Número de viajantes + Tipo (linha 4) | Mensagem textarea (full width). Botão "Solicitar orçamento" full-width #1A56DB.

**Seção 5 — Depoimentos:**
Background branco. Título "O que nossos clientes dizem".
Carousel de 3 depoimentos visíveis: foto circular + texto em itálico + nome bold + "São Paulo, SP" muted + estrelas douradas (5).

**Seção 6 — Blog preview:**
Background #F9FAFB. Título "Últimas do blog". Grid 3 cards dark com imagem + categoria + título + data. Botão "Ver todos os posts →" centralizado.

---

## PÁGINA INTERNA

### `/[slug]/[page]` — Página interna: Sobre Nós

**Prompt Stitch:**
Crie a página "Sobre Nós" de um site de agência no sites.noro.guru. Tenant: "Horizonte Viagens". Tema light.

Header + Footer da agência.

Hero: bg linear-gradient(135deg, #1A56DB, #1345B8). Título "Sobre a Horizonte Viagens" branco Manrope 700 48px. Subtítulo branco muted. Breadcrumb "Início > Sobre Nós" branco no topo.

Seção "Nossa história": 2 colunas — texto esquerda (narrativa sobre a agência, fundação, missão) + foto da equipe/escritório direita.

Seção "Nossa equipe": grid 4 cards — foto circular + nome bold + cargo muted + especialidade (badge pill).

Seção "Certificações": logos/badges de parceiros e certificações (IATA, ABAV, etc.).

CTA final: "Vamos planejar sua viagem juntos?" — bg #1A56DB, botão "Solicitar orçamento" branco.

---

### `/[slug]/[page]` — Página interna: Destinos

**Prompt Stitch:**
Crie a página "Destinos" de um site de agência. Tenant: "Horizonte Viagens". Tema light.

Header + Footer.

PageHeader: título "Nossos Destinos" (centralizado, Manrope 700, 40px). Subtítulo.

Filtros: chips de seleção (Todos / América / Europa / Ásia / Caribe / Oriente Médio / Oceania).

Grid de destinos 3 colunas (gap 24px):
Card (border-radius 16px, overflow hidden, hover shadow + scale 1.02):
- Imagem 240px altura
- Overlay gradient bottom com badge de continente
- Padding 20px inferior: nome destino bold + país muted + "A partir de R$ X.XXX" (destaque #1A56DB) + botão "Ver pacotes →"

---

### `/[slug]/contato` — Contato

**Prompt Stitch:**
Crie a página "Contato" de um site de agência. Tenant: "Horizonte Viagens". Tema light.

Header + Footer.

Hero mínimo: título "Fale conosco" centralizado. Subtítulo.

Layout 2 colunas (60/40):
Coluna esquerda — Formulário de contato (card com shadow, border-radius 16px, padding 40px):
Campos: Nome | Email | WhatsApp | Assunto (select) | Mensagem (textarea 5 linhas). Botão "Enviar mensagem" full-width #1A56DB.

Coluna direita — Dados de contato (cards empilhados):
Card: 📍 Endereço com Google Maps embed abaixo (placeholder mapa).
Card: 📞 Telefone + WhatsApp (botão "Chamar no WhatsApp" verde).
Card: ✉ Email + horário de atendimento.
Ícones de redes sociais.

---

## BLOG

### `/[slug]/blog` — Hub do Blog

**Prompt Stitch:**
Crie a página de Blog de uma agência no sites.noro.guru. Tenant: "Horizonte Viagens". Tema light.

Header + Footer da agência.

Hero: bg #1A56DB. Título "Blog Horizonte Viagens" branco Manrope 700 40px. Subtítulo "Dicas de viagem, destinos e muito mais" branco. Input de busca centralizado (bg branco, border-radius full, placeholder "Buscar artigos...").

Post destaque: card bg branco, border-radius 16px, shadow. Layout 2 colunas: imagem (400px, border-radius 12px topo) + conteúdo: categoria badge #1A56DB, título Manrope 700 28px, resumo 3 linhas, "10 min leitura" + data + botão "Ler artigo →" #1A56DB.

Grid posts (3 colunas):
Card light, shadow sutil, border-radius 12px, hover shadow maior:
Imagem thumbnail (200px altura, border-radius 12px topo) + padding 20px: badge categoria, título bold 16px, resumo 2 linhas, rodapé: data + tempo leitura.

Filtros de categoria (chips): Todos, Dicas de viagem, Europa, América, Ásia, Cruzeiros, Vistos.

---

### `/[slug]/blog/[post-slug]` — Post Individual

**Prompt Stitch:**
Crie a página de um post de blog de agência. Tenant: "Horizonte Viagens". Tema light.

Header + Footer.

Breadcrumb: "Início > Blog > 10 Dicas Para Viajar Para Portugal".

Hero do post: imagem full-width 500px com overlay. Badge categoria, título H1 Manrope 700 40px branco (sobre imagem).

Layout: área de leitura (max-width 760px, centralizado) + sidebar (240px, sticky, desktop).

Conteúdo principal:
- Metadata: foto autora circular + "Horizonte Viagens" + data + "8 min de leitura" + ícones de compartilhamento (WhatsApp, Facebook, link)
- Corpo do artigo: Plus Jakarta Sans 17px, #374151, line-height 1.8
- H2 de seções: Manrope 700, 26px, #111827, border-bottom 2px #1A56DB
- Imagens inline com caption muted 13px
- Bloco de dica (bg #EEF2FF, border-left 4px #1A56DB, border-radius 4px, padding 16px)

Sidebar (desktop):
Card: "Gostou do roteiro? Solicite seu orçamento." + botão "Solicitar" #1A56DB + campo email newsletter.

Posts relacionados: grid 3 cards compactos abaixo do artigo.

---

## 404

### `/404` — Página Não Encontrada

**Prompt Stitch:**
Crie a página 404 do sites.noro.guru para quando uma página de agência não é encontrada. Tenant: "Horizonte Viagens". Tema light.

Header + Footer da agência.

Conteúdo centralizado, padding 120px:
- Número "404" (Manrope 900, 120px, #1A56DB, opacidade 0.15, em absolute atrás)
- Ícone de avião (64px, #1A56DB)
- Título "Parece que esta página voou!" (Manrope 700, 32px)
- Subtítulo "Mas ainda podemos te ajudar a planejar sua próxima viagem." (#6B7280)
- Grid 3 links sugeridos: "Ir para o início", "Ver destinos", "Falar conosco" — cards com ícone + texto
- Botão "Ir para o início" #1A56DB + link "Fale conosco via WhatsApp" ghost verde

---

*Documento gerado em: 2026-05-24 · Versão: 1.0*
*Para especificação completa, consulte [DESIGN-SITES.md](./DESIGN-SITES.md)*
