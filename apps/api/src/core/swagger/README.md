# `swagger/` — OpenAPI / Swagger UI

> **✅ Implemented** — Dev & staging API docs.

## URL

| Path | Ghi chú |
|------|---------|
| `/api/docs` | Swagger UI (global prefix `api` + path `docs`) |

Tắt: `SWAGGER_ENABLED=false` → `setupSwagger` no-op.

## Files

| File | Vai trò |
|------|---------|
| `setup-swagger.ts` | `DocumentBuilder`, cookie auth scheme, `nestjs-zod` cleanup |

Gọi từ `main.ts` sau `setGlobalPrefix("api")`.

## Auth trong Swagger

- Scheme: **cookie** `access_token` (JWT 15m)
- Mô tả refresh flow: `POST /api/auth/refresh`, `GET /api/auth/session`

## Quy tắc

- Controller mới: thêm `@ApiTags`, `@ApiOperation`, DTO Zod → schema tự sinh qua `nestjs-zod`.
- **Không** commit secret thật vào mô tả OpenAPI.
