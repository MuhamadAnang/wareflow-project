FROM imbios/bun-node:22-slim as base

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get -y update \
  && apt-get install -yq openssl ca-certificates tzdata \
  && ln -fs /usr/share/zoneinfo/Asia/Jakarta /etc/localtime \
  && dpkg-reconfigure -f noninteractive tzdata \
  && npm i -g corepack \
  && corepack enable \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

FROM base as deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base as builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm build

FROM base as runner

ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile --ignore-scripts

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["pnpm", "start"]