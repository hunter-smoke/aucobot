# `components/sidebar/`

Sidebar chat kiểu Zalo/Telegram — presentational, nhận data qua props (mock-first).

## Cấu trúc

```text
Sidebar/            ghép rail + main (giữ state rail view)
├── SidebarRail/    thanh dọc hẹp: avatar user + nav icons + cài đặt
└── SidebarMain/    cột chính: header + SearchBar + ConversationList (lọc client)
    ├── SearchBar/         input tìm kiếm (controlled)
    ├── ConversationList/  map items → ConversationItem, có empty state
    └── ConversationItem/  avatar, title, preview, giờ, badge chưa đọc
```

## Quy ước

- Không fetch / không Zustand — data + callback truyền từ ngoài vào.
- Type UI: `@/types/chat`. Mock: `@/mock/chat`. Format giờ: `@/utils/chat/format-time`.
- Mỗi component có `.stories.tsx` cạnh bên để xem trong Storybook (`pnpm storybook`).
