FROM node:20-alpine AS base

FROM base AS server-deps
WORKDIR /app/server
COPY apps/server/package*.json ./
COPY apps/server/prisma ./prisma/
RUN npm install

FROM base AS web-deps
WORKDIR /app/web
COPY apps/web/package*.json ./
RUN npm install

FROM server-deps AS server
COPY apps/server ./
RUN npx prisma generate
RUN npm run build

FROM web-deps AS web
COPY apps/web ./
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=server /app/server/dist ./server/dist
COPY --from=server /app/server/node_modules ./server/node_modules
COPY --from=server /app/server/prisma ./server/prisma
COPY --from=web /app/web/.next/standalone ./web/
COPY --from=web /app/web/.next/static ./web/.next/static
COPY --from=web /app/web/public ./web/public
COPY --from=web /app/web/next.config.mjs ./web/next.config.mjs
EXPOSE 5000 3000
CMD ["sh", "-c", "cd server && npx prisma migrate deploy & cd ../web && node server.js"]
