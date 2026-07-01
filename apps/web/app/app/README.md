# `app/app/` — Chat shell (`app.aucobot.com`)

Một route `/` — phòng chat chọn qua **hash** (giống Telegram Web A).

## URL

| URL | Mô tả |
|-----|--------|
| `app.aucobot.com/` | Shell: list thread, chưa chọn phòng |
| `app.aucobot.com/#1244557231` | Chat department `1244557231` |

Không dùng `/c/[departmentId]`.

## Files

```text
app/app/
  layout.tsx
  page.tsx                          # RSC auth guard → ClientAppShell
  _components/ClientAppShell/         # 2 cột: panel + chat
```

## Hash routing

- `hooks/thread/use-department-id-from-hash.ts`
- `utils/chat/department-hash.ts`

## Sau này

- `use-thread-list` → thay placeholder threads
- `components/chat/*` + `components/layout/Composer` trong panel chat
- WebSocket reconnect khi `hashchange`
