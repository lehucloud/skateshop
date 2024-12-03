FROM node:18-alpine AS builder
WORKDIR /app

COPY .env.production ./
# ENV GOOGLE_ID=3
# ENV GOOGLE_SECRET=4
RUN echo "AUTH_GOOGLE_ID: ${GOOGLE_ID}"
RUN echo "AUTH_GOOGLE_SECRET: ${GOOGLE_SECRET}" > .env.production
RUN cat  .env.production
# ... rest of your builder stage ...