# `components/chat/`

UI chat tái dùng — trung tâm UX (thay dashboard).

## Planned components

| Component | Mô tả |
|-----------|--------|
| `MessageList/` | Danh sách bubble, virtual scroll sau |
| `MessageBubble/` | User / agent / system message |
| `StreamText/` | Render chunk đang stream |
| `ApprovalInline/` | Card duyệt bài trong thread |
| `JobStatusLine/` | “Đã hẹn 18:00”, “Đã đăng” |
| `ChatMarkdown/` | Markdown an toàn (rehype-sanitize) |

Data từ `stores/message` (selector) — không tự subscribe stream.
