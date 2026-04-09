# ---- Backend Build ----
FROM node:20-alpine AS backend

RUN apk add --no-cache openssl

WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --omit=dev
COPY server/ .
RUN npx prisma generate

EXPOSE 5001
CMD ["node", "src/index.js"]

# ---- Frontend Build ----
FROM node:20-alpine AS frontend-build

WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ .
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ---- Production (serves both) ----
FROM node:20-alpine AS production

RUN apk add --no-cache tini
WORKDIR /app

# Copy backend
COPY --from=backend /app/server ./server
COPY --from=backend /app/server/node_modules ./server/node_modules

# Copy frontend dist
COPY --from=frontend-build /app/client/dist ./client/dist

# Install serve for static files
RUN npm install -g serve

# Copy startup script
COPY scripts/docker-start.sh /app/docker-start.sh
RUN chmod +x /app/docker-start.sh

EXPOSE 5001 3000

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["/app/docker-start.sh"]
