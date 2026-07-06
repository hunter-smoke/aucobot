# `common/` — Cross-cutting HTTP utilities

> **✅ Implemented** — Global module, không chứa business logic.

## Vai trò

Thành phần dùng chung cho mọi request HTTP — decorators, exception handling, logging request, middleware.

## Files

| Path | Vai trò |
|------|---------|
| `decorators/current-user.decorator.ts` | `@CurrentUser()` — user từ JWT sau guard |
| `decorators/public.decorator.ts` | `@Public()` — bỏ qua `JwtAuthGuard` |
| `filters/http-exception.filter.ts` | Chuẩn hóa response lỗi HTTP |
| `interceptors/logging.interceptor.ts` | Log method, path, status, duration |
| `middleware/request-id.middleware.ts` | Gán `X-Request-Id` cho trace |
| `utils/get-client-ip.util.ts` | IP client (proxy-aware) — OTP rate limit |
| `common.module.ts` | Global: filter + interceptor + export middleware |

## Quy tắc

- **Không** import `features/**`, Prisma, hoặc domain service.
- Controller dùng decorator từ đây; logic nghiệp vụ ở `service/` của module tương ứng.

Xem [`apps/api/.agent/rule.md`](../../../.agent/rule.md) — kiến trúc import.
