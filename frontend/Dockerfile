# Use the current Active LTS lightweight image
FROM node:24-alpine

# Enable corepack to automatically use pnpm@11.21.0 defined in package.json
RUN corepack enable pnpm

WORKDIR /app

# Copy package files (targeting pnpm-lock.yaml instead of package-lock.json)
COPY package.json pnpm-lock.yaml* ./

# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of your frontend application code
COPY . .

# Expose the default Next.js port
EXPOSE 3000

# Start Next.js in development mode
CMD ["pnpm", "dev"]