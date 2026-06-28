# Features

Thư mục plugin theo domain — **chưa implement code**, chỉ giữ layout đã thống nhất.

| Thư mục | Vai trò |
|---------|---------|
| `tools/` | MCP tools thuần app |
| `integrations/` | API key platform (Tavily, …) |
| `channels/` | OAuth social (Facebook, TikTok, …) |
| `workflow/` | Queue / jobs (publish, approvals, …) |
| `ai-orchestration/` | LLM / agent chat |

**MVP hiện tại:** API chỉ có `core/auth` + `core/health`. Thêm plugin khi được yêu cầu — đăng ký qua `core/plugins` (planned).

Xem `aucobot-architecture.md`.
