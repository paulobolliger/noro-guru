# ---- Build ----
FROM node:22-alpine AS builder
WORKDIR /app
# apps/web declara "canvas" como dependencia (npm workspaces instala o
# monorepo inteiro num `npm ci` so); precisa da toolchain nativa pra compilar
# o addon, mesmo que este app (soon-landing) nao use canvas em nada.
RUN apk add --no-cache python3 make g++ pkgconfig pixman-dev cairo-dev pango-dev jpeg-dev giflib-dev
COPY . .
RUN npm ci
RUN npm run build --workspace=apps/soon-landing
RUN npm prune --omit=dev

# ---- Run ----
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/soon-landing/package.json ./apps/soon-landing/package.json
COPY --from=builder /app/apps/soon-landing/dist ./apps/soon-landing/dist
WORKDIR /app/apps/soon-landing
EXPOSE 3009
CMD ["node", "dist/server.cjs"]
