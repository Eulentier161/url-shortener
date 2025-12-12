# syntax=docker.io/docker/dockerfile:1

FROM node:24-alpine AS base
RUN apk add --no-cache libc6-compat postgresql-client \
    && corepack enable

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
# Create .yarnrc.yml without yarnPath to use corepack's yarn
RUN echo "nodeLinker: node-modules" > .yarnrc.yml
RUN yarn install

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/yarn.lock ./yarn.lock
# Override .yarnrc.yml to use corepack's yarn instead of custom path
RUN echo "nodeLinker: node-modules" > .yarnrc.yml

ARG POSTGRES_URL
ENV POSTGRES_URL=${POSTGRES_URL}

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1
RUN yarn run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/docker-entrypoint.sh ./docker-entrypoint.sh
COPY --from=builder --chown=nextjs:nodejs /app/runtime-schema.js ./runtime-schema.js

RUN chmod +x docker-entrypoint.sh
# RUN chown -R nextjs:nodejs /app

ARG POSTGRES_URL
ENV POSTGRES_URL=${POSTGRES_URL}

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
ENTRYPOINT ["/app/docker-entrypoint.sh"]
