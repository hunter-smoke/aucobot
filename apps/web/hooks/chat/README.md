# `hooks/chat/`

## Planned files

| File | Vai trò |
|------|---------|
| `use-message-stream.ts` | `lib/stream` (WebSocket) → `onEvent` → `messageStore.appendChunk` |
| `use-send-message.ts` | Composer → `lib/api/messages.send()` (REST) → chờ WS events |

## Pattern

```text
REST POST  → API bắt đầu agent
WS message.chunk / message.done  → store patch
WS job.status / approval.updated   → store patch (cùng socket)
disconnect / reconnect → connectionStore
```

Không merge agent logic; không tự approve.
