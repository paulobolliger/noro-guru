# Referencia Atual De Marca E Design

Status: referencia provisoria, nao e Brand Book oficial.

Data de referencia: 2026-05-27

## Objetivo

Este documento consolida o que o projeto possui hoje sobre identidade visual, marca e design system.

Ele existe para evitar perda de contexto enquanto o Brand Book definitivo ainda nao foi criado. Nao deve ser tratado como guia final de marca, nem como aprovacao formal de logo, tom de voz, paleta ou regras comerciais de identidade.

## Fontes Atuais

| Fonte | Uso atual |
| --- | --- |
| `.stitch/DESIGN.md` | Fonte mais completa de tokens visuais, paleta, tipografia e direcao de UX gerada no ciclo Stitch. |
| `.stitch/STITCH-SETUP.md` | Configuracao de sistemas visuais por contexto: Core, Control, Web e API. |
| `apps/web/styles/theme.css` | Tokens aplicados no site publico/marketing. |
| `apps/control/app/globals.css` | Tokens aplicados no Control Plane/admin. |
| `docs/design/README.md` | Politica de organizacao da area curada de design. |

## O Que Existe Hoje

O projeto possui uma direcao visual parcialmente definida, mas ainda distribuida entre arquivos gerados, CSS de apps e notas de implementacao.

Existe material suficiente para orientar implementacao de UI no curto prazo, principalmente em:

- cores de marca;
- cores semanticas;
- tipografia;
- temas por contexto;
- uso de UI operacional vs marketing;
- alguns padroes de componentes.

O projeto nao possui ainda:

- Brand Book oficial;
- manual de uso de logo;
- pacote oficial de assets de marca;
- regra formal de tom de voz;
- regras de uso externo da marca;
- diretrizes finais para materiais comerciais;
- aprovacao final sobre nomenclatura publica.

## Nomenclatura

Ha uso recorrente de `NORO` e `Noro Guru`.

Decisao pendente:

- definir se a marca principal e `NORO`, `Noro Guru` ou outra variacao;
- definir quando usar caixa alta;
- definir como nomear apps e modulos publicamente;
- definir diferenca entre marca corporativa, produto e dominios.

Enquanto isso nao for decidido, documentacao tecnica deve preferir `NORO` para a plataforma e preservar nomes reais de apps, pacotes e dominios quando estiver falando de codigo.

## Paleta Atual Encontrada

### Brand

| Token | Valor | Fonte principal |
| --- | --- | --- |
| `noro_primary` | `#342CA4` | `.stitch/DESIGN.md`, `apps/web/styles/theme.css`, `apps/control/app/globals.css` |
| `noro_primary_deep` | `#3B2CA4` | `.stitch/DESIGN.md`, `apps/web/styles/theme.css` |
| `noro_primary_dark` | `#232452` | `.stitch/DESIGN.md` |
| `noro_accent` | `#1DD3C0` | `.stitch/DESIGN.md`, `apps/web/styles/theme.css` |
| `noro_gold` | `#D4AF37` | `.stitch/DESIGN.md`, `apps/web/styles/theme.css`, `apps/control/app/globals.css` |
| `noro_gold_hover` | `#E5C04B` | `.stitch/DESIGN.md`, `apps/web/styles/theme.css` |

Observacao: `apps/web/styles/theme.css` usa `#23214F` para `--color-noro-primary-dark`, enquanto `.stitch/DESIGN.md` usa `#232452`. Isso deve ser reconciliado antes do Brand Book oficial.

### Neutros E Temas

| Token/uso | Valor | Contexto |
| --- | --- | --- |
| `noro_dark` | `#0B1220` | Base escura para paginas publicas e contextos dark. |
| `noro_dark_purple` | `#12152C` | Superficies escuras. |
| `noro_surface_dark` | `#2B2E48` | Cards/superficies em tema escuro. |
| `noro_light` | `#F8F9FB` | Base clara. |
| `surface` | `#FFFFFF` | Interfaces operacionais claras. |
| `surface_2` | `#F6F7FB` | Fundos secundarios claros. |
| `border` | `#ECEEF3` | Bordas leves no sistema Stitch. |

### Semanticos

| Token | Valor | Uso esperado |
| --- | --- | --- |
| `success` | `#16A34A` | Pago, concluido, ativo, verificado. |
| `warning` | `#CA8A04` | Pendente, em aberto, aguardando aprovacao. |
| `destructive` | `#E11D48` | Cancelado, atrasado, negado. |
| `info` | `#2563EB` | Informativo, em processamento. |

Observacao: `apps/control/app/globals.css` usa valores semanticos diferentes em alguns casos (`#10B981`, `#EF4444`, `#F59E0B`, `#3B82F6`). Isso e outro ponto de reconciliacao.

## Tipografia Atual Encontrada

| Familia | Fonte | Uso sugerido hoje |
| --- | --- | --- |
| `display` | Manrope | H1/H2 publicos e titulos de modulo/secao. |
| `sans` | Plus Jakarta Sans | Body, labels, tabelas, badges, formularios e UI operacional. |
| `mono` | JetBrains Mono | Codigo, API keys, hashes e snippets tecnicos. |

Observacao: a fonte Fraunces aparece como removida em `.stitch/DESIGN.md` para evitar ruptura de legibilidade entre paginas publicas e dashboards.

## Tema Por Contexto

| Contexto | Direcao atual |
| --- | --- |
| `apps/web` | Tema escuro por padrao, com roxo, teal e gold em CTAs/destaques. |
| `apps/control` | Interface operacional clara, com sidebar escura e uso moderado de gold como acento. |
| `apps/core` | Direcao Stitch sugere operacional claro, mas precisa reconciliar com o estado real do app. |
| `apps/sites` | Deve seguir blueprint/tenant; nao ha Brand Book oficial para sites publicados. |
| `apps/visa-api` | Direcao Stitch sugere dark developer/docs com teal como acento. |

## Logos E Assets

Nao foi identificado um Brand Book nem pacote oficial de logos dentro de `docs/design/`.

Ha referencias de logo/branding no codigo relacionadas a tenant, white label e exibicao de marca, mas isso nao substitui uma especificacao oficial da marca NORO.

Pendencias:

- localizar ou criar arquivo oficial de logo;
- definir usos permitidos em fundo claro e escuro;
- definir area de respiro;
- definir tamanhos minimos;
- definir versoes monocromaticas;
- definir uso conjunto com marcas de tenants/agencias.

## Riscos Atuais

- `.stitch/` ainda esta ativo e contem material gerado; nao deve virar fonte oficial sem curadoria.
- Paleta do Stitch e CSS real ja apresentam pequenas divergencias.
- `apps/web` e `apps/control` usam tokens parecidos, mas nao ha garantia de sincronizacao.
- Nao existe uma decisao unica sobre o nome publico da marca.
- Falta separar identidade da NORO de identidade customizavel por tenant.

## Regras Provisorias

1. Usar este documento apenas como inventario do estado atual.
2. Para implementacao nova, preferir tokens existentes em CSS/app ou pacote UI antes de criar cores hardcoded.
3. Quando houver conflito entre Stitch e codigo ativo, registrar a divergencia antes de padronizar.
4. Nao chamar este arquivo de Brand Book.
5. O Brand Book oficial deve nascer em outro arquivo, depois de validacao visual e decisao de marca.

## Proximo Documento Recomendado

Quando houver decisao final de marca, criar:

`docs/design/brand-book.md`

Esse futuro documento deve substituir este inventario como fonte oficial de identidade visual.
