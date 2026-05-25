# DESIGN-SITES.md — Especificação Completa do Sites Runtime

> App: `sites.noro.guru` · Owner: Plataforma (runtime público dos tenants) · Tema: definido pelo tenant (default: Light)
> Referência de tokens, paleta e tipografia: ver [DESIGN.md](./DESIGN.md)
> **Público:** Visitantes dos sites de agências que usam o Noro Guru como plataforma de sites.

---

## ÍNDICE

1. [Arquitetura do Runtime](#1-arquitetura-do-runtime)
2. [Componentes Globais do Shell do Site](#2-componentes-globais-do-shell-do-site)
3. [Rota Principal — Homepage da Agência](#3-rota-principal--homepage-da-agência)
4. [Páginas Internas Customizadas](#4-páginas-internas-customizadas)
5. [Blog da Agência](#5-blog-da-agência)
6. [Página 404](#6-página-404)
7. [Roadmap de Funcionalidades Sites](#7-roadmap-de-funcionalidades-sites)

---

## 1. Arquitetura do Runtime

### 1.1 Modelo de Roteamento

O Sites runtime resolve rotas de duas formas, em ordem de prioridade:

**1. Domínio customizado (prioridade máxima):**
- `minhaagencia.com.br` → resolve para o tenant configurado
- DNS: CNAME apontando para `sites.noro.guru` (ou A record para IP do CDN)
- SSL: certificado emitido automaticamente via Let's Encrypt / Cloudflare

**2. Subdomínio Noro (fallback):**
- `sites.noro.guru/[slug]` → slug único do tenant, configurado no Core

**Regra de resolução:**
```
Request → Cloudflare Edge
  → domínio customizado? → lookup tenant pelo hostname → render site do tenant
  → sites.noro.guru/[slug]? → lookup tenant pelo slug → render site do tenant
  → slug não encontrado? → /404 do Sites
```

### 1.2 Camadas de Personalização

O site de cada agência é composto por:
- **Blueprint:** estrutura de seções e páginas definida no Core (`/meu-site/editor`)
- **Conteúdo:** textos, imagens, configurações editadas no Core
- **Tema:** paleta de cores, fontes, logo — herdados das configurações do tenant
- **Blog:** posts criados no módulo de Conteúdo IA do Core

### 1.3 Render Strategy

- **ISR (Incremental Static Regeneration):** revalidação automática quando o tenant publica alterações
- **On-demand revalidation:** botão "Publicar" no Core aciona `revalidate` via API
- **Edge cache:** Cloudflare CDN com cache por tenant + slug
- **Fallback:** se tenant suspensor ou sem plano ativo → página informativa educada

### 1.4 Multi-tenancy no Frontend

- Cada request carrega o `tenant_config` (tema, logo, nome, config social, etc.)
- Variáveis CSS injetadas dinamicamente no `<head>` com os tokens do tenant
- Sem referência visual ao Noro Guru no site do tenant (exceto se plano free incluir rodapé "Powered by Noro")

---

## 2. Componentes Globais do Shell do Site

Estes componentes são renderizados em todas as páginas do site da agência, a partir das configurações do tenant.

### 2.1 Header da Agência

**Posição:** Topo fixo ou sticky (configurável pelo tenant).

**Elementos (padrão):**
- Logo da agência (imagem do tenant) — clicável → `/`
- Navegação: links para as páginas internas criadas pelo tenant + Blog (se ativo)
- CTA do tenant (configurável): "Solicitar Orçamento", "WhatsApp", "Falar Conosco"
- Menu mobile: hamburger com drawer

**Customizações por tenant:**
- Cor de fundo do header (do tema do tenant)
- Cor dos links
- Modo: transparente no hero / sólido sempre

**Comportamento:**
- Scroll > 80px → header sólido com shadow (se modo transparente configurado)
- Navegação com link ativo destacado

---

### 2.2 Footer da Agência

**Posição:** Rodapé de todas as páginas.

**Elementos (padrão):**
- Logo da agência
- Descrição curta (tagline configurada pelo tenant)
- Links de navegação do site
- Links de redes sociais (configurados pelo tenant: Instagram, Facebook, WhatsApp, YouTube, LinkedIn)
- Informações de contato: email, telefone, endereço (se configurado)
- CNPJ (se configurado)
- Copyright: "© [Ano] [Nome da Agência]. Todos os direitos reservados."
- "Powered by Noro Guru" (apenas em planos free/starter, configurável)

**Customizações por tenant:**
- Layout do footer (1 coluna / 2 colunas / 3 colunas)
- Cores do background e texto

---

### 2.3 WhatsApp Float Button

- Botão flutuante (bottom-right) com ícone WhatsApp
- Cor: verde padrão ou cor customizada do tenant
- Número configurado no tenant
- Mensagem pré-definida configurável (ex: "Olá! Tenho interesse em um roteiro de viagem.")
- Visível em todas as páginas se configurado pelo tenant

---

### 2.4 Cookie Banner (do Site da Agência)

- Mesmo padrão do site Noro, mas com nome da agência
- Texto: "[Nome da Agência] usa cookies..."
- Configurável: ativo/inativo pelo tenant

---

### 2.5 SEO por Página

- `<title>` configurado por página no editor do Core
- `og:title`, `og:description`, `og:image` por página
- JSON-LD `LocalBusiness` com dados da agência (nome, endereço, telefone, redes sociais)
- Sitemap.xml gerado automaticamente: `sites.noro.guru/[slug]/sitemap.xml` ou `minhaagencia.com/sitemap.xml`
- robots.txt: indexável por padrão, configurável pelo tenant

---

## 3. Rota Principal — Homepage da Agência

### 3.1 `/[slug]` — Homepage

**Objetivo:** Página inicial do site da agência, construída com o editor de seções do Core.

**Estrutura:**
O conteúdo é inteiramente dinâmico — definido pelo blueprint de seções que o tenant configurou no Core em `/meu-site/editor`. Cada seção tem um tipo e um conjunto de propriedades.

**Seções disponíveis no blueprint (biblioteca de blocos):**

**Hero:**
- Texto principal + subtítulo + CTA(s)
- Imagem de fundo ou vídeo
- Variações: centralizado / esquerda / com formulário inline de cotação

**Sobre Nós:**
- Texto editorial + imagem da equipe ou agência
- Variações: texto simples / com foto / com timeline

**Destinos em Destaque:**
- Grid de cards de destinos: imagem, nome, país, badge (ex: "Popular", "Novo"), botão "Saiba mais"
- Conexão: dados vindos do catálogo do tenant no Core

**Serviços / O que fazemos:**
- Grid de cards de serviços: ícone, título, descrição
- Variações: 3 colunas / 4 colunas / lista com ícones

**Depoimentos:**
- Carousel ou grid de depoimentos de clientes
- Por depoimento: foto (opcional), nome, texto, nota (estrelas opcional)

**Galeria:**
- Grid de fotos de viagens realizadas
- Lightbox ao clicar

**Formulário de Cotação:**
- Campos: nome, email, WhatsApp, destino de interesse, data prevista, número de pessoas, mensagem
- Submit: salva como Lead no Core do tenant com tag "Site"
- Confirmação: mensagem inline de sucesso + email automático

**Parceiros / Logos:**
- Logos de companhias aéreas, hotéis, operadoras parceiras

**Blog Preview:**
- Últimos N posts do blog da agência (2-4 cards)
- Botão "Ver todos os posts" → `/[slug]/blog`

**Mapa / Localização:**
- Google Maps embed com endereço da agência

**Contato:**
- Formulário simples + dados de contato (email, telefone, redes)

**CTA Banner:**
- Seção de chamada para ação com background colorido ou imagem
- Título + subtítulo + botão

**Conexões:**
- Formulário de cotação → Lead no Core (`/leads` com source=site)
- Links para páginas internas → `/[slug]/[page]`
- Links de blog → `/[slug]/blog`

**Estados:**
- Loading: skeleton das seções na ordem do blueprint
- Publicado: renderização completa ISR
- Site suspenso: página informativa sem branding Noro excessivo
- Slug não encontrado: → `/404`

---

## 4. Páginas Internas Customizadas

### 4.1 `/[slug]/[page]`

**Objetivo:** Páginas adicionais criadas pelo tenant no editor (ex: "Sobre Nós", "Destinos", "Pacotes", "Contato", "Política de Privacidade").

**Estrutura:**
- Mesma arquitetura de blocos da homepage
- Header e Footer da agência sempre presentes
- O slug da subpágina é definido pelo tenant no Core em `/meu-site/paginas`
- Breadcrumb: [Nome da Agência] → [Nome da Página]

**Tipos de página padrão com layout sugerido:**

**Sobre Nós (`/[slug]/sobre`):**
- Hero com foto da equipe
- Texto narrativo da história da agência
- Cards dos consultores (foto, nome, especialidade)
- Certificações e parcerias

**Destinos (`/[slug]/destinos`):**
- Hero com galeria
- Grid de destinos com filtro por continente/tipo
- Card de destino: imagem, nome, descrição breve, botão

**Pacotes / Viagens (`/[slug]/pacotes`):**
- Listagem de pacotes de viagem
- Card: imagem, destino, duração, a partir de R$, botão "Solicitar"
- Filtros: destino, tipo de viagem, preço, duração

**Contato (`/[slug]/contato`):**
- Formulário de contato completo
- Mapa
- Dados de contato (endereço, telefone, email, horário de atendimento)

**Página genérica:**
- Título + conteúdo em blocos (texto, imagem, lista, CTA)

**Conexões:**
- Formulário de contato → Lead no Core
- Botão "Solicitar pacote" → formulário de cotação ou modal de contato

---

## 5. Blog da Agência

### 5.1 `/[slug]/blog`

**Objetivo:** Blog da agência com posts criados no módulo de Conteúdo IA do Core.

**Elementos:**

**Header do blog:**
- Título: "Blog [Nome da Agência]"
- Subtítulo configurável
- Input de busca por post

**Post em destaque:**
- Card grande: imagem de capa, categoria, título, resumo, data, CTA "Ler mais"

**Grid de posts:**
- Cards: imagem thumbnail, categoria badge, título, resumo (2 linhas), data, tempo de leitura estimado
- Paginação: 9 posts por página (ou "Carregar mais")

**Sidebar (desktop):**
- Categorias filtráveis (chips)
- Posts recentes (lista)

**Conexões:**
- Card → `/[slug]/blog/[post-slug]`
- Conteúdo: posts publicados no Core em `/conteudo/artigos` com status `publicado`

---

### 5.2 `/[slug]/blog/[post-slug]`

**Objetivo:** Post individual do blog da agência.

**Elementos:**
- Breadcrumb: [Agência] → Blog → [Título do Post]
- Header: categoria badge, título H1, data de publicação, tempo de leitura
- Imagem de capa (hero image)
- Conteúdo: markdown renderizado com tipografia editorial
  - Headings com hierarquia clara
  - Imagens inline com legenda
  - Blocos de destaque (quote, dica, alerta)
- Sidebar direita (sticky, desktop): TOC (tabela de conteúdo), CTA de cotação
- Seção final: "Gostou? Solicite um orçamento" → formulário ou link para cotação
- Posts relacionados: grid de 3 cards de posts da mesma categoria

**SEO:**
- JSON-LD `Article` com autor (agência), data, imagem
- og:image: imagem de capa do post
- Canonical: URL do post

**Conexões:**
- CTA inline → formulário de cotação (Lead no Core)
- Posts relacionados → outros posts do blog

---

## 6. Página 404

### 6.1 `/404` — Not Found

**Objetivo:** Página amigável quando slug de agência ou página não é encontrado.

**Contextos:**
- **Slug de agência não encontrado** (`sites.noro.guru/slug-invalido`): exibe branding Noro + mensagem "Esta agência não existe ou o link mudou"
- **Página interna não encontrada** (`sites.noro.guru/[slug]/pagina-invalida`): exibe branding da agência + mensagem "Esta página não existe"

**Elementos (contexto de agência encontrada):**
- Logo da agência
- Ilustração ou ícone 404 (no tema visual da agência)
- Título: "Página não encontrada"
- Subtítulo: "Mas ainda podemos te ajudar a planejar sua viagem!"
- Links sugeridos: Ir para o início, Ver destinos, Falar conosco
- CTA: formulário de contato rápido ou link WhatsApp

**Elementos (contexto Noro — slug inválido):**
- Logo Noro Guru
- Título: "Agência não encontrada"
- Subtítulo: "Verifique o link ou acesse o site da Noro"
- CTA: "Ir para noro.guru" → `noro.guru`

---

## 7. Roadmap de Funcionalidades Sites

As funcionalidades abaixo estão mapeadas no backlog e afetarão a arquitetura do Sites runtime quando implementadas:

### 7.1 Domínios Customizados (em implementação)
- Tenant configura domínio em `/meu-site/dominio` no Core
- Control provisiona DNS e SSL automaticamente
- Sites runtime resolve pelo hostname sem prefixo de slug

### 7.2 Preview Privado (roadmap)
- `/[slug]/preview/[token]` — URL de preview autenticado antes de publicar
- Token gerado pelo Core, expira em 24h
- Exibe banner "PREVIEW — não publicado" no topo

### 7.3 A/B Testing de Seções (roadmap)
- Tenant define variante A e B de uma seção no editor
- Sites runtime distribui 50/50 por cookie de sessão
- Core exibe métricas de conversão por variante

### 7.4 Analytics Embed (roadmap)
- Sites injeta script do Google Analytics ou Plausible configurado pelo tenant
- Painel de analytics básico integrado no Core em `/meu-site/analytics`

### 7.5 E-commerce Leve (roadmap futuro)
- Venda de pacotes diretamente no site
- Integração com gateway de pagamento do tenant
- Gestão de pedidos no Core

---

*Documento gerado em: 2026-05-24 · Versão: 1.0 · App: sites.noro.guru*
