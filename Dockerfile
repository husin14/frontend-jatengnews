# syntax=docker.io/docker/dockerfile:1

FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build Next.js
RUN npm run build




# Production image, copy all the files and run next
FROM base AS runner

RUN apk update
RUN apk add --no-cache nginx
RUN apk add --no-cache supervisor

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

WORKDIR /app

# RUN rm /etc/nginx/conf.d/default.conf
RUN mkdir -p \
    /var/cache/nginx \
    /var/run/nginx \
    /var/log/nginx \
 && chown -R nextjs:nodejs \
    /var/cache/nginx \
    /var/run/nginx \
    /var/log/nginx

RUN mkdir -p /var/lib/nginx/logs \
 && chown -R nextjs:nodejs /var/lib/nginx
RUN rm -f /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /tmp/nginx \
 && chown -R nextjs:nodejs /tmp/nginx

COPY supervisord.conf /etc/supervisord.conf

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=deps --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=deps --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=deps /app/.next/standalone ./
COPY --from=deps /app/.next/static ./.next/static

# RUN chmod -R 0555 /app
USER nextjs

EXPOSE 8080

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]