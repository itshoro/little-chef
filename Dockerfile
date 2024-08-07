FROM node:20-slim

WORKDIR /src
COPY . /src
RUN corepack enable \
    && pnpm install \
    && pnpm build

ENTRYPOINT pnpm start