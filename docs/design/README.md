# Design Documentation

Esta pasta concentra decisoes visuais curadas da NORO.

Ela nao substitui a pasta `.stitch/` enquanto o ciclo Stitch ainda estiver ativo.

## Fronteira

| Area | Uso |
| --- | --- |
| `.stitch/` | Arquivos operacionais/gerados pelo Stitch. Manter no lugar enquanto o Stitch ainda estiver em andamento. |
| `docs/design/` | Decisoes visuais aprovadas, direcao de UI, notas curadas e referencias que podem orientar implementacao. |
| `docs/archive/stitch/` | Destino futuro para material Stitch quando o ciclo for encerrado ou congelado. |
| `docs/backlog/` | Destino futuro para ideias de produto/design ainda planejadas, mas nao aprovadas como direcao atual. |

## Regra

Nao mover `.stitch/` para `docs/archive/` enquanto a ferramenta ou o fluxo Stitch ainda depender desses arquivos.

Quando um material gerado pelo Stitch virar direcao oficial, criar um resumo curado em `docs/design/` em vez de usar o arquivo gerado como fonte principal.

## Referencias Atuais

- `docs/design/current-brand-reference.md`: inventario do estado atual de marca/design. Nao e Brand Book oficial.

## Proximos Documentos Possiveis

- `docs/design/brand-book.md`
- `docs/design/web-redesign.md`
- `docs/design/app-ui-direction.md`
- `docs/design/control-plane-ui.md`
- `docs/design/sites-generator-ui.md`
