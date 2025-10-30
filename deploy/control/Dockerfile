# multi-stage build for Next.js Control app
FROM node:20-alpine AS builder
WORKDIR /app

# install dependencies (monorepo aware)
COPY package.json package-lock.json ./
COPY apps/control/package.json apps/control/package.json
COPY apps/core/package.json apps/core/package.json
COPY apps/visa-api/package.json apps/visa-api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/lib/package.json packages/lib/package.json
COPY packages/ui/package.json packages/ui/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/control-worker/package.json packages/control-worker/package.json
RUN npm ci

# copy full repo and build
COPY . .
RUN npm run build:web

# production image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

# copy necessary artifacts
aRG CACHEBUST=1
COPY --from=builder /app/apps/control/.next /app/apps/control/.next
COPY --from=builder /app/apps/control/public /app/apps/control/public
COPY --from=builder /app/apps/control/package.json /app/apps/control/package.json
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/package-lock.json /app/package-lock.json
COPY --from=builder /app/node_modules /app/node_modules

CMD ["npm", "run", "start:web"]
