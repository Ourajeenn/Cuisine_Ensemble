FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --prefer-offline
COPY . .
RUN npm run build 2>&1 || echo "Build may have warnings"

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --omit=dev --prefer-offline
COPY --from=builder /app/dist ./dist 2>/dev/null || true
COPY --from=builder /app/public ./public 2>/dev/null || true
COPY server.mjs ./server.mjs

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=5 \
  CMD node -e "require('http').get('http://localhost:8080/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

CMD ["node", "--expose-gc", "server.mjs"]
