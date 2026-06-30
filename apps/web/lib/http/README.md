# `lib/http/`

HTTP transport — **không** biết department, message, approval.

## Files

| File | Trạng thái | Mô tả |
|------|------------|-------|
| `api-base-url.ts` | ✅ | `NEXT_PUBLIC_API_URL` |
| `server-api.ts` | ✅ | RSC fetch + `cache: no-store` |
| `fetch-with-auth.ts` | ✅ | Cookie refresh — **sẽ gộp** → `client.ts` |
| `health-server.ts` | ✅ | Helper health RSC — **sẽ move** logic sang `lib/api` |
| `client.ts` | 🔜 | HTTP client duy nhất (fetch hoặc axios) |

## Chỉ import từ

- RSC / `middleware` / `proxy.ts` (`server-api`)
- `lib/api/*`, `lib/stream/*` (`client`, `fetch-with-auth`)
