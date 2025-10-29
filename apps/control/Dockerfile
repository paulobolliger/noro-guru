# ---- Build ----
FROM node:22-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build:web

# ---- Run ----
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
# Usa o build "standalone" do Next (precisa estar habilitado no next.config.js)
COPY --from=builder /app/apps/control/.next/standalone ./
COPY --from=builder /app/apps/control/public ./public
COPY --from=builder /app/apps/control/.next/static ./.next/static
EXPOSE 8080
CMD ["node", "server.js"]
