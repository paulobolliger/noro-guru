# ---- Build ----
# node:22-slim (Debian/glibc), nao alpine: package.json fixa
# @rollup/rollup-linux-x64-gnu como optionalDependency, que so resolve em
# glibc. Em musl (alpine) o Rollup nao acha o binario nativo e o build quebra.
FROM node:22-slim AS builder
WORKDIR /app
# apps/web declara "canvas" como dependencia (npm workspaces instala o
# monorepo inteiro num `npm ci` so); precisa da toolchain nativa pra compilar
# o addon, mesmo que este app (soon-landing) nao use canvas em nada.
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ pkg-config \
    libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*
COPY . .
RUN npm ci
RUN npm run build --workspace=apps/soon-landing
RUN npm prune --omit=dev

# ---- Run ----
FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/soon-landing/package.json ./apps/soon-landing/package.json
COPY --from=builder /app/apps/soon-landing/dist ./apps/soon-landing/dist
WORKDIR /app/apps/soon-landing
EXPOSE 3009
CMD ["node", "dist/server.cjs"]
