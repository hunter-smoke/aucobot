# `stores/connection/`

## Planned: `connection.store.ts`

| State | Mô tả |
|-------|--------|
| `status` | `idle` \| `connecting` \| `connected` \| `disconnected` |
| `lastError` | Message hiển thị user (chung, không stack) |

Dùng bởi `hooks/chat/use-message-stream` + indicator UI nhỏ (không modal).
