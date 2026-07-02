# Conversations (Room + Session inbox)

| Method | Path | Mô tả |
|--------|------|--------|
| GET | `/api/conversations` | Sidebar list |
| POST | `/api/conversations` | `{ type: room \| session, title, description? }` |
| GET | `/api/conversations/:id` | Meta by id — `type` quyết định room vs session |

Hash web: `#conversationId` (không prefix).

## Authorization — 1 checkpoint duy nhất

Mọi truy cập theo id đi qua `ConversationAccessService.assert(userId, conversationId)` (`conversation-access.service.ts`).

- **MVP (Vòng 1):** owner-only — `where { id, userId }`, không tìm thấy → `NotFoundException`.
- **Seam:** thêm `ConversationMember` (Vòng 2) / workspace RBAC (Vòng 3) → **chỉ sửa method `assert`**, service/controller không đổi.
- **Quy tắc:** không rải `where userId` trong service — luôn gọi `access.assert()`.
