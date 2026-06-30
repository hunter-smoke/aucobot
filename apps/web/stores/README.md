# `stores/`

**Zustand** — buffer stream + projection state từ server. **Không** business logic.

## Domains

| Folder | Lưu gì |
|--------|--------|
| [`message/`](./message/README.md) | Messages, stream chunks, finalize |
| [`thread/`](./thread/README.md) | Thread list, `selectedDepartmentId` |
| [`connection/`](./connection/README.md) | `wsStatus`, reconnect count |
| [`auth-flow/`](./auth-flow/README.md) | `/login` step `email` \| `code` (UI only) |

## Quy tắc

- Selector bắt buộc: `useMessageStore((s) => s.messages)`.
- Actions kiểu: `appendChunk`, `setMessages`, `setConnectionStatus`.
- **Không** `approveAndSchedule()` — hook gọi API, event cập nhật store.
- **Cấm** import `lib/api`, `lib/stream`.
