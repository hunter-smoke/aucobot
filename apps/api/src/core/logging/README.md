# `logging/` — Structured logging (Pino)

> **✅ Implemented** — `nestjs-pino` + `LoggingService` facade.

## Vai trò

- JSON logs production (Railway / worker)
- `pino-pretty` dev — dễ đọc terminal
- Thay `console.*` — ESLint cấm `no-console` trong `src/`

## Files

| File | Vai trò |
|------|---------|
| `logging.config.ts` | `createPinoParams()` — level, transport, `requestId` binding |
| `logging.module.ts` | `LoggerModule.forRootAsync` + export `LoggingService` |
| `logging.service.ts` | Facade `LoggerService` — inject ở domain code |

## Bootstrap (`main.ts`)

```ts
app.useLogger(app.get(Logger)); // nestjs-pino — Nest internal logs
const loggingService = app.get(LoggingService); // app code
```

## API

```ts
this.loggingService.log("message", "MyService");
this.loggingService.warn("...", "RedisService");
this.loggingService.error("...", trace, "EmailService");
this.loggingService.log("GET /api/health", "LoggingInterceptor", {
  requestId: "…",
  durationMs: 12,
});
```

## Env

| Env | Config key | Default |
|-----|------------|---------|
| `LOG_LEVEL` | `logLevel` | `info` |
| `NODE_ENV` | `nodeEnv` | `development` → bật `pino-pretty` |

Giá trị `LOG_LEVEL`: `fatal` \| `error` \| `warn` \| `info` \| `debug` \| `trace`.

## HTTP logs

- `pino-http` `autoLogging: false` — request log qua `LoggingInterceptor` (có `requestId`, `durationMs`)
- `customProps` gắn `requestId` khi dùng pino-http middleware sau này
