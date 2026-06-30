# `app/(main)/`

App shell **sau đăng nhập** — UX kiểu Telegram.

## Planned routes

| Path | File | Mô tả |
|------|------|-------|
| `/` | `page.tsx` | Thread list (phòng marketing) hoặc redirect nếu MVP 1 department/user |
| `/c/[departmentId]` | `c/[departmentId]/page.tsx` | Chat full-bleed với department |

## Layout

- `layout.tsx`: shell 2 cột (desktop) / stack (mobile).
- `page.tsx` (RSC): optional `initialThreads` qua `lib/http/server-api`.
- `ClientChatPage`: mount `hooks/chat/use-message-stream`, đọc `stores/message`.

## Không làm ở đây

- Orchestrate agent, approval rules, job state — API xử lý.
