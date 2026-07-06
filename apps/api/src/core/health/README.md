# `health/` — Liveness & readiness

> **✅ Implemented** — Public endpoint cho deploy / monitoring.

## Endpoint

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/health` | `@Public()` |

## Response (`HealthResponse` từ `@aucobot/shared`)

```json
{
  "status": "ok",
  "timestamp": "2026-07-06T12:00:00.000Z",
  "database": "connected"
}
```

- `status`: `ok` khi DB `connected`, ngược lại `error`
- `database`: `connected` \| `disconnected` — `SELECT 1` qua Prisma

## Files

| File | Vai trò |
|------|---------|
| `health.controller.ts` | Route handler |
| `health.service.ts` | DB ping |
| `health.module.ts` | Module wiring |

## Sau MVP

Có thể thêm Redis ping (`@nestjs/terminus`) khi BullMQ bắt buộc.
