# syntax=docker/dockerfile:1.7
FROM node:24.22.1-bookworm-slim@sha256:55fb5f5a527ea2c5c4a95f963e48ef90aa38c7b346054fdc8ee9957a2b55d205 AS base
WORKDIR /app
RUN npm install --global pnpm@11.28.6 && npm cache clean --force

FROM base AS dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,target=/app/.cache/pnpm pnpm install --frozen-lockfile

FROM dependencies AS build
COPY . .
# Build secrets are ephemeral mounts; never ARG/ENV or copied .env files.
RUN --mount=type=secret,id=build_env,target=/app/.env.local,required=true pnpm build

FROM dependencies AS operations
RUN apt-get update && apt-get install -y --no-install-recommends poppler-utils && rm -rf /var/lib/apt/lists/*
COPY src ./src
COPY scripts ./scripts
COPY tsconfig.json ./
ENV NODE_ENV=production CMS_ADMIN_ENABLED=false PUBLIC_RELEASE=true CMS_LOCAL_REVIEW=false CMS_UPLOAD_DIRECTORY=/app/uploads
RUN mkdir -p /app/.cache/native /app/uploads && chown -R node:node /app/.cache /app/uploads
USER node
# Supply runtime secrets and execute migrations/rebuild before replacing the web instance.
CMD ["pnpm", "cms:migrate"]

FROM node:24.22.1-bookworm-slim@sha256:55fb5f5a527ea2c5c4a95f963e48ef90aa38c7b346054fdc8ee9957a2b55d205 AS runtime
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends poppler-utils chromium && rm -rf /var/lib/apt/lists/*
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
RUN mkdir -p /app/.next/cache /app/uploads && chown -R node:node /app/.next/cache /app/uploads
ENV PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/chromium
ENV NODE_ENV=production HOSTNAME=0.0.0.0 PORT=3000 CMS_ADMIN_ENABLED=false CMS_LOCAL_REVIEW=false PUBLIC_RELEASE=true CMS_UPLOAD_DIRECTORY=/app/uploads
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s CMD node -e "fetch('http://127.0.0.1:3000/fr',{redirect:'manual'}).then(r=>process.exit(r.status===200?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.js"]
