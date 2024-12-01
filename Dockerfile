##### DEPENDENCIES

FROM  node:18-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Install Prisma Client - remove if not using Prisma

COPY drizzle ./

# Install dependencies based on the preferred package manager

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN ls -la

RUN  npm ci; 

##### BUILDER

FROM node:18-alpine AS builder

ENV DATABASE_URL="postgresql://knfapp_owner:JT6wxRnqdWP8@ep-damp-wind-a1mh78yc.ap-southeast-1.aws.neon.tech/knfapp?sslmode=require"
ENV NEXT_PUBLIC_CLIENTVAR=clientvar
ENV UPSTASH_REDIS_REST_URL="https://ep-damp-wind-a1mh78yc.ap-southeast-1.aws.neon.tech"
ENV UPSTASH_REDIS_REST_TOKEN="your_upstash_redis_rest_token"


WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ENV NEXT_TELEMETRY_DISABLED 1

RUN SKIP_ENV_VALIDATION=1 npm run build

##### RUNNER

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["server.js"]
