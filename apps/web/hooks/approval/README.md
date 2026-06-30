# `hooks/approval/`

## Planned files

| File | Vai trò |
|------|---------|
| `use-approval-action.ts` | `approvalsApi.approve(id)` / `reject(id)` — chờ WS/event cập nhật store |

UI không tự đổi trạng thái `pending → approved`; chỉ optimistic optional nếu API hỗ trợ idempotency.
