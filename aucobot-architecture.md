# Aucobot — Architecture

> Tài liệu mô tả **ý tưởng giải pháp**, **key quảng cáo**, **MVP features**, **cấu trúc monorepo** và **kiến trúc kỹ thuật**.

### Ký hiệu trạng thái

| Ký hiệu | Ý nghĩa |
|---------|---------|
| **✅ Đã làm** | Đã implement trong repo — mô tả là **kiến trúc hiện tại** |
| **🔜 Phase 1** | Đang / sắp làm trong sprint chat MVP (Room + Session) |
| **💡 Ý tưởng** | Tương lai — chưa code, chỉ thiết kế / contract dự kiến |

> **Thuật ngữ:** Tên cũ **`Department`** (phòng marketing ảo) được thay bằng **`Room` (Phòng)** trong UI chat kiểu Telegram. Marketing copy vẫn dùng *“phòng marketing ảo”* — cùng concept, tên kỹ thuật gọn hơn.

---

## Giải pháp

**Aucobot** là nền tảng **AI Agent Cloud** kết nối trực tiếp các nền tảng marketing & bán hàng (Facebook, TikTok, …) qua OAuth và API chính thức.

User ra yêu cầu bằng ngôn ngữ tự nhiên → hệ thống **tự động giao việc cho AI** trong **phòng marketing ảo** riêng: đọc tài liệu, viết content, lên lịch, đăng bài, báo kết quả — không chỉ trả lời chat.

Kiến trúc **multi-agent**: user **xây dựng phòng marketing ảo khép kín** — nhiều AI agent, mỗi agent một vai (viết bài, lên lịch, đăng bài…), giao tiếp và phối hợp qua MCP tools (Facebook, TikTok).

---

## Thông điệp quảng cáo (đã chốt)

### Key cốt lõi: **「Xây dựng Phòng Marketing Ảo Của Riêng Bạn」**

Mọi thông điệp quảng cáo, landing page, social media và nội dung truyền thông **chỉ xoay quanh key này**.

| Mục | Nội dung |
|-----|----------|
| **Key chính** | Xây dựng Phòng Marketing Ảo Của Riêng Bạn |
| **Key rút gọn (ads)** | Phòng marketing ảo |
| **Định vị một câu** | Aucobot — xây dựng phòng marketing ảo của riêng bạn, với các trợ lý AI kết nối Facebook & TikTok |
| **Promise** | Tạo phòng ban marketing khép kín: nhiều agent phối hợp viết bài, hẹn giờ và đăng tự động |
| **Khác biệt so với chatbot** | Không một chatbot đơn lẻ — một **phòng marketing** thật sự làm việc thay bạn |

**Quy tắc copy:**

- Headline / hero / ads: luôn gợi **phòng marketing ảo** / **xây dựng phòng marketing của riêng bạn**
- Feature mô tả qua lăng kính phòng ban: *“Trợ lý viết bài trong phòng của bạn”*, *“Cả phòng phối hợp đăng đúng giờ”*
- CTA gợi ý: *“Dựng phòng marketing ảo miễn phí”*, *“Bắt đầu xây phòng marketing”*
- Tránh làm key phụ cạnh tranh: “AI Agent Cloud”, “multi-agent”, “SaaS rẻ” — chỉ dùng nội bộ / tài liệu kỹ thuật

**Ví dụ biến thể (cùng một key):**

| Kênh | Ví dụ |
|------|--------|
| Landing H1 | Xây dựng Phòng Marketing Ảo Của Riêng Bạn |
| Facebook Ads | Bận kinh doanh? Dựng phòng marketing ảo — AI lo Facebook & TikTok |
| SEO / meta | Aucobot \| Phòng marketing ảo — AI agent cho Facebook & TikTok |

---

## Chat Telegram-style với AI (đã chốt hướng sản phẩm)

**Aucobot** là app chat **giống Telegram** về UX — sidebar danh sách hội thoại, panel chat full-bleed, composer dưới cùng — nhưng user **trò chuyện với AI agent** thay vì con người.

| Telegram | Aucobot |
|----------|---------|
| Group / Channel | **Room (Phòng)** — nhiều agent trong một phòng làm việc chung |
| Chat 1-1 với bot / task | **Session (Phiên)** — một việc cụ thể, có thể archive sau |
| Danh sách chat | Sidebar sort theo hoạt động gần nhất |
| Contact | **💡** Danh bạ agent preset (DM riêng — phase sau) |

### MVP Phase 1 — chỉ Room + Session

| Có trong Phase 1 | Chưa Phase 1 (💡) |
|------------------|-------------------|
| Empty state: chưa có chat → user **tự tạo** | Tạo / custom agent |
| **Tạo Phòng** (tên bắt buộc + mô tả tùy chọn) | Thêm agent vào phòng |
| **Tạo Phiên** (một việc / goal ngắn) | DM agent từ danh bạ |
| Sidebar list Room + Session | WebSocket stream agent |
| Mở chat qua hash `#conversationId` | Brand kit, approval, đăng FB/TikTok |

**Không auto-tạo phòng** khi đăng ký — giống Telegram lần đầu: user chọn **Tạo phòng** hoặc **Phiên chat mới**.

### Tạo Phòng — UX giống Telegram “New Channel”

**💡 Ý tưởng UI** (tham chiếu Telegram Web):

```text
┌─ Tạo phòng mới ─────────────────┐
│  ← back                         │
│       [ avatar / icon ]         │  💡 optional sau
│  ┌─────────────────────────┐   │
│  │ Tên phòng *              │   │  ← bắt buộc (vd. "Team TikTok Q1")
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ Mô tả (tùy chọn)         │   │
│  └─────────────────────────┘   │
│  Bạn có thể thêm mô tả cho     │
│  phòng.                         │
│                          [ → ] │  → tạo xong mở chat
└─────────────────────────────────┘
```

**🔜 API:** `POST /api/conversations` `{ type: "room", title, description? }`

### Room vs Session

| | **Room (Phòng)** | **Session (Phiên)** |
|---|------------------|---------------------|
| Mục đích | Không gian làm việc lâu dài (team, campaign) | Một nhiệm vụ ngắn (vd. “Soạn 5 caption Tết”) |
| Tên | User đặt (bắt buộc) | User đặt / goal ngắn |
| Mô tả | Tùy chọn | Tùy chọn |
| Agent | **💡** Nhiều preset trong phòng | **💡** 1 assistant mặc định |
| Icon sidebar | 👥 group | ⚡ task |

### Agent vs Bot — **💡 ý tưởng** (hai loại "người làm việc")

Trong mỗi Room/Session, user có hai loại "trợ lý" bổ trợ nhau — **Agent** (linh hoạt, suy nghĩ) và **Bot** (cố định, chạy workflow). Cùng ý tưởng Telegram: vừa có bot thông minh, vừa có bot lệnh cứng.

| | **Agent** 🧠 | **Bot** ⚙️ |
|---|-------------|-----------|
| Bản chất | AI reasoning — hiểu ngôn ngữ, tự quyết, gọi tool linh hoạt | Workflow **cố định** cho một việc cụ thể — **không suy nghĩ** |
| Ai tạo | **User tạo** (setup wizard) để hỗ trợ công việc | **Agent xây hộ con người** (sinh code JS từ yêu cầu) |
| Cách chạy | LLM (Vercel AI SDK) + tool calling, kết quả không định trước | Thực thi **JavaScript đơn giản** — deterministic, input → output rõ ràng |
| Chi phí / tốc độ | Tốn token, chậm hơn, "đắt" | Rẻ, nhanh, chạy lặp lại ổn định |
| Ví dụ | "Viết 5 caption Tết theo brand kit rồi lên lịch" | "Mỗi 9h sáng lấy post nhiều like nhất tuần → gửi báo cáo" |
| Ẩn dụ | Nhân viên biết nghĩ | Macro / dây chuyền tự động |

**Luồng "Agent xây Bot" (💡):**

```text
1. User mô tả việc lặp bằng ngôn ngữ tự nhiên cho Agent
   vd: "Tạo bot mỗi sáng tổng hợp comment mới rồi gắn nhãn"
2. Agent chọn Bot Template phù hợp (scheduled | trigger | command…)
3. Agent sinh JS đơn giản điền vào template (steps, input/output Zod)
4. User xem trước → duyệt → Bot lưu lại, chạy độc lập không cần Agent nữa
5. Bot chạy trong sandbox cô lập (💡 Vercel Sandbox) — không đụng core / user khác
```

**Bot Template (💡):** khung workflow soạn sẵn để **hướng dẫn Agent sinh code đúng** (làm sau). Mỗi template khai báo:

| Thành phần | Vai trò |
|-----------|---------|
| `trigger` | `schedule` (cron) · `event` (webhook/message) · `command` (user gõ lệnh) |
| `steps[]` | Chuỗi bước JS thuần; mỗi bước input/output có **Zod schema** |
| `tools` | Tool allowlist bot được phép gọi (dùng chung MCP registry với Agent) |
| `guardrails` | Giới hạn thời gian chạy, số lần retry, không side-effect ngoài allowlist |

**Nguyên tắc thiết kế (chừa chỗ, chưa build):**

- **Bot dùng lại hạ tầng có sẵn:** tool allowlist qua MCP registry (như Agent), job/schedule qua `queue` (BullMQ), duyệt qua `approvals`. Bot **không** là kênh riêng.
- **Agent = "builder", Bot = "artifact":** Agent sinh ra và bảo trì Bot; Bot là kết quả chạy độc lập, versioned.
- **An toàn thực thi:** JS do AI sinh **phải** chạy trong sandbox cô lập (Vercel Sandbox / worker riêng), không `eval` trong process API.

### Model dữ liệu — **✅ Conversation** · 💡 phần còn lại

```text
Conversation                    # ✅ Room hoặc Session
  id, ownerId (= userId)         # chủ sở hữu; seam cho membership sau
  type: room | session          # thêm `direct` (DM) sau = additive enum
  title, description?
  lastMessageAt, createdAt

Message                         # 💡 kế tiếp — agent marketing reply
  id, conversationId, ownerId    # mang ownerId để sau shard theo tenant
  senderType: user | agent | system
  content, createdAt

ConversationMember              # 💡 Vòng 2 — mời đồng nghiệp / gắn agent
  conversationId
  memberType: user | agent
  userId? | agentId?
  role: owner | admin | member | viewer
```

**Module API:** `core/conversations/` — **✅ đã implement** (CRUD Room + Session). Mọi truy cập đi qua **1 checkpoint** — xem [Chiến lược mở rộng](#chiến-lược-mở-rộng-mvp-đơn-nhất--super-app-cộng-tác).

### URL & routing — **✅ đã làm (web)**

| Môi trường | Landing / auth | App chat |
|------------|----------------|----------|
| Dev | `localhost:8386` · `/login` | `localhost:8386/app` |
| Prod | `www.aucobot.com` | `app.aucobot.com` |

| URL | Ý nghĩa |
|-----|---------|
| `/app` | Shell — chưa chọn hội thoại (empty state) |
| `/app#clx9abc` | Mở `Conversation` id `clx9abc` (Room hoặc Session) |

- **✅** `proxy.ts` — host marketing vs app; dev path `/app` trên cùng `localhost`
- **✅** `use-conversation-id-from-hash` — đọc / set hash `#conversationId`
- **✅** `ClientAppShell` — sidebar list thật + create room/session + meta panel

### API Phase 1 — **🔜 contract dự kiến**

| Method | Path | Ghi chú |
|--------|------|---------|
| GET | `/api/conversations` | Sidebar list |
| POST | `/api/conversations` | `{ type: "room" \| "session", title, description? }` |
| GET | `/api/conversations/:id` | Meta |
| GET | `/api/conversations/:id/messages` | **💡** history |
| POST | `/api/conversations/:id/messages` | **💡** user gửi tin |

WebSocket **💡:** `WSS /api/ws/conversations/:id` (tên cũ trong doc: `.../departments/:id`).

### Đã làm vs chưa — Phase 1 chat

| Hạng mục | Trạng thái |
|----------|------------|
| Auth OTP + Google, cookie cross-subdomain (prod) / localhost (dev) | ✅ |
| Subdomain web: `site/` marketing + `app/` chat shell | ✅ |
| Landing page + login/register | ✅ |
| Hash routing mở hội thoại (`#conversationId`) | ✅ |
| Sidebar list Room + Session (API thật) | ✅ |
| Prisma `Conversation` (messages 💡) | ✅ |
| API conversations CRUD | ✅ |
| UI tạo phòng (Telegram-style form) | ✅ |
| UI tạo phiên | ✅ |
| Agent preset catalog + add vào phòng | 💡 |
| DM agent (danh bạ) | 💡 |
| AI reply + WebSocket stream | 💡 |

---

## MVP — Tính năng

### Ưu tiên phát triển

```text
✅ Đã làm:     Auth, web shell, landing, hash routing, Docker API, CI
🔜 Phase 1:    Conversation (Room + Session) — CRUD + UI tạo phòng Telegram-style
💡 Sau Phase 1: Agent preset, MCP social, approval, publish, BullMQ worker
```

### Mô hình sản phẩm dài hạn — **💡 ý tưởng** (trong mỗi Room)

```text
User
 └── Room (Phòng) — thay Department; user tạo chủ động, Telegram-style
      ├── Brand kit chung (tone, ngành, quy tắc)          💡
      ├── Document library (brochure, brief…)               💡
      ├── Agents (preset + tùy chỉnh sau)                   💡
      │    ├── Orchestrator — nhận lệnh user, chia việc
      │    ├── Content — viết caption
      │    ├── Scheduler — lên lịch
      │    └── Publisher — đăng FB/TikTok via MCP
      ├── Approval queue — bài chờ user duyệt             💡
      └── Jobs / audit — trạng thái + lịch sử               💡
```

### Tính năng P0 — full product **💡 ý tưởng** (sau Phase 1 chat)

| # | Tính năng | API / ghi chú |
|---|-----------|---------------|
| 1 | **Auth + session** | ✅ Passport + JWT httpOnly cookie |
| 2 | **OAuth Facebook + TikTok** | 💡 Lưu token encrypt trong `social_accounts` |
| 3 | **Room / Session CRUD** | 🔜 Phase 1 — thay Department CRUD |
| 4 | **Agent preset + setup** | 💡 Wizard → system prompt từ form |
| 5 | **Tool allowlist / agent** | 💡 MCP tools per agent |
| 6 | **MCP tools — social** | 💡 |
| 7 | **MCP tools — knowledge** | 💡 |
| 8 | **Human-in-the-loop** | 💡 |
| 9 | **BullMQ worker** | 💡 |
| 10 | **Task / job status API** | 💡 |
| 11 | **Audit log** | 💡 |
| 12 | **Agent memory / learning** | 💡 |

### Agent setup wizard — **💡 ý tưởng** (API contract)

User không viết raw system prompt — backend sinh từ structured input:

| Bước | Input | Output |
|------|-------|--------|
| 1 | Mẫu ngành (shop, spa, BĐS, custom) | Room + brand kit |
| 2 | Tên thương hiệu, tone, đối tượng KH | Brand kit JSON |
| 3 | Kết nối FB / TikTok | `social_accounts` linked |
| 4 | Chọn agent preset (Content, Scheduler, Publisher) | Agents + tool allowlist |
| 5 | Test sandbox | Chạy thử agent — **không đăng thật** |

Endpoints **💡:** `POST /api/conversations` (room), `POST /api/conversations/:id/agents`, `POST /api/conversations/:id/setup/complete`, `POST /api/conversations/:id/sandbox/run`

### MCP tools — **💡 ý tưởng** (`packages/mcp-core`)

**Social (Facebook + TikTok):**

| Tool | Mô tả |
|------|--------|
| `list_connected_accounts` | Pages / TikTok accounts đã OAuth |
| `create_draft_post` | Sinh / lưu bản nháp caption |
| `schedule_post` | Hẹn giờ (ghi DB + enqueue) |
| `publish_post` | Đăng ngay (sau approve) |
| `get_post_status` | Tra job / post result |
| `get_page_insights` | Engagement cơ bản (phase sớm) |

**Knowledge & research:**

| Tool | Mô tả |
|------|--------|
| `read_document` | Đọc file trong document library |
| `web_search` | Trend, competitor, tham khảo thị trường |
| `update_agent_memory` | Ghi insight học được theo user/room |

**Orchestration (agent ↔ agent):**

| Tool | Mô tả |
|------|--------|
| `handoff_to_agent` | Content → Scheduler: truyền structured payload (Zod) |
| `list_pending_approvals` | Orchestrator liệt kê bài chờ duyệt |

### Approval queue & job state machine — **💡 ý tưởng**

```text
draft → pending_approval → approved → scheduled → publishing → published
                        ↘ rejected
                        ↘ failed (retry tối đa N lần)
```

API **💡:** `GET /api/conversations/:id/approvals`, `POST /api/approvals/:id/approve`, `POST /api/approvals/:id/reject`

### Defer (post-MVP v1) — **💡**

| Tính năng | Lý do |
|-----------|--------|
| Unlimited custom agents | Preset 3–4 agent đủ demo |
| Comment / inbox automation | Scope & risk cao |
| RAG / pgvector | Doc ngắn → context window |
| Analytics agent riêng | Sau khi có insights API ổn |
| Billing / team workspace | Sau product-market fit |

### Schema DB — **💡 ý tưởng** (bổ sung Prisma)

| Model | Vai trò |
|-------|---------|
| `Conversation` | Room hoặc Session — **thay `Department`** |
| `Message` | Tin nhắn trong hội thoại |
| `Agent` | Agent AI (user tạo) — reasoning, tool calling |
| `Bot` | Workflow cố định (Agent xây hộ) — JS + trigger/steps, chạy sandbox |
| `BotTemplate` | Khung workflow hướng dẫn Agent sinh code (scheduled/trigger/command) |
| `BrandKit` | Tone, rules, industry template |
| `Approval` | Hàng đợi duyệt bài |
| `AgentMemory` | Learning JSON per room/agent |
| `AuditLog` | Who / which agent / what / when |

**✅ Models hiện có:** `User`, `RefreshToken`, `EmailOtpChallenge` — xem `packages/database/prisma/schema.prisma`

---

## Chiến lược mở rộng: MVP đơn nhất → Super App cộng tác

> **Mục tiêu:** hiện tại code **đơn giản nhất có thể** (1 user + AI agent marketing), nhưng **thiết kế sẵn "khoảng trống" (seams)** để lên super-app cộng tác **mà không phải đập đi xây lại**.
>
> **Nguyên tắc vàng:** *Làm ít nhất — chừa chỗ đúng chỗ.* Mỗi vòng phát triển chỉ được phép **thêm bảng / thêm cột nullable / thêm 1 checkpoint** — **không** sửa cấu trúc vòng trước (không `DROP`, không `RENAME`, không đổi kiểu).

### Ba vòng đồng tâm (product evolution)

| Vòng | Ai dùng | Năng lực | Trạng thái |
|------|---------|----------|------------|
| **1 — MVP cá nhân** | 1 user | Room/Session cá nhân + AI agent **marketing** (Content) | 🔜 trọng tâm hiện tại |
| **2 — Cộng tác** | User + đồng nghiệp | Mời bạn vào Room (Telegram-style), giao việc, xem chung, nhiều agent / room | 💡 |
| **3 — Super app** | Team / Org | **RBAC** phân quyền: ai được dùng agent nào; workspace/org; billing team | 💡 |

Trọng tâm code **bây giờ chỉ là Vòng 1**. Vòng 2–3 chỉ cần **chừa seam**, không implement.

### Tenancy tiến hóa: owner → membership → workspace

Đây là quyết định kiến trúc **quan trọng nhất** cho super-app. Chốt hướng: **giữ MVP phẳng, tập trung quyền vào 1 chỗ**.

**Hiện tại (MVP):** `Conversation.userId` = **chủ sở hữu (owner)**. Không bảng Workspace, không membership, không role. Đơn giản nhất.

**Seam làm ngay (rất rẻ — chỉ là kỷ luật code, không thêm bảng):**

| # | Seam | MVP làm gì | Lợi ích tương lai |
|---|------|-----------|-------------------|
| 1 | Ngữ nghĩa `userId` = **ownerId** | Không đổi tên cột cũng được, chỉ hiểu đúng | Thêm co-owner/member không mâu thuẫn |
| 2 | **1 checkpoint quyền duy nhất** — ✅ đã áp | `ConversationAccessService.assert(userId, conversationId)` (`core/conversations/conversation-access.service.ts`) — MVP check owner. **Cấm** rải `where userId` khắp service | Thêm membership/RBAC = sửa **đúng 1 method** |
| 3 | **Mang tenant id trên bảng con** | Bảng `Message` mang cả `ownerId` (không chỉ `conversationId`) | Shard theo tenant sau không cần JOIN ngược |

**Migration path (mọi bước additive, không downtime, không rewrite):**

```text
Vòng 1 (MVP)       Conversation.ownerId = userId
                   access = (ownerId == me)                     ← 1 method

Vòng 2 (cộng tác)  + ConversationMember(conversationId, userId|agentId, role)
                   backfill: mỗi conversation → 1 member (owner)
                   access = EXISTS(member)                      ← sửa đúng 1 method

Vòng 3 (org)       + Workspace + WorkspaceMember
                   + Conversation.workspaceId (nullable → backfill personal workspace)
                   access = role theo workspace + per-agent grant
```

Vì tất cả là **thêm bảng / cột nullable + backfill** → không có thao tác phá hủy.

### RBAC — phân quyền đồng nghiệp dùng agent (Vòng 3, 💡)

```text
Workspace              # tổ chức / team (Vòng 3); MVP: mỗi user = 1 personal workspace ngầm
  id, ownerId, name

WorkspaceMember        # đồng nghiệp trong workspace
  workspaceId, userId
  role: owner | admin | member | viewer

AgentGrant             # ai được dùng agent nào — cốt lõi "phân quyền agent"
  workspaceMemberId, agentId
  canUse, canConfigure
```

- **Role** quyết định quyền mặc định; **AgentGrant** override ở mức từng agent (vd: cho đồng nghiệp X chỉ dùng agent "Content", cấm agent "Publisher").
- Kiểm tra quyền vẫn đi qua **cùng 1 checkpoint** đã dựng từ MVP → chỉ mở rộng logic bên trong.

### Chiến lược ID

| Nguyên tắc | Hiện trạng | Lý do cho tương lai |
|------------|-----------|---------------------|
| **ID chuỗi toàn cục** (không auto-increment int) | ✅ `cuid()` | Merge / shard / multi-region **không đụng khóa** — int tăng dần sẽ đụng nhau giữa shard |
| PK/FK luôn cùng kiểu string | ✅ | Đổi storage không gãy quan hệ |
| Không lộ thứ tự / số lượng qua ID | ✅ cuid random | Bảo mật, tránh enumeration |
| **UUIDv7 cho bảng append-only / ghi nặng** — ✅ đã áp | `RefreshToken`, `EmailOtpChallenge` dùng `@default(uuid(7))` | ID sortable theo thời gian → index locality tốt; áp tiếp cho `Message`, `AuditLog` khi có |

**Chốt:** entity tables (`User`, `Conversation`) giữ `cuid()` — global-unique, id hiển thị trên URL hash. Bảng **append-only / ghi nặng** (`RefreshToken`, `EmailOtpChallenge`, tương lai `Message`, `AuditLog`) dùng **`@default(uuid(7))`** cho index locality. Vì `cuid()`/`uuid()` là default sinh **phía client** (không có DB default) → đổi generator **không tạo migration SQL**, non-breaking hoàn toàn.

### Chiến lược tách DB khi nhiều user (thang 5 nấc)

Tách DB là quyết định **theo metric**, không làm sớm. Mỗi nấc chỉ leo khi nấc dưới hết dư địa.

| Nấc | Kỹ thuật | Kích hoạt khi | Seam cần có sẵn từ MVP |
|-----|----------|---------------|------------------------|
| **0** | 1 Postgres + index + query tuning | luôn (hiện tại) | Index đúng ✅ |
| **1** | Connection pool (PgBouncer) | Nhiều kết nối từ serverless / nhiều replica API | Không cần code |
| **2** | **Read replica** (đọc → replica, ghi → primary) | Đọc nặng (list, history) áp đảo ghi | Tách read/write **trong 1 chỗ** (`PrismaService`) |
| **3** | **Vertical split theo domain** (`messages`, `audit`, `jobs` → DB/service riêng) | 1 domain phình lấn át phần còn lại | **Feature sở hữu bảng riêng + không JOIN chéo domain ở SQL** |
| **4** | **Horizontal shard theo tenant** (`workspaceId`) | Quá nhiều tenant cho 1 node | **`tenant_id` trên mọi bảng + ID toàn cục + không FK chéo shard** |

**Seam rẻ cho tách DB (giữ/làm từ MVP):**

1. **ID chuỗi toàn cục** — đã có (nấc 4 không cần đổi ID).
2. **Mang `ownerId`/`workspaceId` trên mọi bảng thuộc tenant** (kể cả `Message`) — cho phép shard theo tenant mà không JOIN ngược. Chi phí: 1 cột, gần như free.
3. **Không JOIN chéo domain ở tầng SQL** — nếu cần dữ liệu 2 domain, join ở tầng app. Chuẩn bị cho nấc 3.
4. **Feature sở hữu bảng riêng** — `messages` thuộc conversations, `jobs`/`post_results` thuộc publishing, `audit_logs` thuộc audit. Ranh giới rõ = tách vertical không gỡ rối.

**Kết luận:** cấu trúc hiện tại (Postgres shared multi-tenant + ID toàn cục + `userId` trên bảng gốc) **đủ điều kiện leo cả 5 nấc mà không rewrite** — miễn giữ 4 seam trên. Không cần làm gì thêm ở MVP ngoài kỷ luật khi thêm bảng mới.

### Model DB tiến hóa (hiện tại → tương lai)

| Model | Vòng | Vai trò |
|-------|------|---------|
| `User`, `RefreshToken`, `EmailOtpChallenge` | 1 | ✅ Identity + auth |
| `Conversation` (`ownerId`, `type`) | 1 | ✅ Room / Session |
| `Message` (`conversationId`, `ownerId`, `senderType`) | 1 | 🔜 kế tiếp — agent marketing reply |
| `Agent` (user tạo — AI reasoning) | 2 | 💡 |
| `Bot` + `BotTemplate` (workflow JS Agent xây, chạy sandbox) | 2+ | 💡 |
| `ConversationMember` (user \| agent, role) | 2 | 💡 mời đồng nghiệp / gắn agent |
| `Workspace`, `WorkspaceMember` | 3 | 💡 tổ chức + phân quyền |
| `AgentGrant` | 3 | 💡 ai được dùng agent nào |
| `SocialAccount`, `Approval`, `ScheduledPost`, `AuditLog` | feature | 💡 theo từng feature plugin |

Mỗi dòng mới = **thêm bảng**, tham chiếu `conversationId`/`ownerId` — **additive, không đụng bảng cũ**.

---

## Kiến trúc MVP (đã chốt)

### Nguyên tắc

| Nguyên tắc                     | Mô tả                                                                         |
| ------------------------------ | ----------------------------------------------------------------------------- |
| **Multi-tenant shared**        | Mọi user dùng chung PostgreSQL, Redis, worker pool — phân biệt bằng `user_id` |
| **Không container/user**       | Scale theo **queue job**, không scale theo số user                            |
| **API + Worker gộp**           | MVP: một Railway service chạy cả NestJS HTTP và BullMQ worker                 |
| **Frontend tách biệt**         | Next.js trên Vercel; worker không public internet                             |
| **Postgres = source of truth** | Redis/BullMQ chỉ là transport; mất Redis có thể rebuild job từ DB             |

### Sơ đồ deploy MVP

```
┌─────────────────────────────────────────────────────────────────┐
│                         End User (Browser)                       │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTPS
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  Vercel — apps/web (Next.js)                                     │
│  • UI Telegram-style: thread list + chat stream (frontend mỏng) │
│  • Chỉ gọi REST + WebSocket — KHÔNG gọi worker trực tiếp        │
└───────────────────────────────┬─────────────────────────────────┘
                                │ NEXT_PUBLIC_API_URL
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  Railway — apps/api (1 service, 1 replica MVP)            │
│  ┌─────────────────────┐  ┌─────────────────────────────────┐   │
│  │  NestJS HTTP :4000  │  │  BullMQ Worker (cùng process)   │   │
│  │  /api/*             │  │  queue: publish-post, …         │   │
│  └──────────┬──────────┘  └──────────────┬──────────────────┘   │
└─────────────┼─────────────────────────────┼───────────────────────┘
              │                             │
              ▼                             ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│  Railway — PostgreSQL   │   │  Railway — Redis        │
│  • users, tokens        │   │  • delayed jobs         │
│  • scheduled_posts      │   │  • retry / concurrency  │
│  • documents, …         │   │                         │
└─────────────────────────┘   └─────────────────────────┘
              │
              ▼ (khi worker chạy job)
┌─────────────────────────────────────────────────────────────────┐
│  External APIs (pay-as-you-go)                                   │
│  • Together AI — sinh caption                                    │
│  • Facebook Graph API — đăng bài (v1)                            │
│  • TikTok Marketing API — defer v1.1                             │
└─────────────────────────────────────────────────────────────────┘
```

### Bảng service MVP

| Service            | Nơi chạy             | Bắt buộc       | Vai trò                            |
| ------------------ | -------------------- | -------------- | ---------------------------------- |
| **web**            | Vercel               | ✅             | Giao diện người dùng               |
| **api**            | Railway              | ✅             | REST + WebSocket, webhook, enqueue job |
| **Worker**         | Gộp trong api        | ✅             | Consumer BullMQ — đăng bài hẹn giờ |
| **PostgreSQL**     | Railway plugin       | ✅             | Dữ liệu persistent, multi-tenant   |
| **Redis**          | Railway plugin       | ✅             | BullMQ queue                       |
| **Together AI**    | External             | ✅ (khi có AI) | LLM pay-per-token                  |
| **Meta Graph API** | External             | ✅ (v1 FB)     | OAuth + publish                    |
| **Object Storage** | R2/S3                | ⚠️ Tùy chọn    | Khi upload file/media              |

**Chi phí hạ tầng ước tính:** ~$10–15/tháng (Railway PG + Redis + api) + Vercel free tier.

### Luồng tạo lịch đăng bài

```
1. User (web) → POST /api/scheduled-posts
2. api:
   • validate + ghi scheduled_posts (PostgreSQL, status=SCHEDULED)
   • queue.add('publish-post', { postId }, { delay, jobId: idempotencyKey })
   • trả 201 ngay — không chờ đăng xong
3. Worker (cùng process, đến runAt):
   • đọc post + social_accounts theo user_id
   • gọi Facebook/TikTok API
   • cập nhật status PUBLISHED | FAILED + post_results
4. web nhận event `job.status` qua WebSocket (cùng socket conversation) **💡**
```

**Frontend không bao giờ gọi worker.** User → API (REST) → Queue → Worker → API push (WS).

### Giao thức client web (đã chốt): REST + WebSocket

**Không dùng GraphQL.** Một client chính (`apps/web`); contract Zod trong `@aucobot/shared`.

| Kênh | Vai trò | Web layer |
|------|---------|-----------|
| **REST** | Lệnh user, CRUD, snapshot ban đầu | `lib/http` → `lib/api/*` |
| **WebSocket** | Push realtime: stream agent, job, approval | `lib/stream/*` |

```text
User action (gửi tin, duyệt, setup)
  → REST POST/GET /api/*
  → API xử lý (NestJS + worker)

Server push (chunk agent, job done, approval đổi)
  → WSS /api/ws/conversations/:conversationId   💡 (tên cũ: .../departments/:id)
  → JSON event envelope (Zod trong @aucobot/shared)
  → web: lib/stream → hooks → stores → UI
```

**REST — ví dụ:**

| Method | Path | Mục đích |
|--------|------|----------|
| POST | `/api/conversations/:id/messages` | User gửi tin → API bắt đầu agent **💡** |
| GET | `/api/conversations/:id/messages` | History / snapshot **💡** |
| POST | `/api/approvals/:id/approve` | Duyệt bài |
| POST | `/api/scheduled-posts` | Tạo lịch đăng |

**WebSocket — một connection / conversation khi mở chat:** **💡**

| Event `type` | Hướng | Mục đích |
|--------------|-------|----------|
| `message.chunk` | S→C | Stream từng mảnh câu trả lời agent |
| `message.done` | S→C | Kết thúc tin |
| `approval.updated` | S→C | Trạng thái duyệt đổi |
| `job.status` | S→C | Job đăng bài: scheduled → published / failed |
| `ping` / `pong` | C↔S | Keepalive |

**Auth WS:** cookie `httpOnly` lúc HTTP Upgrade (cùng site `app.` / `api.`) — **cấm** secret trên query string.

**API stack:** NestJS `@nestjs/websockets` + adapter `ws` (native). Scale sau: Redis pub/sub giữa replicas.

**Poll REST** (`GET scheduled-posts/:id`) chỉ fallback dev — production dùng `job.status` trên WS.

### Xử lý đột biến nhiều user đăng cùng lúc

Đột biến lo ngại là **job queue**, không phải HTTP traffic.

| Cơ chế                      | Mục đích                             |
| --------------------------- | ------------------------------------ |
| BullMQ **delayed job**      | Không cron quét từng user            |
| **Concurrency cap** (vd: 5) | Giới hạn job song song toàn platform |
| **Rate limit** Meta/TikTok  | Tránh ban API                        |
| **Jitter nhẹ**              | Tránh burst cùng giây                |
| **Idempotency key**         | Retry không đăng trùng               |

Một worker shared xử lý hàng trăm job xếp hàng — không cần 1 worker/user.

### Kiến trúc API: Core + Features (plugin) — **✅ toggle qua config; 💡 feature module**

> **Trạng thái thực tế:**
> - **✅ Feature toggle qua config** — `core/features/`: env `ENABLED_FEATURES` (CSV, Zod validate chặn typo), `FeatureFlagsService` (`isEnabled`/`assertEnabled`/`getEnabled`), `feature-loader.ts` (`loadEnabledFeatures()` nạp module theo config). `app.module.ts`: `imports: [CoreModule, ...loadEnabledFeatures()]`. Registry **rỗng ở MVP** — thêm feature = thêm 1 dòng.
> - **Còn phẳng:** các module core khác (`auth`, `conversations`…). **Chưa có** `features/*` module thật, `plugins/` (FeaturePlugin interface), `events/`, `queue/`, `agents/`.
> - Đây là **chủ đích — không over-engineer**: hạ tầng bật/tắt đã sẵn, chỉ dựng event bus / plugin interface khi có feature thật để cắm.
>
> **Thêm feature (2 bước):** (1) tạo `features/<name>/<name>.module.ts` (module thường, *không import feature khác*); (2) đăng ký vào `FEATURE_REGISTRY` trong `feature-loader.ts` rồi thêm id vào `ENABLED_FEATURES`. Thêm `@nestjs/event-emitter` **chỉ khi** có tương tác chéo đầu tiên (`approvals → publishing`). Xem [`core/features/README.md`](apps/api/src/core/features/README.md).

API chia **`src/core`** (nền tảng bắt buộc) và **`src/features`** (cắm / rút như plugin). Core **không phụ thuộc** feature nào; feature chỉ phụ thuộc core qua **contract** (interface / event).

#### Nguyên tắc

| Nguyên tắc | Mô tả |
|------------|--------|
| **Core luôn chạy** | Auth, health, conversations shell, agent registry, queue infra, audit — tắt feature không làm sập API |
| **Feature độc lập** | Mỗi feature = 1 NestJS `DynamicModule` + manifest; bật/tắt qua env hoặc config |
| **Core không import feature** | `core/` không được `import` từ `features/` |
| **Feature không import feature** | Feature A ↔ Feature B qua **event bus** hoặc contract trong `core/plugins` |
| **MCP tools đăng ký qua plugin** | Feature social đăng ký tool vào registry lúc bootstrap — gỡ feature = gỡ tool |

```text
                    ┌─────────────────────────────────┐
                    │  app.module.ts                  │
                    │  imports: CoreModule + enabled  │
                    │           FeatureModules[]      │
                    └───────────────┬─────────────────┘
                                    │
              ┌─────────────────────┴─────────────────────┐
              ▼                                           ▼
    ┌─────────────────────┐                 ┌─────────────────────┐
    │  src/core           │                 │  src/features         │
    │  (bắt buộc)         │◄── contract ────│  (cắm / rút)          │
    │                     │    only         │                       │
    │  auth, conversations│                 │  facebook, tiktok     │
    │  agents, queue,     │                 │  publishing, approvals│
    │  plugins registry   │                 │  documents, web-search│
    └─────────────────────┘                 └─────────────────────┘
```

#### `src/core` — nền tảng bắt buộc

Core gồm **4 lớp**. Tắt bất kỳ feature nào, core vẫn chạy — app vẫn là nền tảng “phòng marketing ảo”.

**Lớp 1 — Infrastructure**

| Module | Vai trò |
|--------|---------|
| `common/` | Decorators (`@CurrentUser`), filters, interceptors, middleware, pipes (Zod), utils — **không** chứa business logic |
| `config/` | Env validation (Zod) |
| `features/` | ✅ Feature toggle qua config — `ENABLED_FEATURES`, `FeatureFlagsService`, `loadEnabledFeatures()` |
| `database/` | PrismaService, transaction helper |
| `logging/` | Pino, request-id, structured log |
| `health/` | `/api/health`, readiness |

**Lớp 2 — Identity**

| Module | Vai trò |
|--------|---------|
| `auth/` | Passport, JWT httpOnly cookie, guards, strategies |
| `users/` | User CRUD, profile, timezone — tenant identity |

**Lớp 3 — Plugin platform**

| Module | Vai trò |
|--------|---------|
| `plugins/` | `FeaturePlugin` interface, registry, loader từ `ENABLED_FEATURES` |
| `events/` | Event bus — feature **không import nhau**, chỉ emit/listen |
| `audit/` | Audit log — mọi feature ghi qua core |
| `queue/` | Redis/BullMQ **connection + factory** — không chứa processor nghiệp vụ |

**Lớp 4 — Domain shell (khung sản phẩm)**

| Module | Vai trò |
|--------|---------|
| `conversations/` | Room + Session — CRUD, messages **🔜** (folder cũ: `departments/`) |
| `agents/` | Agent registry: role, instructions, **tool allowlist** (tools lấy từ plugin registry) |

**`common/` chi tiết:**

| Thư mục | Ví dụ |
|---------|--------|
| `decorators/` | `@CurrentUser()`, `@Public()`, `@RequireConversation()` **💡** |
| `filters/` | `HttpExceptionFilter`, `ZodExceptionFilter` |
| `interceptors/` | `LoggingInterceptor`, `TransformInterceptor` |
| `middleware/` | `RequestIdMiddleware` |
| `pipes/` | `ZodValidationPipe` |
| `utils/` | `encryptToken`, `parseTimezone` — helpers thuần |

**Ranh giới core vs feature:**

| Thuộc core | Thuộc feature |
|------------|---------------|
| User, auth, conversation shell, agent registry | OAuth Facebook/TikTok, MCP tools social |
| Queue connection | Publish processor, job state machine |
| Event bus + schema | Listener/producer cụ thể |
| Plugin registry | `facebook.plugin.ts`, `publishing.plugin.ts` |

#### `src/features` — plugin (bật/tắt)

| Feature | Vai trò | Phụ thuộc |
|---------|---------|-----------|
| `facebook` | OAuth Meta, MCP tools FB | core + `social-providers` |
| `tiktok` | OAuth TikTok, MCP tools TikTok | core + `social-providers` |
| `publishing` | Schedule + publish processor, job state | core `queue`, `events` |
| `approvals` | Human-in-the-loop, approval queue API | core `events` |
| `documents` | Upload, extract text, `read_document` tool | core `conversations` **💡** |
| `web-search` | `web_search` tool (Tavily/Serper) | core `agents` |
| `ai-orchestration` | Vercel AI SDK, agent chat, handoff | core `agents`, `llm-services` |

Bật/tắt ví dụ:

```env
ENABLED_FEATURES=facebook,tiktok,publishing,approvals,documents,ai-orchestration
# Tắt tiktok → bỏ khỏi list, core + FB vẫn chạy
```

#### Contract plugin (`core/plugins`)

Mỗi feature implement `FeaturePlugin`:

```typescript
// core/plugins/feature-plugin.interface.ts
export interface FeaturePlugin {
  readonly id: string;                    // 'facebook' | 'tiktok' | ...
  readonly mcpTools?: McpToolDefinition[]; // tools đăng ký cho agent
  registerModule(): DynamicModule;         // NestJS module
  onEnable?(registry: PluginRegistry): void;
  onDisable?(): void;
}
```

- **Agent** trong core chỉ thấy tools từ registry — không biết Facebook/TikTok cụ thể.
- Gỡ feature `tiktok` → registry không còn TikTok tools → agent TikTok-publisher không assign được tool đó.

#### Giao tiếp giữa features (không import chéo)

```text
Feature documents  ──emit──►  PostDraftCreated
Feature ai         ──listen──►  sinh caption
Feature approvals  ──listen──►  chờ duyệt
Feature publishing ──listen──►  ApprovalGranted → enqueue job
```

Event names + payload Zod schema đặt trong `@aucobot/shared` hoặc `core/events`.

#### Cấu trúc thư mục `apps/api`

```
apps/api/src/
├── main.ts
├── worker.ts
├── app.module.ts              # CoreModule + loadEnabledFeatures()
│
├── core/
│   ├── core.module.ts
│   ├── common/                # decorators, filters, interceptors, pipes, utils
│   ├── config/
│   ├── database/
│   ├── logging/
│   ├── health/
│   ├── auth/
│   ├── users/
│   ├── conversations/         # 🔜 Room + Session (placeholder: departments/)
│   ├── agents/
│   ├── queue/
│   ├── events/
│   ├── audit/
│   └── plugins/
│       ├── feature-plugin.interface.ts
│       ├── plugin.registry.ts
│       └── feature-loader.ts
│
└── features/
    ├── index.ts               # export all plugins + manifest
    ├── facebook/
    │   ├── facebook.plugin.ts
    │   ├── facebook.module.ts
    │   └── ...
    ├── tiktok/
    ├── publishing/
    ├── approvals/
    ├── documents/
    ├── web-search/
    └── ai-orchestration/
```

#### Scale: rút plugin → tách service riêng (giống WordPress)

Kiến trúc core + features được thiết kế theo mô hình **modular monolith trước, microservices sau** — tương tự WordPress core + plugins, nhưng typed và contract rõ ràng hơn.

| WordPress | Aucobot |
|-----------|---------|
| WordPress **core** | `apps/api/src/core` |
| **Plugin** cắm vào core | `apps/api/src/features/*` |
| Plugin tắt = không load | `ENABLED_FEATURES` bỏ id |
| Plugin nặng (WooCommerce) có thể tách server riêng | Feature `publishing` / `ai-orchestration` tách deploy sau |

**3 giai đoạn scale (không rewrite):**

```text
Phase 1 — MVP (hiện tại)
  apps/api (1 process)
    CoreModule + FeatureModules[]  ← plugin in-process (NestJS DynamicModule)

Phase 2 — Tách deploy, cùng repo
  apps/api          → HTTP + core + features nhẹ
  apps/worker       → chỉ feature publishing processors (cùng codebase, entry khác)
  hoặc
  packages/feature-publishing → import vào worker service riêng trên Railway

Phase 3 — Microservice (dự án lớn)
  api-core          → auth, users, conversations, agents, plugin gateway
  svc-facebook      → feature facebook (HTTP/gRPC nội bộ)
  svc-publishing    → worker + queue consumer
  svc-ai            → ai-orchestration
  Giao tiếp: Redis Streams / SQS + contract Zod trong @aucobot/shared
```

**Điều kiện để tách feature thành service mà không vỡ hệ thống** (làm từ MVP):

| Quy tắc | Mục đích |
|---------|----------|
| Feature **không import** feature khác | Thay bằng event / HTTP contract |
| Event payload **Zod schema** trong `@aucobot/shared` | Service mới implement cùng contract |
| MCP tools đăng ký qua **registry** | Remote feature = remote tool provider |
| Core **không biết** Facebook/TikTok cụ thể | Chỉ biết `FeaturePlugin.id` |
| DB: shared Postgres giai đoạn đầu → schema per service sau | Tránh premature split DB |

**Ví dụ tách `publishing` ra service riêng:**

```text
Trước:  approvals ──event──► publishing (in-process) ──► BullMQ
Sau:    approvals ──event──► Redis Stream ──► svc-publishing (N replica scale)
        api-core vẫn nhận HTTP từ web — không đổi URL public
```

**Kết luận:** Có — khi dự án lớn, mỗi feature có thể thành **service deploy riêng**, scale độc lập, bật/tắt như plugin WordPress — **nếu** giữ contract event + plugin interface từ đầu, không import chéo.

| Tình huống | Cách xử lý |
|------------|------------|
| Bỏ TikTok sau MVP | Xóa `tiktok` khỏi `ENABLED_FEATURES` — không sửa core |
| Scale worker publish | Tách feature `publishing` → service/worker riêng |
| Thêm kênh (Zalo) | Thêm `features/zalo/` hoặc `svc-zalo` — core không đổi |
| Feature AI quá nặng | Tách `svc-ai` — core gọi qua HTTP + streaming |

**Ưu tiên implement:** `core/common` + `core/plugins` → `core/conversations` **🔜** → `core/agents` **💡** → `features/facebook` **💡** → …

MVP: `main.ts` import `CoreModule` + enabled features → worker processors từ feature `publishing`.  
Sau: cùng codebase — `node dist/main.js` (api) hoặc `node dist/worker.js` (worker) hoặc deploy feature thành service riêng.

### Khi nào tách worker khỏi API

Giữ gộp đến khi **≥ 2** điều kiện sau đúng:

- [ ] Queue thường xuyên **> 100 job pending** trong giờ cao điểm
- [ ] API (`/health`, chat) **chậm** khi worker chạy nặng
- [ ] Job **> 30s** (AI + media) ảnh hưởng event loop
- [ ] Cần scale worker **3–5 replica** mà **không** scale API

**Phase 2 (scale):** tách worker → Railway service thứ 2 hoặc AWS Fargate auto-scale theo queue depth.  
**Phase 3:** AWS Fargate/Lambda + scale-to-zero khi idle — khi có metric traffic thật.

### Local development

```bash
docker compose up -d          # PostgreSQL (+ Redis sẽ bổ sung)
pnpm db:migrate
pnpm dev:api                  # http://localhost:4000/api
pnpm dev:web                  # http://localhost:3000
```

| Container | Port | Trạng thái            |
| --------- | ---- | --------------------- |
| postgres  | 5432 | ✅ docker-compose     |
| redis     | 6379 | 🔜 bổ sung cho BullMQ |

---

## Công cụ monorepo

| Công cụ             | Vai trò                                                        |
| ------------------- | -------------------------------------------------------------- |
| **pnpm**            | Package manager **duy nhất** — không dùng npm / yarn            |
| **pnpm workspaces** | Quản lý packages, liên kết nội bộ qua `workspace:*`            |
| **Turborepo**       | Orchestrate build / dev / lint / typecheck xuyên suốt monorepo |
| **TypeScript**      | Ngôn ngữ chung cho toàn bộ apps và packages                    |

### pnpm (bắt buộc)

Monorepo **chỉ** dùng [pnpm](https://pnpm.io). `package-lock.json` / `yarn.lock` không được dùng.

| File / cấu hình | Vai trò |
|-----------------|---------|
| `packageManager` trong root `package.json` | Pin phiên bản pnpm (`pnpm@9.15.0`) — dùng với Corepack |
| `pnpm-workspace.yaml` | Khai báo `apps/*`, `packages/*` |
| `pnpm-lock.yaml` | Lockfile duy nhất — commit vào git |
| `.npmrc` | Cấu hình pnpm workspace |
| `preinstall` + `only-allow` | Chặn `npm install` / `yarn` nhầm |

**Cài đặt lần đầu:**

```bash
corepack enable
corepack prepare pnpm@9.15.0 --activate
pnpm install
```

**Lệnh thường dùng** (thay cho npm):

| npm (không dùng) | pnpm |
|------------------|------|
| `npm install` | `pnpm install` |
| `npm run dev` | `pnpm dev` |
| `npm run build` | `pnpm build` |
| `npm install <pkg>` | `pnpm add <pkg>` |
| `npm install -D <pkg>` | `pnpm add -D <pkg>` |
| `npm run <script> -w apps/web` | `pnpm --filter @aucobot/web <script>` |


## Sơ đồ thư mục

```
aucobot/
├── apps/
│   ├── api/                     # NestJS @aucobot/api — Core + Features (plugin)
│   └── web/                     # Next.js — frontend mỏng (STRUCTURE.md)
│
├── packages/
│   ├── database/                # Prisma schema + client PostgreSQL
│   ├── shared/                  # Types, constants, Zod schemas
│   ├── social-providers/        # Abstraction Facebook / TikTok API
│   ├── mcp-core/                # MCP tools gọi social providers
│   └── llm-services/            # Vercel AI SDK + Together AI
│
├── docker-compose.yml           # PostgreSQL local
├── .env.example
├── .npmrc                       # Cấu hình pnpm
├── pnpm-lock.yaml               # Lockfile (pnpm only)
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── tsconfig.json
```

## Apps

### `apps/api`

Backend NestJS — **`@aucobot/api`**. Gộp API + Worker trong một Railway service (MVP).

| Luồng      | Trách nhiệm                                            |
| ---------- | ------------------------------------------------------ |
| **API**    | REST + WebSocket, webhook, xử lý request từ `web`, enqueue job |
| **Worker** | BullMQ consumer — thực thi job hẹn giờ đăng bài        |

**Phụ thuộc nội bộ:** `@aucobot/database`, `@aucobot/shared`, `@aucobot/social-providers`, `@aucobot/mcp-core`, `@aucobot/llm-services`

**Stack (đã chốt):** xem [Tech Stack — Backend](#tech-stack--backend)

**Kiến trúc code:** `src/core` + `src/features` (plugin) — xem [Kiến trúc API: Core + Features](#kiến-trúc-api-core--features-plugin).

**Endpoints hiện có:** **✅**

| Method | Path | Mô tả |
| ------ | ------------- | ---------------------- |
| GET | `/api/health` | Health + DB |
| POST/GET | `/api/auth/*` | OTP email, Google OAuth, session, me |
| GET | `/api/users` | Danh sách users (dev) |
| POST | `/api/users` | Tạo user (dev) |

**🔜 Phase 1:** `/api/conversations` (Room + Session)

**Cấu trúc thư mục (target):**

```
apps/api/src/
├── main.ts
├── worker.ts
├── app.module.ts
├── core/
│   ├── common/                # decorators, filters, interceptors, pipes, utils
│   ├── config/
│   ├── database/
│   ├── logging/
│   ├── health/
│   ├── auth/
│   ├── users/
│   ├── conversations/         # 🔜 Room + Session (placeholder: departments/)
│   ├── agents/
│   ├── queue/
│   ├── events/
│   ├── audit/
│   └── plugins/
└── features/
    ├── facebook/
    ├── tiktok/
    ├── publishing/
    ├── approvals/
    ├── documents/
    ├── web-search/
    └── ai-orchestration/
```

**Ưu tiên implement:** `core/common` + `core/plugins` → `core/conversations` **🔜** → `core/agents` **💡** → `features/facebook` **💡** → …

### `apps/web`

Frontend Next.js 16 (App Router) — deploy **Vercel**. **Frontend mỏng:** chỉ stream & hiển thị; não nghiệp vụ ở `apps/api`.

**Phụ thuộc nội bộ:** `@aucobot/shared`

**Stack (đã chốt):** xem [Tech Stack — Frontend](#tech-stack--frontend)

**Quy ước UI:**

| Quy ước | Mô tả |
| -------- | ----- |
| **Frontend mỏng** | Next.js + Zustand buffer stream; không logic agent/approval/job trên client |
| **UX Telegram-style** | Sidebar: Room + Session \| chat full-bleed — chat với AI, không dashboard SaaS |
| **CSS Modules** | `ComponentName.module.css` — không Tailwind / UI kit ngoài |
| **Components tự viết** | `components/ui`, `layout`, `chat` |
| **Storybook** | `.stories.tsx` cạnh component — defer đến khi có `components/ui` |

**Sơ đồ folder (đã scaffold — xem `README.md` từng folder):**

> Chi tiết: [`apps/web/STRUCTURE.md`](apps/web/STRUCTURE.md) · rule: [`apps/web/.agent/rule.md`](apps/web/.agent/rule.md)

```text
apps/web/
├── STRUCTURE.md
├── app/
│   ├── site/                      landing + login/register
│   └── app/                       chat shell — `#conversationId` **✅**
├── components/
│   ├── ui/                        Button, Input, Spinner…
│   ├── layout/                    AppShell, SplitPane, Composer
│   └── chat/                      MessageList, Bubble, StreamText
├── hooks/<domain>/                pipe: lib → stores (chat, thread, approval)
├── stores/<domain>/               Zustand stream buffer (message, thread, connection)
├── lib/
│   ├── http/                      client, server-api, api-base-url  [MVP]
│   ├── api/                       REST mirror + Zod  [auth.ts MVP]
│   └── stream/                    WebSocket agent-stream-client  [planned]
├── utils/<domain>/                format hiển thị
├── schemas/                       wrap @aucobot/shared
├── public/
├── scripts/
├── proxy.ts                       host rewrite marketing / app **✅**
└── next.config.ts
```

**Luồng data web:**

```text
apps/api ──REST + WebSocket──► lib/http + lib/stream + lib/api
                                    ▼
                          hooks/<domain>  (pipe)
                                    ▼
                          stores/<domain>  (Zustand)
                                    ▼
                          components/chat + app/(main)
```

**Map `lib/api/` ↔ API domain (thêm file khi có endpoint):**

| `lib/api/` | API |
|------------|-----|
| `auth.ts` ✅ | `/api/auth/*` |
| `conversations.ts` 🔜 | `/api/conversations` (Room + Session) |
| `agents.ts` 💡 | agent preset trong room |
| `messages.ts` 💡 | chat REST |
| `approvals.ts` | approval queue |
| `scheduled-posts.ts` | lịch đăng; status qua WS `job.status` |

**Giao thức:** REST (lệnh) + WebSocket (push) — không GraphQL. Xem [Giao thức client web](#giao-thức-client-web-đã-chốt-rest--websocket).

**Trạng thái web:** **✅** auth, landing, `ClientAppShell`, hash routing, proxy subdomain · **🔜** conversations API + UI tạo phòng Telegram-style

## Tech Stack (đã chốt)

### Nguyên tắc chung

| Nguyên tắc                     | Mô tả                                                                                         |
| ------------------------------ | --------------------------------------------------------------------------------------------- |
| **TypeScript everywhere**      | Apps + packages cùng ngôn ngữ                                                                 |
| **Zod single source of truth** | Schema validation API, form client, AI structured output — định nghĩa trong `@aucobot/shared` |
| **Không GraphQL**              | REST + WebSocket đủ cho một web client; Zod trong `@aucobot/shared` |
| **Không LangChain**            | AI qua Vercel AI SDK — gọn, native TS                                                         |
| **Không UI kit ngoài**         | Frontend tự viết components + CSS Modules                                                     |

### Tech Stack — Backend

| Công nghệ             | Package / ghi chú                                                    | Vai trò                                              |
| --------------------- | -------------------------------------------------------------------- | ---------------------------------------------------- |
| **NestJS 11**         | `@nestjs/core`, `@nestjs/platform-express`, `@nestjs/websockets`, `ws` | HTTP REST + WebSocket gateway |
| **Prisma**            | `@aucobot/database`                                                  | PostgreSQL ORM, migrations                           |
| **Zod**               | `nestjs-zod` hoặc custom pipe                                        | Validate request body/query — thay `class-validator` |
| **BullMQ**            | `@nestjs/bullmq`, `bullmq`                                           | Queue delayed job, retry, concurrency                |
| **Redis**             | `ioredis`                                                            | Backend BullMQ                                       |
| **Auth**              | `@nestjs/passport`, `@nestjs/jwt`, `passport-jwt`, `passport-oauth2` | OAuth Meta/TikTok + JWT session **httpOnly cookie**  |
| **cookie-parser**     | middleware Nest                                                      | Đọc session cookie                                   |
| **Token encryption**  | `node:crypto` (AES-256-GCM)                                          | Mã hóa OAuth token trong `social_accounts`           |
| **@nestjs/config**    | —                                                                    | Env                                                  |
| **@nestjs/throttler** | —                                                                    | Rate limit API (chống spam job)                      |
| **@nestjs/schedule**  | —                                                                    | Cron refresh token OAuth                             |
| **nestjs-pino**       | `pino`                                                               | Structured logging (job/worker)                      |
| **helmet**            | —                                                                    | Security headers                                     |
| **@nestjs/terminus**  | —                                                                    | Health Redis + DB (sau MVP)                          |

**Auth flow (đã chốt):**

```text
Email (web /login + /register — 2 route, unified verify, Zustand):
  POST /api/auth/email/send-code     → { email, purpose } — KHÔNG tạo user (purpose = email copy)
  POST /api/auth/email/verify-code   → OTP đúng → create nếu mới / login nếu có → Set-Cookie
  POST /api/auth/email/resend-code   → cooldown 60s

Google (web):
  GET /api/auth/google → callback → Set-Cookie

Session:
  web → fetch(API, { credentials: 'include' })
  API → JwtStrategy đọc cookie → req.user.user_id
```

Chi tiết OTP: [`apps/api/src/core/auth/README.md`](apps/api/src/core/auth/README.md) · Web: [`apps/web/app/(auth)/README.md`](apps/web/app/(auth)/README.md).

**Cross-domain (Vercel + Railway):** dùng subdomain chung (`app.` / `api.`) + `Domain=.aucobot.vn` trên cookie.

### Tech Stack — Frontend

| Công nghệ                      | Ghi chú                     | Vai trò                                           |
| ------------------------------ | --------------------------- | ------------------------------------------------- |
| **Next.js 16**                 | App Router, Turbopack default | UI, SSR, deploy Vercel                            |
| **React 19**                   | —                           | UI library                                        |
| **CSS Modules**                | `*.module.css`              | Styling scoped — **không Tailwind, không shadcn** |
| **Components tự viết**         | `apps/web/components/`      | Design system nội bộ                              |
| **Storybook**                  | `@storybook/nextjs`         | Stories cho từng component — dev UI độc lập       |
| **Zod**                        | import từ `@aucobot/shared` | Validate form                                     |
| **react-hook-form**            | `@hookform/resolvers/zod`   | Form UX                                           |
| **Zustand**                    | `stores/<domain>/`            | Buffer stream + projection server state — **không** business logic |
| **TanStack Query**             | `@tanstack/react-query`       | Optional: cache REST snapshot; job status chủ yếu qua WS |
| **Luxon** hoặc **date-fns-tz** | —                           | Timezone lịch đăng (`Asia/Ho_Chi_Minh`)           |

**Quy ước component:**

```text
components/Button/
  Button.tsx           # logic + JSX, import styles from './Button.module.css'
  Button.module.css    # class scoped
  Button.stories.tsx   # Storybook variants
  index.ts             # re-export
```

`app/` chỉ **compose** components — không nhét CSS/layout phức tạp trực tiếp trong page.

### Tech Stack — AI (`packages/llm-services`)

| Công nghệ                | Vai trò                                                    |
| ------------------------ | ---------------------------------------------------------- |
| **Vercel AI SDK** (`ai`) | Stream, tool calling, orchestration                        |
| **@ai-sdk/togetherai**   | Provider Together AI (Qwen / Llama)                        |
| **Zod**                  | `generateObject` — caption, schedule intent, learning JSON |

### Tech Stack — Shared (`packages/shared`)

| Công nghệ           | Vai trò                                                      |
| ------------------- | ------------------------------------------------------------ |
| **Zod**             | API schemas, form schemas, AI output schemas, env validation |
| **Types/constants** | `HealthResponse`, `UserResponse`, ports, …                   |

### Tech Stack — Social & queue

| Công nghệ               | Package              | Vai trò                       |
| ----------------------- | -------------------- | ----------------------------- |
| **Fetch / ky**          | `social-providers`   | Gọi Graph API, TikTok API     |
| **Zod**                 | parse response ngoài | Runtime safety                |
| **Vercel AI SDK tools** | `mcp-core`           | Tool calling bọc publish/read |

### Tech Stack — Storage & tài liệu (phase sau)

| Công nghệ                                | Vai trò                                         |
| ---------------------------------------- | ----------------------------------------------- |
| **Cloudflare R2** + `@aws-sdk/client-s3` | Upload PDF/ảnh                                  |
| **pdf-parse**, **mammoth**               | Extract text ngắn (< 30 trang → context window) |
| **pgvector** + EmbedJs                   | Defer — RAG tài liệu dài                        |

### Tech Stack — Observability & CI

| Công nghệ                                       | MVP                           |
| ----------------------------------------------- | ----------------------------- |
| **Sentry** (`@sentry/nestjs`, `@sentry/nextjs`) | Khuyến nghị sớm               |
| **Vitest**                                      | Unit test packages            |
| **Playwright**                                  | E2E trước launch              |
| **GitHub Actions**                              | `typecheck`, `build`, migrate |
| **Docker Compose**                              | Local PostgreSQL + Redis      |

### Defer (post-MVP)

| Công nghệ             | Lý do defer                            |
| --------------------- | -------------------------------------- |
| Clerk / Auth0         | Passport+JWT đủ kiểm soát token FB     |
| LangChain             | Nặng, trùng Vercel AI SDK              |
| Tailwind / shadcn     | Đã chốt CSS Modules + components riêng |
| Tách worker AWS       | Chưa có metric queue backlog           |
| Stripe, email service | Chưa billing                           |

---

### `packages/database`

Prisma schema (PostgreSQL) và export client.

**Models hiện có (✅):** `User`, `RefreshToken`, `EmailOtpChallenge`, `Conversation` (enum `ConversationType: room | session`).
**Models 💡 (thêm theo vòng):** `Message`, `Agent`, `Bot`, `BotTemplate`, `ConversationMember`, `Workspace`, `WorkspaceMember`, `AgentGrant`, `SocialAccount`, `Approval`, `ScheduledPost`, `AuditLog` — xem [Model DB tiến hóa](#model-db-tiến-hóa-hiện-tại--tương-lai).

```
packages/database/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── src/index.ts
```

### `packages/shared`

**Zod schemas** (single source of truth), types, event contracts và constants dùng chung giữa `web`, `api`, `llm-services`.

Ví dụ schema planned: `CreateScheduledPostSchema`, `GenerateCaptionSchema`, `SessionUserSchema`, `UserResponseSchema`.

### `packages/social-providers`

Abstraction Facebook Graph API và TikTok Marketing API.

### `packages/mcp-core`

MCP tools — bọc `social-providers` cho Vercel AI SDK tool calling.

### `packages/llm-services`

Prompt + Together AI qua Vercel AI SDK, structured output (Zod).

## Sơ đồ phụ thuộc code

```
                    ┌─────────────┐
                    │    web      │  → Vercel
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   shared    │◄──────────────────────────┐
                    └──────┬──────┘                           │
                           │                                  │
              ┌────────────┼────────────┐                     │
              ▼            ▼            ▼                     │
       ┌────────────┐ ┌───────────┐ ┌──────────────┐          │
       │  database  │ │llm-services│ │social-providers│       │
       └─────┬──────┘ └─────┬─────┘ └───────┬──────┘          │
             │              │               │                  │
             └──────────────┼───────────────┘                  │
                            ▼                                  │
                     ┌─────────────┐                           │
                     │  mcp-core   │───────────────────────────┘
                     └──────┬──────┘
                            │
                            ▼
                     ┌─────────────┐
                     │ api         │  → Railway (+ Worker gộp)
                     └─────────────┘
```

## Biến môi trường

```env
# Database
DATABASE_URL="postgresql://..."

# Redis (khi có BullMQ)
REDIS_URL="redis://..."

# API server
API_PORT=4000
WEB_ORIGIN="http://localhost:3000"

# Next.js
NEXT_PUBLIC_API_URL="http://localhost:4000"

# AI (phase tiếp theo)
TOGETHER_API_KEY=

# Feature plugins (comma-separated)
ENABLED_FEATURES=facebook,tiktok,publishing,approvals,documents,ai-orchestration

# Web search (feature plugin)
TAVILY_API_KEY=

# Auth & session (NestJS Passport + JWT cookie)
JWT_SECRET=
JWT_EXPIRES_IN=7d
TOKEN_ENCRYPTION_KEY=          # 32 bytes hex — encrypt OAuth tokens in DB

# Facebook OAuth
META_APP_ID=
META_APP_SECRET=
META_REDIRECT_URI=

# TikTok OAuth (v1.1)
TIKTOK_CLIENT_KEY=
TIKTOK_CLIENT_SECRET=
```

## Scripts gốc (root)

| Lệnh              | Mô tả                         |
| ----------------- | ----------------------------- |
| `pnpm dev`        | Dev mode toàn monorepo        |
| `pnpm dev:web`    | Next.js :3000                 |
| `pnpm dev:api`    | NestJS :4000                  |
| `pnpm storybook`  | Storybook UI components (web) |
| `pnpm build`      | Build toàn monorepo           |
| `pnpm typecheck`  | Kiểm tra types                |
| `pnpm db:migrate` | Prisma migrate dev            |
| `pnpm db:push`    | Prisma db push                |
| `pnpm db:studio`  | Prisma Studio                 |

## Trạng thái hiện tại

| Hạng mục | Trạng thái |
| --------------------------------------------------- | ------------------------------- |
| Monorepo + Turborepo | ✅ |
| PostgreSQL + Prisma (User, auth OTP) | ✅ |
| NestJS auth: OTP + Google + JWT cookie | ✅ |
| NestJS health | ✅ |
| Redis OTP rate limit | ✅ |
| Next.js: subdomain + `/app` shell, landing, login | ✅ |
| Hash routing (`#conversationId`) | ✅ |
| **Chat Phase 1: Room + Session CRUD + UI tạo phòng** | ✅ |
| Chiến lược mở rộng (tenancy, ID, tách DB) | ✅ doc; 💡 implement theo vòng |
| Docker API image + Railway deploy | ✅ |
| Key quảng cáo: **「Xây dựng Phòng Marketing Ảo」** | ✅ (marketing); Room = tên kỹ thuật |
| Kiến trúc **core + features (plugin)** | ✅ doc; 💡 implement dần |
| Giao thức **REST + WebSocket** | ✅ chốt; 💡 WS gateway |
| Agent preset, MCP, approval, publish | 💡 |
| BullMQ worker | 💡 |
| Frontend `STRUCTURE.md` + ESLint | ✅ |
| Frontend CSS Modules + Storybook | 💡 |
| Tách worker service riêng | ⏸️ Defer post-MVP |
