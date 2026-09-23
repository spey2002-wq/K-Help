# ---- Dependencies ----
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ---- Build ----
FROM node:22-alpine AS build
WORKDIR /app

ARG NEXT_PUBLIC_API_URL=http://localhost:8080
ARG NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- Runtime ----
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

# `output: standalone` emits a minimal server bundle.
COPY --from=build /app/public ./public
COPY --from=build --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nextjs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000 HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
