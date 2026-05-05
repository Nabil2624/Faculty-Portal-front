FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build


FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/build ./build