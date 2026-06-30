# `lib/`

Client I/O — **transport & parse**, không React, không business rules.

## Giao thức (đã chốt)

| Subfolder | Giao thức | Vai trò |
|-----------|-----------|---------|
| [`http/`](./http/README.md) | HTTP | Transport, cookie, RSC `server-api` |
| [`api/`](./api/README.md) | REST | Mirror `apps/api` — Zod parse |
| [`stream/`](./stream/README.md) | **WebSocket** | Push: stream agent, job, approval |

Không GraphQL. Không SSE.

## Luồng

```text
User action     → lib/http → lib/api → API
Server push     → lib/stream → hooks → stores
```

`lib/api` **cấm** import `server-api`, React, stores.  
`lib/stream` **cấm** import React, stores, `lib/api`.
