FROM node:20

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY apps ./apps
COPY packages ./packages

RUN npm install

RUN npm run build

WORKDIR /app/apps/api

CMD ["node", "dist/index.js"]