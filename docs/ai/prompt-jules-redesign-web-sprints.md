# Prompts por Sprint - Redesign apps/web (Jules)

Aviso geral para o Jules:
- Este trabalho sera executado em SPRINTS incrementais.
- Nao tente entregar tudo de uma vez.
- Em cada sprint, entregue somente o escopo combinado e preserve compatibilidade com o que ja foi feito.
- Ao final de cada sprint, gerar checklist de QA e lista de pendencias para o proximo sprint.

Contexto base (vale para todos os sprints):
- Projeto: noro-guru (monorepo)
- App alvo: apps/web (Next.js App Router)
- Dominio marketing: noro.guru
- Produto principal: app.noro.guru
- Admin interno: admin.noro.guru
- Oferta de sites IA: sites.noro.guru
- Publico-alvo: agencias de viagem no Brasil

Diretriz de negocio (vale para todos os sprints):
1. Home deve vender principalmente o NORO Portal.
2. Sites com IA e oferta estrategica secundaria.
3. Ecossistema (vistos/API/ITTD) sem competir com a mensagem central.

Diretriz visual base (vale para todos os sprints):
- Primary Ink: #232452
- Turquoise Accent: #19B8A8
- Deep Navy: #1A1D2E
- Neutral Surface: #F6F7FB
- Text Strong: #1F2433
- Sans: Plus Jakarta Sans
- Display: Fraunces (somente H1/H2 e destaque curto)
- Mono: JetBrains Mono (microdetalhes)
- Acessibilidade minima: WCAG AA (4.5:1 para texto normal)

---

## Sprint 1 - Fundacao visual + Home + Shell global

Prompt para enviar ao Jules:

"""
Estamos executando este redesign em SPRINTS.
Voce esta no SPRINT 1, entao nao avance para outras paginas alem do escopo abaixo.

Escopo do Sprint 1:
1. Auditoria UX/UI do estado atual do apps/web (top 10 problemas por impacto).
2. Fundacao do design system no codigo:
   - tokens globais (cor, tipografia, espacamento, radius, shadow)
   - base de componentes reutilizaveis para marketing
3. Refatorar Header e Footer globais para consistencia visual e navegacao.
4. Redesenhar Home (/), incluindo:
   - hero com proposta de valor clara
   - prova social
   - beneficios principais
   - CTA principal e CTA secundaria
5. Corrigir CTAs e rotas quebradas visiveis na Home/Header/Footer.

Regras obrigatorias:
- Trabalhar somente em apps/web.
- Reduzir inline styles de forma substancial.
- Garantir responsividade mobile/tablet/desktop.
- Nao quebrar SEO tecnico (metadata/headings).

Entregaveis do Sprint 1:
1. Relatorio de auditoria (problema, impacto, recomendacao).
2. Diff de codigo da fundacao + Home + Header/Footer.
3. Checklist QA: responsividade, acessibilidade, navegacao, links.
4. Lista curta de pendencias para Sprint 2.
"""

---

## Sprint 2 - Conversao comercial (Pricing + Lead/Contact)

Prompt para enviar ao Jules:

"""
Estamos executando em SPRINTS.
Voce esta no SPRINT 2. Use o que foi construido no Sprint 1 e nao reescreva a fundacao sem necessidade.

Escopo do Sprint 2:
1. Redesenhar /pricing com foco em decisao e conversao.
2. Redesenhar /lead e /contact como fluxos de captura/contato.
3. Padronizar componentes de conversao:
   - cards de plano
   - comparativo
   - FAQ comercial
   - CTA sticky (quando fizer sentido)
4. Revisar copy comercial para clareza e objetividade.

Regras obrigatorias:
- Reutilizar tokens/componentes do Sprint 1.
- Nenhum CTA para rota inexistente.
- Contraste e foco visivel em todos os elementos interativos.

Entregaveis do Sprint 2:
1. Diff de codigo somente do escopo do sprint.
2. Evidencia de consistencia com design system.
3. Checklist QA: formulario, rotas, conversao, responsividade.
4. Lista de pendencias para Sprint 3.
"""

---

## Sprint 3 - Narrativa institucional (Ecosystem + Suporte + About/Case Studies)

Prompt para enviar ao Jules:

"""
Estamos executando em SPRINTS.
Voce esta no SPRINT 3. Nao altere sem necessidade as paginas de Sprint 1 e 2.

Escopo do Sprint 3:
1. Redesenhar /ecosystem para organizar produtos/verticais sem poluir a narrativa.
2. Redesenhar /suporte com UX clara de autoatendimento e contato.
3. Revisar/alinhar /about e /case-studies com a mesma linguagem visual.
4. Garantir consistencia de narrativa:
   - Home = foco NORO Portal
   - Ecosystem = modulos complementares

Regras obrigatorias:
- Reutilizacao total de tokens e componentes existentes.
- Evitar visual de dashboard interno.
- Melhorar escaneabilidade (titulos, secoes, hierarquia).

Entregaveis do Sprint 3:
1. Diff de codigo do escopo.
2. Ajustes de IA/sitemap entre paginas institucionais.
3. Checklist QA: consistencia visual, navegacao cruzada, acessibilidade.
4. Pendencias para Sprint 4.
"""

---

## Sprint 4 - Conteudo e acabamento final (Blog + Legais + QA geral)

Prompt para enviar ao Jules:

"""
Estamos executando em SPRINTS.
Voce esta no SPRINT 4 (acabamento). Nao refatorar do zero o que ja esta aprovado.

Escopo do Sprint 4:
1. Revisar /blog e /blog/[slug] para coerencia visual e legibilidade editorial.
2. Alinhar /privacy-policy e /terms-of-service ao design system.
3. Avaliar /wizard:
   - manter temporariamente no marketing com consistencia visual, ou
   - propor migracao de fluxo para area de produto (com justificativa)
4. QA final ponta a ponta em apps/web.

Regras obrigatorias:
- Fechar pendencias abertas dos sprints anteriores.
- Validar links internos e CTAs finais.
- Garantir baseline de performance percebida.

Entregaveis do Sprint 4:
1. Diff final.
2. Checklist QA consolidado:
   - responsividade
   - acessibilidade
   - performance percebida
   - SEO tecnico basico
   - integridade de rotas/links
3. Relatorio final de conclusao com:
   - o que foi entregue por sprint
   - riscos residuais
   - proximos passos recomendados
"""

---

## Regra final de execucao

Em todos os sprints:
1. Primeiro entregar analise curta do escopo antes de codar.
2. Depois implementar apenas o combinado.
3. Depois apresentar diff + checklist + pendencias.
4. Sempre manter compatibilidade com o que foi aprovado no sprint anterior.
