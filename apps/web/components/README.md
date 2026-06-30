# `components/`

UI **dumb** — nhận props hoặc đọc store qua hook ở `app/` / `ClientXxxPage`.

## Subfolders

| Folder | Vai trò |
|--------|---------|
| [`ui/`](./ui/README.md) | Design system — Button, Input, Spinner |
| [`layout/`](./layout/README.md) | AppShell, SplitPane, Composer chrome |
| [`chat/`](./chat/README.md) | MessageList, Bubble, StreamText, ApprovalInline |

## Quy ước

- Mỗi component = folder `Name/Name.tsx` + `Name.module.css`.
- Named export. Storybook `.stories.tsx` cạnh component (`ui/`, `layout/`, `chat/`).
- **Cấm** gọi `lib/api`, `lib/stream` — parent/hook lo data.
