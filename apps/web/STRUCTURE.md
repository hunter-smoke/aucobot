# Aucobot Web — Sơ đồ folder (kế hoạch)

> **Frontend mỏng:** Next.js + Zustand chỉ stream & hiển thị. Não nghiệp vụ ở `apps/api`.  
> **Giao thức (đã chốt):** REST + WebSocket — không GraphQL.  
> Mỗi folder có `README.md` mô tả vai trò — **chưa code** trừ MVP tạm (`app/page.tsx`, `lib/http/*`, `lib/api/auth.ts`).  
> Chi tiết rule: [`.agent/rule.md`](./.agent/rule.md) · Architecture: [`../../aucobot-architecture.md`](../../aucobot-architecture.md)

## Luồng dữ liệu

```text
apps/api (brain)
    │ REST (lệnh)     │ WebSocket (push)
    ▼                 ▼
lib/http + lib/api    lib/stream
    │                 │
    └────────┬────────┘
             ▼
hooks/<domain>                    ← pipe (không logic nghiệp vụ)
             ▼
stores/<domain>                   ← Zustand buffer stream + projection
             ▼
components/ + app/                ← render (Telegram-style)
```

## Cây thư mục

```text
apps/web/
├── STRUCTURE.md              ← file này
├── .agent/rule.md
├── app/
│   ├── (auth)/               # /login + /register — email OTP ✅
│   ├── (main)/               # app sau đăng nhập
│   │   └── c/[departmentId]/ # chat thread (1 phòng = 1 department MVP)
│   ├── setup/                # setup tối giản → gửi API
│   └── _components/          # shared app components (StatusBadge…)
├── components/
│   ├── auth/                 # AuthShell, EmailStep, OtpStep ✅
│   ├── ui/                   # Button, Input, OtpInput…
│   ├── layout/               # AppShell, SplitPane, Composer
│   └── chat/                 # MessageList, Bubble, StreamText
├── hooks/
│   ├── chat/                 # use-message-stream, use-send-message
│   ├── thread/               # use-thread-list
│   └── approval/             # use-approval-action
├── lib/
│   ├── http/                 # client, server-api, api-base-url ✅ một phần
│   ├── api/                  # mirror REST API ✅ auth.ts
│   └── stream/               # WebSocket agent-stream-client
├── stores/
│   ├── auth-flow/            # OTP step state ✅
│   ├── message/              # buffer tin + stream chunks
│   ├── thread/               # danh sách phòng + selection
│   └── connection/           # WS status, reconnect
├── schemas/                  # wrap @aucobot/shared ✅ một phần
├── utils/
│   ├── chat/                 # merge chunks, format bubble
│   └── format/               # time, locale display
├── public/
├── scripts/                  # dev/CI tooling
├── proxy.ts                  # (planned) auth guard edge
├── eslint.config.mjs         ✅
└── next.config.ts            ✅
```

## REST vs WebSocket

| | REST (`lib/api`) | WebSocket (`lib/stream`) |
|---|------------------|---------------------------|
| Hướng | Client → server (lệnh) | Server → client (push) |
| Ví dụ | Gửi tin, duyệt, setup | `message.chunk`, `job.status` |
| MVP code | `auth.ts` ✅ | 🔜 chờ API gateway |

## Trạng thái implement

| Folder | Trạng thái |
|--------|------------|
| `lib/http/`, `lib/api/auth.ts`, `schemas/` | ✅ |
| `app/(auth)/`, `components/auth/`, `stores/auth-flow/` | ✅ Email OTP |
| `app/page.tsx` | Guest redirect → `/login` |
| Còn lại (chat, stream) | Chỉ `README.md` — chờ API contract |

## UX định hướng

Telegram-style: list thread (phòng marketing) | chat full-bleed. Không dashboard AI SaaS.
