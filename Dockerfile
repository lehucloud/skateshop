FROM node:18-alpine AS builder
WORKDIR /app
ENV AUTH_GOOGLE_ID=${AUTH_GOOGLE_ID}
ENV AUTH_GOOGLE_SECRET=${AUTH_GOOGLE_SECRET}
RUN echo "AUTH_GOOGLE_ID: ${AUTH_GOOGLE_ID}"
RUN echo "AUTH_GOOGLE_SECRET: ${AUTH_GOOGLE_SECRET}" > /app/env_test.txt
# ... rest of your builder stage ...