# `hooks/thread/`

Client hooks cho sidebar inbox + hash routing.

| File | Mô tả |
|------|--------|
| `use-conversation-id-from-hash.ts` | Đọc / set `window.location.hash` ✅ |
| `use-conversation-list.ts` | `conversationsApi.list()` ✅ |
| `use-active-conversation.ts` | `conversationsApi.getById()` theo hash ✅ |

Hash: `#<conversationId>` — `type` (`room` \| `session`) lấy từ API, không encode trong URL.
