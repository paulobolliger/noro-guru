FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/control-worker/package.json packages/control-worker/package.json
COPY apps/control/package.json apps/control/package.json
COPY packages/lib/package.json packages/lib/package.json
COPY packages/ui/package.json packages/ui/package.json
COPY packages/types/package.json packages/types/package.json
RUN npm ci

COPY . .
RUN npm run build:worker

ENV NODE_ENV=production
CMD ["npm", "run", "start:worker"]
