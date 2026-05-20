# Stage 1: Build
FROM node:20-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install all dependencies (including dev)
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY tsconfig.json ./
COPY src ./src/

# Build TypeScript
RUN npm run build

# Copy non-TS assets (HTML templates, etc.) that tsc doesn't emit
RUN cp -r src/services/video/templates dist/services/video/templates 2>/dev/null || true

# Stage 2: Production
FROM node:20-slim AS production

# Install Puppeteer dependencies (Chromium), ffmpeg, and Arabic fonts
RUN apt-get update && apt-get install -y \
  chromium \
  ffmpeg \
  fonts-noto-cjk \
  fonts-noto-color-emoji \
  fonts-freefont-ttf \
  fonts-hosny-amiri \
  openssl \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

# Copy package files and install production deps only
COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm ci --omit=dev

# Generate Prisma client in production
RUN npx prisma generate

# Copy built application
COPY --from=builder /app/dist ./dist/

# Copy public folder (coursebook images and other static assets)
COPY public ./public/

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/index.js"]
