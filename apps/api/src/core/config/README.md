# `config/` — Environment & app configuration

> **✅ Implemented** — Một nguồn default cho mọi env.

## Vai trò

Validate biến môi trường lúc boot và map sang key camelCase cho `ConfigService`.

## Files

| File | Vai trò |
|------|---------|
| `env.schema.ts` | Zod schema — **default chỉ khai báo ở đây** |
| `app.config.ts` | Map `DATABASE_URL` → `databaseUrl`, `JWT_SECRET` → `jwtSecret`, … |
| `config.module.ts` | `ConfigModule.forRoot` — export global |

## Quy tắc

| Làm | Không làm |
|-----|-----------|
| `configService.getOrThrow("jwtSecret")` | `get(key, "fallback")` trùng default schema |
| Thêm env mới → schema + `app.config.ts` | Default rải trong auth, strategy, service |

## Env chính (tham khảo)

| Env | Config key | Ghi chú |
|-----|------------|---------|
| `NODE_ENV` | `nodeEnv` | `development` / `production` / `test` |
| `LOG_LEVEL` | `logLevel` | `info` — Pino log level |
| `DATABASE_URL` | `databaseUrl` | PostgreSQL |
| `REDIS_URL` | `redisUrl` | OTP rate limit, queue sau |
| `JWT_SECRET` | `jwtSecret` | Access token |
| `ENABLED_FEATURES` | `enabledFeatures` | CSV feature plugin |
| `SWAGGER_ENABLED` | `swaggerEnabled` | `/api/docs` |

Danh sách đầy đủ: `env.schema.ts`.
