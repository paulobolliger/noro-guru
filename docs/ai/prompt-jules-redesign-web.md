# Prompt para Jules - Redesign completo do app web (marketing)

Contexto do projeto:
- Monorepo: noro-guru
- App alvo: apps/web (Next.js App Router)
- Dominio de marketing: noro.guru
- Produto principal (area logada): app.noro.guru
- Admin interno: admin.noro.guru
- Landing de oferta de sites IA: sites.noro.guru
- Publico-alvo principal: agencias de viagem no Brasil
- Proposta de valor: CRM + financeiro + comunicacao + conteudo IA + criacao de sites em uma plataforma unica

O que a NORO Guru e hoje (servicos/produtos):
1. NORO Portal (SaaS principal para agencias):
   - CRM e vendas (leads, funil, propostas/pedidos)
   - Financeiro (recebiveis, cobranca, operacao)
   - Comunicacao (canais e atendimento)
   - Conteudo com IA para marketing/comercial
   - Modulo "Meu Site" para publicar site da agencia
2. Oferta de Sites com IA (entrada comercial dedicada):
   - Jornada para criar/gerar site para agencia com baixa barreira tecnica
3. Dados/API de vistos (vertical de ecossistema):
   - Base de requisitos de visto e informacoes para integracao via API
4. ITTD (vertical em evolucao):
   - produto complementar relacionado a dados/turismo (ainda em maturacao)

Regras de posicionamento de negocio (obrigatorio respeitar no redesign):
1. Noro.guru vende principalmente o software para agencias (NORO Portal).
2. Sites com IA e uma oferta estrategica, mas secundaria ao portal principal.
3. Vistos/API e ITTD entram como ecossistema, sem competir com a mensagem central da home.

Objetivo macro:
- Reconstruir completamente o design da frente publica (apps/web) para ganhar clareza de posicionamento, consistencia visual, conversao e escalabilidade de manutencao.
- Nao quero apenas um "restyle". Quero nova direcao visual + novo sistema de layout/componentes + revisao de arquitetura da experiencia.

Problemas atuais que precisam ser resolvidos:
1. Inconsistencia de linguagem visual entre paginas (algumas claras, outras dark, estilos e tom desalinhados).
2. Uso excessivo de estilos inline e baixo reaproveitamento de componentes visuais.
3. Hierarquia de informacao confusa (mensagem principal, produtos e CTAs competem entre si).
4. Jornadas de conversao pouco nítidas (trial, demo, contato, onboarding).
5. Falta de padronizacao de grid, espacamento, estados interativos e responsividade.
6. Existem rotas e CTAs que precisam ser auditados para evitar links quebrados.

Direcao estrategica desejada:
1. Marca premium, confiavel e moderna para B2B SaaS brasileiro (sem cara generica de template).
2. Foco em conversao para 3 caminhos:
   - Comecar trial no app
   - Falar com especialista
   - Conhecer modulo de sites/IA
3. Separar claramente:
   - Site institucional (noro.guru)
   - Produto logado (app.noro.guru)
   - Oferta de sites IA (sites.noro.guru)
4. Preservar narrativa orientada ao mercado de turismo/agencias, mas com copy mais direta e madura.

Escopo tecnico (obrigatorio):
- Trabalhar somente em apps/web.
- Manter Next.js App Router.
- Priorizar componentes reutilizaveis com Tailwind/classes utilitarias e reduzir drasticamente inline styles.
- Criar um mini design system local (tokens + padrao de componentes de marketing).
- Garantir excelente responsividade (mobile-first, tablet e desktop).
- Garantir acessibilidade minima (contraste, foco visivel, navegacao por teclado, semantica).
- Nao quebrar SEO tecnico basico (metadata, headings, schema, sitemap/robots quando aplicavel).

Paginas que devem ser construidas/reconstruidas:

Prioridade 1 (obrigatorio nesta fase):
1. Home: / (mensagem principal e conversao)
2. Precos: /pricing
3. Ecossistema: /ecosystem
4. Suporte: /suporte
5. Header/Footer globais (consistencia de navegacao e CTA)

Prioridade 2 (obrigatorio revisar e alinhar visual/UX):
1. /about
2. /contact
3. /blog e /blog/[slug]
4. /case-studies
5. /lead

Prioridade 3 (nao precisa redesenho profundo agora, mas manter coerencia):
1. /privacy-policy
2. /terms-of-service
3. /wizard (avaliar se fica no app web de marketing ou migra para fluxo de produto)

Regra de qualidade de rotas/CTAs:
1. Nenhum CTA principal pode apontar para rota inexistente.
2. Se uma rota ainda nao existir, propor rota substituta real e registrar no relatorio.
3. Auditar links atuais com foco em /register, /demo e /funcionalidades.

Diretriz visual inicial (usar como base, com evolucao justificada):

1. Personalidade visual:
- B2B SaaS premium para turismo/agencias no Brasil.
- Tom: confiavel, sofisticado, pratico e orientado a resultado.
- Evitar linguagem visual de dashboard interno no site institucional.

2. Paleta base (sementes):
- Primary Ink: #232452 (marca, CTA principal, titulos fortes)
- Turquoise Accent: #19B8A8 (destaques, links ativos, estados de sucesso de marketing)
- Deep Navy: #1A1D2E (fundos escuros e secoes de contraste)
- Neutral Surface: #F6F7FB (blocos de apoio)
- Text Strong: #1F2433
- Text Muted: rgba(31,36,51,0.60)

2.1 Escala de cor obrigatoria (nao usar tons soltos por pagina):
- Primary: 700/600/500/400/300
- Accent: 700/600/500/400/300
- Neutral: 950/900/800/700/600/500/400/300/200/100/50

2.2 Mapeamento semantico esperado:
- CTA principal: primary-600 (hover primary-700)
- CTA secundaria: superficie + borda neutral-300
- Links ativos: accent-600 (hover accent-700)
- Fundo de secoes alternadas: neutral-50 e neutral-100
- Estados de sucesso de marketing: accent-500/600 (sem parecer sistema interno)

3. Tokens semanticos esperados:
- --color-bg
- --color-surface
- --color-surface-strong
- --color-text
- --color-text-muted
- --color-primary
- --color-primary-contrast
- --color-accent
- --color-border
- --color-focus-ring
- --radius-sm / --radius-md / --radius-lg / --radius-xl
- --space-2 ... --space-16

3.1 Tokens adicionais recomendados:
- --color-primary-500 / 600 / 700
- --color-accent-500 / 600 / 700
- --color-neutral-50 ... 950
- --shadow-sm / --shadow-md / --shadow-lg
- --container-max

4. Tipografia:
- Sans principal: Plus Jakarta Sans (ou equivalente com personalidade similar)
- Display: Fraunces (titulos/editorial de marca)
- Mono de apoio: JetBrains Mono (micro-labels, badges tecnicos)
- Regras:
   - manter hierarquia clara de H1/H2/H3
   - evitar excesso de pesos diferentes por secao
   - garantir legibilidade em telas pequenas

4.1 Regra de uso da display font (obrigatorio):
- Fraunces apenas em H1/H2 e destaques curtos.
- Nao usar Fraunces em paragrafos, tabelas, cards densos ou elementos de formulario.
- Evitar mais de 1 bloco display dominante por viewport.

5. Grid e espacamento:
- Definir grid consistente para desktop/tablet/mobile.
- Padronizar ritmos verticais por secao (hero, conteudo, prova social, CTA).
- Evitar variacao arbitraria de paddings inline.

6. Motion e interacao:
- Animacoes curtas e funcionais (entrada de secao, hover de CTA, estados de foco).
- Sem animacoes decorativas pesadas.
- Respeitar prefers-reduced-motion.

7. Componentes base obrigatorios do marketing:
- Header global
- Footer global
- Hero
- SectionHeading
- PrimaryButton / SecondaryButton / TertiaryLink
- FeatureCard
- ProductCard
- PricingCard
- TestimonialCard
- FAQItem
- TrustBadge

8. Regra de componentes:
- cada componente com estados default, hover, active e focus visivel
- sem dependencia de estilos inline para estrutura principal
- uso de variantes para evitar duplicacao visual

8.1 Estados minimos por componente interativo:
- default
- hover
- active
- focus-visible
- disabled
- loading (quando aplicavel)

9. Regra de contraste e acessibilidade:
- texto pequeno nunca com contraste fraco sobre fundo colorido
- links claramente identificaveis
- foco visivel em todos os elementos interativos

9.1 Metas de contraste (WCAG):
- Texto normal: minimo 4.5:1
- Texto grande: minimo 3:1
- Componentes de UI e estados de foco: minimo 3:1 contra o entorno
- Evitar turquesa claro para texto de corpo sobre fundo branco

9.2 Acessibilidade de motion:
- Implementar fallback para prefers-reduced-motion
- Evitar animacoes longas em elementos centrais de leitura

10. Entrega de design system no codigo:
- criar arquivo de tokens globais no app web
- documentar rapidamente os tokens em Markdown junto ao PR
- mostrar como cada pagina principal consome os mesmos tokens/componentes

Arquivos/contexto para considerar:
- apps/web/app/layout.tsx
- apps/web/app/page.tsx
- apps/web/components/Hero.tsx
- apps/web/components/Features.tsx
- apps/web/components/Ecosystem.tsx
- apps/web/components/Header.tsx
- apps/web/components/Footer.tsx
- apps/web/app/pricing/page.tsx
- apps/web/app/ecosystem/page.tsx
- apps/web/app/suporte/page.tsx
- docs/plano-dominios-cloudflare.md
- docs/multi-tenant-architecture.md

Tarefas esperadas (ordem de execucao):
1. Fazer auditoria UX/UI do estado atual e listar gaps criticos por severidade.
2. Definir direcao de marca visual (tipografia, paleta, tokens, ritmo de espacamento, iconografia, estilo de ilustracao).
3. Definir arquitetura de informacao da home e paginas principais.
4. Redesenhar Home, Pricing, Ecosystem e Suporte com consistencia total.
5. Padronizar Header/Footer, CTAs, cards, secoes, grids e estados.
6. Refatorar para reduzir inline styles e aumentar composicao por componentes.
7. Revisar links/rotas e corrigir pontos de quebra de navegacao.
8. Entregar pagina por pagina com diff claro e justificativa de design.

Entregaveis obrigatorios:
1. Relatorio de auditoria inicial (antes de codar) com:
   - Problema
   - Impacto
   - Recomendacao
2. Plano de IA/UX (novo sitemap de marketing + objetivos de cada pagina).
3. Sistema visual (tokens e regras) documentado em Markdown.
4. Implementacao completa nas paginas principais.
5. Checklist final de QA:
   - Responsividade
   - Acessibilidade
   - Performance percebida
   - Consistencia visual
   - Links e navegacao

Criterios de aceitacao (Definition of Done):
1. Experiencia visual coesa em todo apps/web.
2. Home claramente orientada a conversao com proposta de valor forte acima da dobra.
3. Design system minimo aplicado (nao apenas ajustes soltos por pagina).
4. Queda substancial de inline styles no codigo.
5. Nenhum CTA principal apontando para rota invalida.
6. Layouts mobile e desktop aprovados sem quebrar conteudo.

Regras de estilo para o redesign:
- Evitar visual "AI slop" / template generico.
- Evitar exagero de efeitos sem funcao (glassmorphism gratuito, animacoes distrativas).
- Tipografia com personalidade e legibilidade.
- Contraste forte para leitura em PT-BR.
- Componentes com estados claros: default, hover, active, focus, disabled quando aplicavel.

Formato de resposta que eu quero de voce (Jules):
1. Primeiro: auditoria critica do estado atual (sem codar ainda).
2. Segundo: proposta de direcao visual + wireframe textual da nova home.
3. Terceiro: plano de implementacao em etapas pequenas (commitaveis).
4. Quarto: codigo da etapa 1 (home + base tokens/componentes).
5. Quinto: codigo das etapas seguintes (pricing, ecosystem, suporte), sempre com resumo do que mudou e por que.

Observacoes de negocio importantes:
- O foco comercial atual e vender software para agencias de viagem no Brasil.
- O modulo de sites IA e uma oferta estrategica (sites.noro.guru) e precisa ficar claro sem confundir com o app principal.
- O ecossistema tem produtos/verticais (incluindo vistos/API), mas sem poluir a narrativa principal da home.

Comece agora pela auditoria, com priorizacao por impacto em conversao e clareza de posicionamento.
