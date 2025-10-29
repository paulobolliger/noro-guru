Changesets
==========

Comandos úteis:
- pnpm changeset — cria um changeset e define o semver por pacote.
- pnpm changeset version — aplica o bump de versão nas packages.
- pnpm changeset publish — publica e gera changelog (quando aplicável).

Fluxo sugerido:
1) pnpm changeset (selecione os pacotes alterados e o tipo de mudança)
2) pnpm changeset version (gera versões e changelogs)
3) pnpm -r publish (ou pnpm changeset publish) quando for publicar packages

Observação: Em repositórios privados que não publicam no npm, ainda é útil para gerar changelogs e versionamento interno.
