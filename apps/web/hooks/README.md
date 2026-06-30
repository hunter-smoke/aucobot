# `hooks/`

**Pipe mỏng** giữa `lib/*` và `stores/` — không logic nghiệp vụ.

## Domains

| Folder | Hooks planned |
|--------|----------------|
| [`chat/`](./chat/README.md) | `use-message-stream`, `use-send-message` |
| [`thread/`](./thread/README.md) | `use-thread-list`, `use-select-thread` |
| [`approval/`](./approval/README.md) | `use-approval-action` |
| [`auth/`](./auth/README.md) | `use-email-otp-flow` — `/login` email OTP |

## Được import

- `lib/api`, `lib/stream`, `stores/*`, `utils/*`

## Cấm

- JSX (trừ return hook factory pattern không dùng ở đây).
- Business rules (approval state machine, agent routing).
