
FROM node:22-alpine AS builder
WORKDIR /app
# files needed for dependency installation
COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig.json ./
# Install dependencies and generate Prisma client

RUN npm install && npx prisma generate
RUN npx prisma migrate
# Copy the rest of the source and build
COPY ./src ./src
RUN npm run build

# Stage 2: Production
FROM node:22-alpine
WORKDIR /app
# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm install
# Copy Prisma client and schema
COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma /app/node_modules/@prisma
COPY --from=builder /app/prisma ./prisma
# Copy compiled app
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 8080
# Optional health check (adjust  app's health endpoint)
HEALTHCHECK --interval=30s --timeout=3s CMD node dist/healthcheck.js 
CMD ["npm", "start"]

