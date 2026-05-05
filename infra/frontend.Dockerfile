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
WORKDIR /app/apps/frontend
RUN npm run build

FROM node:20 AS frontend
WORKDIR /app

COPY package*.json ./
COPY apps/frontend ./apps/frontend
RUN ls -l ./apps/frontend
COPY packages ./packages
#RUN npm install
#RUN npm run build -w frontend


FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
# Copy custom config
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/

# Copy built frontend
#COPY dist/ /usr/share/nginx/html
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html
#COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
#################################################
## Stage 1: Build React app
#FROM node:20-alpine AS builder
#
#WORKDIR /app
#
## Copy package.json and install dependencies
#COPY package*.json ./
#COPY apps/frontend/package*.json ./apps/frontend/
#COPY packages/*/package.json ./packages/
#RUN npm install --workspaces
#
## Copy all source files
#COPY . .
#
## Build the app for production
#WORKDIR /app/apps/frontend
#RUN npm run build
#
## Stage 2: Serve with Nginx
#FROM nginx:alpine
#
## Remove default nginx static files
#RUN rm -rf /usr/share/nginx/html/*
#
## Copy built files from builder
#COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html
#
#RUN ls /etc/nginx/conf.d/default.conf
#RUN rm /etc/nginx/conf.d/default.conf
## Copy custom nginx config
#COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf
#
## Expose port
#EXPOSE 80
#
## Start Nginx
#CMD ["nginx", "-g", "daemon off;"]
#####################################
## ==========================
## Stage 1: Base (install dependencies)
## ==========================
#FROM node:20 AS base
#WORKDIR /app
#
## Copy package.json and lockfiles for root and frontend
#COPY package*.json ./
#COPY apps/frontend/package*.json ./apps/frontend/
#COPY packages/*/package.json ./packages/
#
##RUN cat ./package.json
##RUN cat ./packages/package.json
##RUN cat ./apps/frontend/package.json
#
## Install dependencies (workspaces)
#RUN npm install
#
## ==========================
## Stage 2: Build frontend
## ==========================
#FROM base AS builder
#WORKDIR /app
#
## Copy frontend source code
#COPY apps/frontend ./apps/frontend
#RUN ls ./apps/frontend
## Copy shared packages
#COPY packages/ ./packages
#
## Copy tsconfigs
#COPY tsconfig*.json ./
#RUN npm install
#
#COPY . .
## Build the frontend -> dist/
#RUN npm run build -w ./apps/frontend
#RUN ls -R apps/frontend/dist
## ==========================
## Stage 3: Serve via nginx
## ==========================
#FROM nginx:alpine
#WORKDIR /usr/share/nginx/html
#
## Remove default config
#RUN rm /etc/nginx/conf.d/default.conf
#
## Copy custom nginx config
#COPY apps/frontend/nginx.conf /etc/nginx/conf.d/
#
## Copy built frontend from builder
#COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html
#
## Expose HTTP port
##EXPOSE 80
#
## Start nginx
#CMD ["nginx", "-g", "daemon off;"]
###################################
#FROM node:20 AS build
#
#WORKDIR /app
#
#COPY package*.json ./
#COPY tsconfig.base.json ./
#COPY apps ./apps
#COPY packages ./packages
#
#RUN npm install
#RUN npm run build -w frontend
#
## serve static files
#FROM nginx:alpine
#
#COPY --from=build /app/apps/frontend/dist /usr/share/nginx/html
#
#CMD ["nginx", "-g", "daemon off;"]
##########################################
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
#
##RUN pwd
##RUN ls -la
##RUN npm prefix
##RUN cat package.json
#
#RUN npm run build
#############################################
#FROM node:20 as build

#WORKDIR /app
#
#COPY package*.json ./
#COPY packages ./packages
#COPY apps ./apps
#
#RUN npm install
#
## IMPORTANT: run from frontend directory, NOT workspace
#WORKDIR /app/apps/frontend
#
#COPY apps/frontend ./
#
#RUN npm run build
##-w frontend
#
#FROM nginx:alpine
#
#COPY --from=build /app/apps/frontend/dist /usr/share/nginx/html
#
#EXPOSE 80
#
#CMD ["nginx", "-g", "daemon off;"]