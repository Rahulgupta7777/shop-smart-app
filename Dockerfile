# ---- Backend build ----
FROM node:20-alpine AS backend
RUN apk add --no-cache openssl
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --omit=dev
COPY server/ .
RUN npx prisma generate

# ---- Frontend build ----
FROM node:20-alpine AS frontend
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ .
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ---- Production (Express serves API + static client) ----
FROM node:20-alpine
RUN apk add --no-cache tini openssl
WORKDIR /app
COPY --from=backend /app/server ./server
COPY --from=frontend /app/client/dist ./client/dist
ENV NODE_ENV=production
EXPOSE 5001
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server/src/index.js"]
