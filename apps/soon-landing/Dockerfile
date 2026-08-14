# ---- Prune ----
# Gera uma copia isolada do monorepo so com o que apps/soon-landing
# realmente usa (o app nao importa nenhum pacote interno @noro/*).
# Evita instalar as dependencias de apps/web, apps/core, apps/control etc.
FROM node:22-slim AS pruner
WORKDIR /app
COPY . .
RUN npx turbo prune react-example --docker

# ---- Install & Build ----
# node:22-slim (Debian/glibc), nao alpine: package.json fixa
# @rollup/rollup-linux-x64-gnu como optionalDependency, que so resolve em
# glibc. Em musl (alpine) o Rollup nao acha o binario nativo e o build quebra.
FROM node:22-slim AS builder
WORKDIR /app
COPY --from=pruner /app/out/json/ .
RUN npm ci
COPY --from=pruner /app/out/full/ .
RUN npm run build --workspace=apps/soon-landing
# Sem `npm prune --omit=dev` aqui: a poda do turbo herda a marcacao dev/prod
# calculada pro monorepo inteiro, e pacotes como dotenv/vite (dependencias
# reais deste app) acabam marcados como dev por causa de outro workspace,
# derrubando o container em runtime. A poda do turbo prune ja deixou a
# instalacao pequena o suficiente (~516 pacotes) sem precisar desse passo.

# ---- Run ----
FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
# node:22-slim nao vem com curl; o healthcheck do Coolify roda de dentro
# do container (build pack "dockerfile" nao injeta isso sozinho como o
# nixpacks faria).
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/soon-landing/package.json ./apps/soon-landing/package.json
COPY --from=builder /app/apps/soon-landing/dist ./apps/soon-landing/dist
WORKDIR /app/apps/soon-landing
EXPOSE 3009
CMD ["node", "dist/server.cjs"]
