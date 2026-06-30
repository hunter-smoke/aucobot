# `stores/message/`

## Planned: `message.store.ts`

| State | Mô tả |
|-------|--------|
| `messagesByDepartmentId` | Map id → message[] |
| `streamingMessageId` | Id tin đang nhận chunk |
| `streamBuffer` | Partial text |

## Actions (chỉ projection)

- `setMessages(departmentId, messages)`
- `appendStreamChunk(messageId, chunk)`
- `finalizeStream(messageId, fullText)`
- `patchMessage(id, patch)` — từ WS event (approval, job status)
