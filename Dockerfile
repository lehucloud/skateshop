##### DEPENDENCIES

FROM  node:18-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Install Prisma Client - remove if not using Prisma

COPY drizzle ./

# Install dependencies based on the preferred package manager

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN ls -la

RUN  \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm install && npm ci; \
    elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
    else echo "Lockfile not found." && exit 1; \
    fi

##### BUILDER

FROM node:18-alpine AS builder

ARG AUTH_GOOGLE_ID
ARG AUTH_GOOGLE_SECRET

ENV AUTH_SECRET="ChX/fhj4Ybvegp1dmtf63Ae3EjPMgcRpschZNArmSiM=" 
ENV AUTH_WECHAT_APP_ID="wx04ca1fa1c3f1770d"
ENV AUTH_WECHAT_APP_SECRET="213079066415dc583256f43d16acf3af"
ENV NEXT_PUBLIC_APP_URL="https://skateshop-994267374609.asia-east2.run.app"
ENV NEXTAUTH_URL="https://skateshop-994267374609.asia-east2.run.app"
ENV DATABASE_URL="postgresql://knfapp_owner:JT6wxRnqdWP8@ep-damp-wind-a1mh78yc.ap-southeast-1.aws.neon.tech/knfapp?sslmode=require"
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_Y2xvc2UtcmluZ3RhaWwtMzkuY2xlcmsuYWNjb3VudHMuZGV2JA"
ENV AUTH_TRUST_HOST="https://skateshop-994267374609.asia-east2.run.app"
ENV CLERK_SECRET_KEY="sk_test_fPoL5QOOnfFh9vTtRBGAtOpeRO4djMqkw10iUb1HLj"
ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL="/signin"
ENV NEXT_PUBLIC_CLERK_SIGN_UP_URL="/signup"
ENV RESEND_API_KEY="re_"
ENV EMAIL_FROM_ADDRESS="onboarding@resend.dev"
ENV UPLOADTHING_SECRET="sk_live_"
ENV UPLOADTHING_APP_ID="•••••••••••••••••"
ENV UPSTASH_REDIS_REST_URL="https://YOUR_UPSTASH_REDIS_REST_URL"
ENV UPSTASH_REDIS_REST_TOKEN="•••••••••••••"
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_51QI8XWPF6uIdO7c3xkH9RHL42MGMcc1zeJtPXmGGyGSTXKah7Bh0YjZA5jHx47y3gJjaIVWdegnp5t81PNHQeZCK00HGBvR7ug"
ENV STRIPE_API_KEY="sk_test_51QI8XWPF6uIdO7c3sc0dWkU2FlslfDqpz61Yjo8ZjMsgoXfYaL79ZNEerFt9AWyRxHlqzdbJjzKblYMXr42jkGGO00Avf11AD0"
ENV STRIPE_WEBHOOK_SECRET="whsec_"
ENV STRIPE_STD_MONTHLY_PRICE_ID="price_"
ENV STRIPE_PRO_MONTHLY_PRICE_ID="price_"
ENV SKIP_ENV_VALIDATION="true"




WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ENV NEXT_TELEMETRY_DISABLED 1

RUN \
    if [ -f yarn.lock ]; then SKIP_ENV_VALIDATION=1 yarn build; \
    elif [ -f package-lock.json ]; then SKIP_ENV_VALIDATION=1 npm run build; \
    elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && SKIP_ENV_VALIDATION=1 pnpm run build; \
    else echo "Lockfile not found." && exit 1; \
    fi

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



