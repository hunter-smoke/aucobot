# `ClientChatPage`

Client component chính của màn chat.

## Trách nhiệm

- Mount hooks stream (`hooks/chat/`).
- Selectors Zustand (`stores/message`, `stores/connection`).
- Compose `components/chat/*` + `components/layout/Composer`.

## Cấm

- Gọi `lib/api` / `lib/stream` trực tiếp — qua hooks.
- Logic approval / agent orchestration.
