FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy built files and legends data
COPY dist/ ./dist/
COPY legends/ ./legends/

# Set entrypoint
ENTRYPOINT ["node", "dist/index.js"]
