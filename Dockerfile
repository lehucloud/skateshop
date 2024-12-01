# Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY /data/env.example ./.env

RUN npm install
COPY . .

RUN npm run build
EXPOSE 8080
CMD ["npm", "start"]


