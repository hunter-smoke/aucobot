# `core/` — Nền tảng API (luôn chạy)

NestJS modules **bắt buộc** — tắt feature plugin (`src/features/`) không làm sập API.

`app.module.ts` nạp `CoreModule` + `loadEnabledFeatures()`.

## Lớp 1 — Infrastructure

| Folder | Trạng thái | Vai trò |
|--------|------------|---------|
| [`common/`](./common/README.md) | ✅ | Decorators, filters, interceptors, middleware — không business logic |
| [`config/`](./config/README.md) | ✅ | Env validation (Zod), map env → `ConfigService` |
| [`database/`](./database/README.md) | ✅ | `PrismaService` — PostgreSQL |
| [`logging/`](./logging/README.md) | ✅ | Pino (`nestjs-pino`) + `LoggingService` facade |
| [`health/`](./health/README.md) | ✅ | `GET /api/health` |
| [`redis/`](./redis/README.md) | ✅ | ioredis client + key namespaces |
| [`email/`](./email/README.md) | ✅ | Gửi email OTP (Resend) |
| [`swagger/`](./swagger/README.md) | ✅ | OpenAPI UI `/api/docs` |
| [`features/`](./features/README.md) | ✅ | Feature toggle `ENABLED_FEATURES` + loader |

## Lớp 2 — Identity

| Folder | Trạng thái | Vai trò |
|--------|------------|---------|
| [`auth/`](./auth/README.md) | ✅ | OTP email, Google OAuth, JWT cookie |
| [`users/`](./users/README.md) | 💡 | User CRUD / profile admin |

## Lớp 3 — Plugin platform

| Folder | Trạng thái | Vai trò |
|--------|------------|---------|
| [`plugins/`](./plugins/README.md) | 💡 | `FeaturePlugin` interface, registry |
| [`events/`](./events/README.md) | 💡 | Event bus — feature không import nhau |
| [`audit/`](./audit/README.md) | 💡 | Audit log |
| [`queue/`](./queue/README.md) | 💡 | BullMQ connection + factory |

## Lớp 4 — Domain shell

| Folder | Trạng thái | Vai trò |
|--------|------------|---------|
| [`conversations/`](./conversations/README.md) | ✅ | Room + Session CRUD |
| [`agents/`](./agents/README.md) | 💡 | Agent registry, tool allowlist |
| [`realtime/`](./realtime/README.md) | 💡 | WebSocket gateway |

Chi tiết kiến trúc: [`aucobot-architecture.md`](../../../../aucobot-architecture.md).
