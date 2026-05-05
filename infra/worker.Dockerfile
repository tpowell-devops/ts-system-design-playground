FROM node:20 AS base
WORKDIR /app

COPY package*.json ./
COPY apps/*/package.json ./apps/
COPY packages/*/package.json ./packages/
RUN npm install


FROM base AS builder
WORKDIR /app
COPY tsconfig.json ./
COPY tsconfig.base.json ./
COPY apps ./apps
COPY packages ./packages
RUN npm install
RUN npm run build


FROM node:20-alpine AS worker

WORKDIR /app

COPY --from=builder /app ./
#COPY --from=builder /app/node_modules ./node_modules
#COPY package*.json ./
#RUN npm install --omit=dev
#
#COPY --from=builder /app/apps/worker/dist ./apps/worker/dist
#COPY --from=builder /app/packages/shared/dist ./packages/shared/dist

CMD ["node", "apps/worker/dist/index.js"]
###########################################
# ---------- BUILD STAGE ----------
#FROM node:20 AS builder
#
#WORKDIR /app
#
## copy everything needed to build
#COPY package*.json ./
#COPY tsconfig.json ./
#COPY tsconfig.base.json ./
#COPY apps ./apps
#COPY packages ./packages
#
#RUN npm install
#RUN npm run build
#
## ---------- RUNTIME STAGE ----------
#FROM node:20-alpine
#
#WORKDIR /app
#
## copy only runtime files
#COPY package*.json ./
#RUN npm install --omit=dev
#
## copy built output only
#COPY --from=builder /app/apps/worker/dist ./apps/worker/dist
#COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
#
#CMD ["node", "apps/api/dist/index.js"]

#FROM node:20
#
#WORKDIR /app
#
#COPY package*.json ./
#COPY tsconfig.base.json ./
#COPY apps ./apps
#COPY packages ./packages
#
#RUN npm install
#RUN npm run build
####################################
#FROM node:20
#
#WORKDIR /app
#
##COPY . .
#COPY package*.json ./
##COPY tsconfig.base.json ./
#COPY apps ./apps
#COPY packages ./packages
#
#RUN npm install
#
#RUN npm run build
##-w worker
#
#WORKDIR /app/apps/worker
#
#CMD ["node", "dist/index.js"]
