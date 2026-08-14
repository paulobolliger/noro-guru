# ---- Build ----
FROM node:22-alpine AS builder
WORKDIR /app
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
