# ----------- 1. Build Stage -----------
FROM node:18-alpine AS builder

# Install dependencies to compile native binaries (needed for Prisma)
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Install deps separately for caching
COPY package*.json ./
RUN npm ci

# Copy all files and build the Next.js app
COPY . .

# Generate Prisma client
RUN npm run postinstall

# Build the Next.js app (uses TypeScript)
RUN npm run build


# ----------- 2. Production Stage -----------
FROM node:18-alpine AS runner

ENV NODE_ENV=production

# Install required dependencies
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copy only the necessary files from builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Prisma requires the generated client code in production
COPY --from=builder /app/.prisma/client ./.prisma/client

EXPOSE 3000

CMD ["npm", "start"]