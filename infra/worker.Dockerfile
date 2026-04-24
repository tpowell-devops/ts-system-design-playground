FROM node:20

WORKDIR /app

#COPY . .
COPY package*.json ./
COPY tsconfig.json ./
COPY apps ./apps
COPY packages ./packages

RUN npm install

RUN npm run build

WORKDIR /app/apps/worker

CMD ["node", "dist/index.js"]
