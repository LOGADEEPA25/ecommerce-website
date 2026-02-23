# ── Frontend Dockerfile ──────────────────────────────────────────────
FROM node:18-slim

WORKDIR /app

# Install deps first (layer-caching)
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy source
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
