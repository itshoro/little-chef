FROM node:22-alpine AS base

FROM base AS deps

WORKDIR /src

COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm \
    && pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /src

COPY --from=deps /src/node_modules ./node_modules
COPY . .

RUN corepack enable pnpm \
    && pnpm build

FROM base AS runner
WORKDIR /src

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /src/public ./public

COPY --from=builder --chown=nextjs:nodejs /src/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /src/.next/static ./.next/static

# manually copy `@libsql/linux-x64-musl` as it is being dropped as a dependency in the standalone build.
COPY --from=builder --chown=nextjs:nodejs /src/node_modules/@libsql/linux-x64-musl ./node_modules/@libsql/linux-x64-musl

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]