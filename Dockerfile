# syntax=docker/dockerfile:1.7

#############################################
# Stage 1 — Backend deps + prisma generate  #
#############################################
FROM node:20-alpine AS backend
RUN apk add --no-cache openssl
WORKDIR /app/server

COPY server/package*.json ./
RUN npm ci --omit=dev

COPY server/prisma ./prisma
RUN npx prisma generate

COPY server/ .

#############################################
# Stage 2 — Frontend build (Vite)           #
#############################################
FROM node:20-alpine AS frontend
WORKDIR /app/client

COPY client/package*.json ./
RUN npm ci

COPY client/ .

# Leave empty at build time → frontend uses relative /api/* at runtime
# (Express in the production image serves both API and static files.)
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

#############################################
# Stage 3 — Production runtime              #
#############################################
FROM node:20-alpine AS production

# tini = proper PID 1, openssl for Prisma, wget for HEALTHCHECK
RUN apk add --no-cache tini openssl wget

# Run as unprivileged user
RUN addgroup -S moji && adduser -S moji -G moji

WORKDIR /app

# Backend (with installed prod deps + generated prisma client)
COPY --from=backend --chown=moji:moji /app/server ./server

# Frontend static build — Express serves this in production
COPY --from=frontend --chown=moji:moji /app/client/dist ./client/dist

USER moji

ENV NODE_ENV=production \
    PORT=5001

EXPOSE 5001

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5001/api/health || exit 1

LABEL org.opencontainers.image.title="Moji" \
      org.opencontainers.image.description="Anime-aesthetic D2C apparel store (React + Express + Supabase + Pollinations)" \
      org.opencontainers.image.source="https://github.com/monarch1w/moji" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.authors="Rahul Gupta"

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server/src/index.js"]
