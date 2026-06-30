# `app/(main)/c/[departmentId]/`

Màn **chat** cho một phòng marketing (department).

## Planned files

```text
c/[departmentId]/
├── page.tsx                          # RSC shell + initialMessages?
├── page.module.css
└── _components/
    └── ClientChatPage/
        ├── ClientChatPage.tsx
        ├── ClientChatPage.module.css
        └── README.md
```

## Data flow

```text
page.tsx (RSC) → initialMessages (optional)
ClientChatPage → use-message-stream → lib/stream → stores/message
Composer submit → use-send-message → lib/api/messages → API → stream events
```

## URL param

- `departmentId` — validate qua API trước khi render (§1.2 rule).
