FROM oven/bun:1 AS builder

WORKDIR /app
ENV SKIP_ENV_VALIDATION=1
ENV BETTER_AUTH_SECRET=build-time-placeholder-secret-not-used-at-runtime

COPY . .
RUN --mount=type=cache,target=/root/.bun/install/cache bun install

WORKDIR /app/apps/web
RUN bun run build

FROM oven/bun:1 AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3001

COPY --from=builder /app /app

EXPOSE 3001

WORKDIR /app/apps/web
CMD ["bun", "run", "start"]
