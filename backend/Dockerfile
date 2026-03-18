# ---- Development stage ----
    FROM node:24-alpine AS development
    WORKDIR /app
    RUN corepack enable
    COPY package.json pnpm-lock.yaml ./
    RUN pnpm install
    COPY . .
    EXPOSE 3000
    CMD ["pnpm", "start:dev"]
    
    # ---- Build stage ----
    FROM node:24-alpine AS builder
    WORKDIR /app
    RUN corepack enable
    COPY package.json pnpm-lock.yaml ./
    RUN pnpm install
    COPY . .
    RUN echo "DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy" > .env && npx prisma generate
    RUN pnpm build
    
    # ---- Production stage ----
    FROM node:24-alpine AS production
    WORKDIR /app
    RUN corepack enable
    COPY package.json pnpm-lock.yaml ./
    RUN pnpm install --prod
    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/prisma ./prisma
    COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
    RUN rm -f .env
    EXPOSE 3000
    CMD ["node", "dist/src/main"]
    