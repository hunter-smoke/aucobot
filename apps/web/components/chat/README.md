# `components/chat/`

Khung chat kiểu Telegram — presentational, nhận data qua props (mock-first).

## Cấu trúc

```text
ChatArea/       ghép ChatHeader + MessageList + Composer (nhận conversation + messages + onSend)
├── ChatHeader/     avatar + tên + badge type · nút Thông tin · menu ⋮ (Dropdown) · ← back
├── MessageList/    cuộn, nhóm theo ngày (DateDivider), gộp cụm cùng người, auto-scroll, empty
│   ├── DateDivider/    "Hôm nay" · "Hôm qua" · "24/06/2026"
│   ├── MessageBubble/  user (phải) · agent (trái) · system (giữa); agent dùng ChatMarkdown
│   ├── TypingIndicator/    agent đang nghĩ — 3 chấm nhảy
│   └── AgentActivityCard/  agent đang làm việc — timeline nhiều bước, icon theo loại
│                           (web_search/read_document/write_content/build_workflow/
│                            schedule/publish/handoff…), running/done/error + hiệu ứng chạy
└── Composer/       textarea auto-grow · Enter gửi / Shift+Enter xuống dòng · nút gửi

ChatMarkdown/   markdown an toàn (react-markdown + remark-gfm + rehype-sanitize)
```

Trạng thái agent hiện cuối thread qua prop `agentState` của `MessageList`/`ChatArea`:
`{ kind: "idle" | "thinking" | "working"; activities? }` (type `AgentState` trong `@/types/chat`).

## Quy ước

- Không fetch / không store — `messages`, `conversation`, callback (`onSend`, `onOpenInfo`…) truyền từ ngoài vào.
- Type UI: `@/types/chat` (`Message`). Contract hội thoại: `@aucobot/shared` (`ConversationResponse`).
- Mock: `@/mock/chat` (`mockThreadMessages`). Format giờ: `@/utils/chat/format-time`.
- Mỗi component có `.stories.tsx` cạnh bên (`pnpm storybook`).

## Chưa làm (💡 phase sau)

Streaming/typing indicator, scroll-to-bottom button, tool activity, approval inline, job status, composer nâng cao (slash menu, đính kèm, chọn model).
