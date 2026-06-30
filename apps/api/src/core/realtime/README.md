# Giao thức realtime — REST + WebSocket (đã chốt)

> Tóm tắt cho `apps/api` khi implement gateway. Chi tiết: [`aucobot-architecture.md`](../../../../aucobot-architecture.md#giao-thức-client-web-đã-chốt-rest--websocket).

## Đã chốt

- **REST** — mọi lệnh user, CRUD, snapshot
- **WebSocket** — push realtime (stream agent, job, approval)
- **Không** GraphQL, **không** SSE

## WebSocket gateway (planned)

```text
WSS /api/ws/departments/:departmentId
```

- NestJS `@nestjs/websockets` + `ws`
- Auth: cookie `httpOnly` lúc Upgrade
- Event envelope: `{ type, payload, departmentId, timestamp }` — Zod trong `@aucobot/shared`

## Event types (draft)

| `type` | Mục đích |
|--------|----------|
| `message.chunk` | Agent reply stream |
| `message.done` | Tin hoàn tất |
| `approval.updated` | Duyệt / từ chối |
| `job.status` | Lịch đăng bài |
| `ping` / `pong` | Keepalive |

## Chưa implement

Folder này chỉ là placeholder doc — gateway sống trong `apps/api/src/core/` hoặc `features/ai-orchestration/` khi có contract.
