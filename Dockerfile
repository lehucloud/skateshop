FROM node:18-alpine AS builder
WORKDIR /app

COPY .env.production ./
ENV AUTH_GOOGLE_ID=3
ENV AUTH_GOOGLE_ID=4
RUN echo "AUTH_GOOGLE_ID: ${AUTH_GOOGLE_ID}"
RUN echo "AUTH_GOOGLE_SECRET: ${AUTH_GOOGLE_SECRET}" > .env.production
RUN cat  .env.production
# ... rest of your builder stage ...