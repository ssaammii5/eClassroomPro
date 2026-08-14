# ---------- Base ----------
FROM node:24-alpine

# Node 24 no longer reliably ships corepack, so install pnpm explicitly.
# Version matches "packageManager" in package.json.
RUN npm install -g pnpm@11.21.0

WORKDIR /app

# Copy dependency manifests first for better layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the source.
# NOTE: In development, docker-compose bind-mounts ./frontend over /app,
# so these files are replaced at runtime. We keep this COPY so the image
# also works standalone (e.g. `docker run` without volumes).
COPY . .

EXPOSE 3000

# Development server with hot reload
CMD ["pnpm", "dev"]