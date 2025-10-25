#!/usr/bin/env bash
set -euo pipefail

if ! command -v npx >/dev/null 2>&1; then
  echo "npx não encontrado. Instale Node.js >= 18." >&2
  exit 1
fi

if ! npx --yes tsx --version >/dev/null 2>&1; then
  echo "Instalando tsx temporariamente via npx..."
fi

echo "Executando provision-tenant.ts"
npx --yes tsx infra/provision/provision-tenant.ts

