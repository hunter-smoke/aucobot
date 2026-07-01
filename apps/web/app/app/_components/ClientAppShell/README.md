# `ClientAppShell`

Shell chat **Telegram-style** trên `app.aucobot.com/` — một route, phòng chọn qua **hash**.

## URL

```text
app.aucobot.com/              → list thread, chưa chọn phòng
app.aucobot.com/#1244557231   → chat department `1244557231`
```

Giống Telegram Web A (`web.telegram.org/a/#…`).

## Trách nhiệm

- `data-chat-shell` — document không scroll (`globals.css`).
- Cột trái: thread list (`components/layout/ThreadList` sau).
- Giữa: chat panel theo `useDepartmentIdFromHash`.
- Mount stream hooks khi có API.

## Không làm

- Route `/c/[departmentId]` — đã bỏ, dùng hash.
- Gọi `lib/api` trực tiếp — qua hooks.
