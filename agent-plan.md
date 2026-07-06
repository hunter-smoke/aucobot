# Aucobot — Agent Plan

> Kế hoạch nghiên cứu & triển khai **Agent có hồn** — định danh, não, kỹ năng, tự động hóa.  
> Bổ sung cho [`aucobot-architecture.md`](./aucobot-architecture.md); không thay thế doc kiến trúc tổng.

### Ký hiệu trạng thái

| Ký hiệu | Ý nghĩa |
|---------|---------|
| **✅ Đã làm** | Có trong repo |
| **🔜 Phase A/B/C** | Lộ trình đề xuất trong plan này |
| **💡 Ý tưởng** | Thiết kế / nghiên cứu thêm, chưa cam kết |

---

## Mục tiêu sản phẩm

User tạo **trợ lý AI** giống **contact Telegram** — có tên, avatar, giọng điệu, biết việc của phòng, **hành động được** (gọi tool), không chỉ chat.

**「Hồn」trong Aucobot** = bốn lớp chồng nhau:

```text
Identity     — nhận ra được (avatar, tên, tone)
Instructions — hành xử nhất quán (system prompt compiled)
Context      — biết room / user / tài liệu
Agency       — bật nhóm kỹ năng (MCP) / bot khi cần
```

Chưa cần RAG, vector memory hay cron phức tạp để **cảm nhận hồn** — Phase A đủ nếu chat đúng persona + stream mượt.

---

## Bốn trụ nghiên cứu → map Aucobot

| # | Trụ (nghiên cứu) | Entity / module Aucobot | Phase |
|---|------------------|-------------------------|-------|
| 1 | **Định danh** — profile, tone, background | `Agent` + UI chat | A |
| 2 | **Bộ não & ký ức** — agent.md, RAG, long-term memory | `instructionsCompiled`, `AgentDocument`, `AgentMemory` | A → B |
| 3 | **Nhóm kỹ năng** — MCP tích hợp sẵn | `enabledSkillGroups` + `core/plugins` + `features/*` | A → C |
| 4 | **Phản xạ & tự động** — trigger, workflow | **`Bot`** (không gộp vào Agent) | C |

### Quy tắc vàng: Agent 🧠 vs Bot ⚙️

| | **Agent** | **Bot** |
|---|-----------|---------|
| Bản chất | LLM reasoning + tool calling | Ghép **Block** + glue, **không LLM** lúc chạy |
| Ai tạo | User (wizard) — **Mother** đẻ | **Agent lắp ráp** từ Block hệ thống |
| Trigger | User tag `@agent` | `schedule` · `event` · `agent-invoked` |
| Ví dụ | "Viết 5 caption theo brand kit" | "9h sáng gửi báo cáo vào room" |
| Workflow vẽ tay (Coze) | ❌ | **Bot Template** 💡 |

> **Trụ 4 không nhét vào Agent.** Cron / event / DAG deterministic → `Bot` (ghép `Block`). Xem [Bot Workflow trong `aucobot-architecture.md`](./aucobot-architecture.md#bot-workflow--thiết-kế-mở-rộng-tham-khảo-khi-scale).

### Block vs Bot vs Agent — ai tạo cái gì (chốt)

| Khái niệm | Là gì | Ai tạo |
|-----------|-------|--------|
| **Block** (Lego) | Đơn vị 1-việc dựng sẵn: Cron, Scraper, LLM Transformer, Publisher… | **Hệ thống** — catalog cố định, vetted |
| **Bot** | Nhiều Block ghép + glue → chạy được | **Agent lắp ráp** khi user cần (**không** qua Mother, **không** "xin bot") |
| **Agent** | Trợ lý có hồn, reasoning | **User** qua wizard; **Mother** đẻ (đề xuất → user ký) |

- **Mother chỉ đẻ Agent.** Bot do agent tự nhặt/ghép Block.
- **Chế độ dùng Bot:** (A) chạy ngay một lần = zero ceremony; (B) **Automation đứng nền** = user **bật/tắt/sửa/xóa**, luôn thấy nó tồn tại.
- **Thiếu Block:** agent được **sinh JS inline** cho việc đó — user vẫn kiểm soát (xem/duyệt/tắt) + ghi **tín hiệu roadmap** để platform thêm Block. Không tự thêm Block vào catalog.
- **Side-effect ra ngoài** (đăng bài): qua **Approval queue nội dung** — duyệt *kết quả*, không duyệt *bot*.

---

## Phạm vi & quan hệ với Room / Session

```text
User
 └── Agent (sở hữu user — tái sử dụng)
       │
       ├── ConversationMember → Room (nhiều agent + orchestrator 💡)
       └── ConversationMember → Session (1 agent mặc định)
```

| Loại hội thoại | Agent |
|----------------|-------|
| **Session** | 1 assistant mặc định — chat 1-1, không tag vẫn trả lời |
| **Room** | Nhiều agent; **mention-only** (không tag → không ai trả lời) 💡 |

**Đề xuất chốt:** Agent **thuộc user** (`ownerId`), gắn vào room/session qua `ConversationMember` — giống danh bạ Telegram.

### Room — orchestrator & định tuyến (đã chốt trong `aucobot-architecture.md`)

| Khái niệm | Quyết định |
|-----------|------------|
| Topology | **Star** — agent không gọi agent; mọi phối hợp qua `@Trợ Lý` |
| `@Trợ Lý` | Cửa **mặc định** (phó mặc), không độc quyền — user tag thẳng `@Mai` khi biết rõ |
| Session | **Không** có orchestrator — 1 assistant mặc định |
| Room | Auto-provision `@Trợ Lý`; mention-only khi không tag |
| Không ai làm được | Gợi ý actionable: tạo agent / bật nhóm kỹ năng |
| Sub-room / thợ tạm | 💡 seam defer — xem architecture |

### AucoMother — Factory Agent (BotFather-style) 💡

Agent hệ thống, pre-provision (Session cố định lần đầu đăng ký) — **cửa duy nhất để đẻ Agent mới**.

| Đặc điểm | Chi tiết |
|----------|----------|
| Vai trò | **Chỉ đẻ Agent** (tuyển người) — không đẻ Bot |
| UX | Chat từng bước (BotFather) → **card khai sinh** → user bấm Tạo |
| Tool | `propose_agent`, `list_my_agents`, `list_skill_groups` — **không** `create_*` tự động |
| Nguyên tắc | Mother **soạn nháp**, user **ký** (POST /api/agents); Mother không tự INSERT |
| Vì sao tập trung | Kiểm soát "ai trong công ty" + audit + cap theo plan |

> **Bot không qua Mother** — agent tự nhặt/ghép Block khi cần. Mother và việc-tạo-Bot là 2 chuyện tách biệt (xem Block vs Bot ở trên).

---

## Phase A — Agent sống trong chat 🔜

**Mục tiêu:** Tạo agent → gắn conversation → chat stream — cảm giác contact thật.

### A.1 Định danh (Identity)

| Field | Kiểu | Ghi chú |
|-------|------|---------|
| `name` | string | Bắt buộc |
| `avatarUrl` | string? | Upload hoặc preset icon |
| `bio` | string? | Lời giới thiệu ngắn (sidebar / profile) |
| `tonePreset` | enum | `friendly` \| `professional` \| `casual` |
| `toneNotes` | string? | "Xưng bạn, dùng emoji" |
| `backgroundStory` | string? | Backstory cho role-play |
| `presetId` | enum? | Hạt giống wizard — `content` \| `customer-care` \| `orchestrator` \| `custom` |
| `role` | string | Chức danh — chọn từ list có sẵn **hoặc** tự đặt |
| `description` | string? | Ai là agent, làm gì, **không làm gì** (khung gợi ý) |

**Ba field không đá nhau:**

| Field | Vai trò | Bền vững? |
|-------|---------|-----------|
| `presetId` | **Hạt giống** — chọn xong tự điền role + tone + gợi ý skillGroups | Chỉ lúc tạo |
| `role` | **Chức danh** hiển thị + gợi ý orchestrator | Lưu bền |
| `description` | Chi tiết routing (làm gì / không làm gì) | Lưu bền |

**Role catalog (chọn sẵn hoặc custom):**

| Role preset | Gợi ý presetId |
|-------------|----------------|
| Content writer | `content` |
| Customer support | `customer-care` |
| Trợ Lý (orchestrator) | `orchestrator` |
| Analyst, Designer, … | `custom` |
| *Tự đặt tên* | `custom` — user nhập role string |

**Preset catalog (hạt giống wizard):**

| Preset | Vai trò | Nhóm kỹ năng gợi ý (bật sẵn) |
|--------|---------|------------------------------|
| **Content** | Viết caption, social copy | Facebook, TikTok 💡 |
| **Customer Care** | Trả lời CS, chính sách | Tài liệu, Notion 💡 |
| **Orchestrator** (`@Trợ Lý`) | Điều phối agent trong room | — (orchestrator không cần skillGroups) |

### A.2 Bộ não (Brain) — compile prompt, không expose raw `agent.md`

User điền wizard → backend **sinh** `instructionsCompiled`:

```text
## Identity
{name} — {bio}

## Background
{backgroundStory}

## Tone
{preset} — {toneNotes}

## Role & scope
{role}
{description}                    # làm gì + KHÔNG làm gì

## Runtime context (inject mỗi lần chat)
- Conversation: {title}, {description}
- Type: room | session
```

Lưu song song:

| Field | Mục đích |
|-------|----------|
| `instructionsSource` | JSON form gốc — sửa wizard |
| `instructionsCompiled` | System prompt dùng khi gọi LLM |

**Không** cho user sửa file markdown thô ở MVP — giảm prompt injection & hỗ trợ khó.

### A.3 Nhóm kỹ năng (MCP in-process)

Platform **tích hợp sẵn MCP** trong `packages/mcp-core` + `features/*` — user **không tải** skill/plugin từ bên ngoài. UX chỉ **bật/tắt nhóm kỹ năng** per agent.

```text
Agent.enabledSkillGroups: string[]   # id nhóm user bật trong wizard
```

Mỗi **nhóm kỹ năng** = một tích hợp MCP (logo + tên thân thiện) → map nội bộ sang nhiều tool trong registry. User không thấy từng tool lẻ.

**Ba tầng lọc:**

```text
ENABLED_FEATURES (platform)  → nhóm nào tồn tại trên server
enabledSkillGroups (agent)   → agent này được phép dùng nhóm nào
OAuth / API key (user)       → nhóm đó gọi được thật hay chưa (vd. chưa connect Drive)
```

**Catalog nhóm kỹ năng (mở rộng dần):**

| Nhóm (`id`) | UX label | MCP / feature | Phase |
|-------------|----------|---------------|-------|
| `web-search` | Tra cứu web | Tavily / Serper | A 💡 |
| `facebook` | Facebook | Meta Graph, đăng/lên lịch | C 💡 |
| `tiktok` | TikTok | TikTok Marketing API | C 💡 |
| `google-drive` | Google Drive | Đọc/ghi file, Docs | C 💡 |
| `notion` | Notion | Trang, database | C 💡 |
| `documents` | Tài liệu phòng | Upload PDF/MD trong app | B 💡 |

Phase A có thể **chỉ chat** (không bật nhóm nào) hoặc bật `web-search`.

### A.3b Capability manifest — orchestrator đọc để route (2 lớp)

Mỗi agent export manifest cho `@Trợ Lý` trong room:

| Tín hiệu | Dùng để | Kiểu |
|----------|---------|------|
| `enabledSkillGroups` | **LỌC cứng** — ai *làm được* | Máy đọc |
| `role` | Hiển thị + gợi ý | Người đọc — **không** route bằng tên custom |
| `description` | **CHỌN mềm** — ai *hợp nhất* | Orchestrator reasoning |

```text
Lớp 1 — LỌC: agent nào CÓ skillGroups cần thiết?
Lớp 2 — CHỌN: trong nhóm lọc, đọc description (+ negative scope) → ai hợp nhất
         ≥2 agent ngang nhau → giao đại (round-robin), KHÔNG hỏi user
         0 agent → báo user + gợi ý [Tạo agent] / [Bật kỹ năng X]
```

**💡 defer:** user đặt "agent chính" cho mỗi skill trong room (ưu tiên khi ≥2 hợp).

### A.4 Chat loop

```text
POST /api/conversations/:id/messages     user gửi tin
  → resolve agent:
      session → default assistant
      room + @Trợ Lý → orchestrator dispatch (2 lớp manifest)
      room + @Mai → thẳng Mai (bỏ orchestrator)
      room + reply-to → agent đó
  → build messages[] + instructionsCompiled + history
  → Vercel AI SDK stream (features/ai-orchestration)
  → WSS message.chunk / message.done
```

### A.5 Deliverables Phase A

| Hạng mục | Path / artifact |
|----------|-----------------|
| Prisma | `Agent`, `ConversationMember`, `Message` 💡 |
| API | `core/agents/` CRUD + compile prompt |
| Feature | `features/ai-orchestration/` |
| Realtime | `core/realtime/` WebSocket 💡 |
| Web | Wizard tạo agent + hiển thị trong room |
| Shared | Zod schemas `@aucobot/shared` |

---

## Phase B — Nhớ & biết việc 🔜

### B.1 Knowledge Base (RAG nhẹ)

```text
AgentDocument
  id, agentId, ownerId
  filename, storageUrl, mimeType
  status: uploading | processing | ready | failed
  extractedText?          # MVP: full text ngắn (< ~30 trang)
```

**MVP RAG:** extract text → chunk đơn giản → top-k inject context. **Defer** pgvector (đã ghi trong architecture).

### B.2 Long-term memory

Hai tầng:

| Tầng | Lưu trữ | Khi nào |
|------|---------|---------|
| **Conversation history** | `Message` | Mọi tin trong thread |
| **Agent memory** | `AgentMemory` JSON | Facts bền qua nhiều phiên |

```text
AgentMemory
  id, ownerId, agentId
  conversationId?         # null = memory global theo user+agent
  facts: Json            # [{ key, value, updatedAt }]
```

Tool 💡: `update_agent_memory` — agent tự ghi fact sau phiên quan trọng.

**Defer vector DB** đến khi key-value không đủ (semantic recall nhiều fact).

---

## Phase C — Hành động & tự chạy 💡

### C.1 Thêm nhóm kỹ năng (feature plugins)

Mỗi feature plugin đăng ký **một hoặc vài nhóm** vào `PluginRegistry` khi `ENABLED_FEATURES` bật:

| Feature module | Nhóm kỹ năng |
|----------------|--------------|
| `channels/facebook` | `facebook` |
| `channels/tiktok` | `tiktok` |
| `integrations/google-drive` | `google-drive` 💡 |
| `integrations/notion` | `notion` 💡 |
| `integrations/web-search` | `web-search` |
| `workflow/publishing` | gắn vào `facebook` / `tiktok` |
| `tools/builtin` | `documents` |

> **Không** có nhóm `agent-handoff` — phối hợp agent do orchestrator `@Trợ Lý` dispatch (star), không phải agent tự gọi agent.

### C.2 Automation → Bot (ghép Block), không Agent

| Nhu cầu user | Giải pháp |
|--------------|-----------|
| Chạy ngay một lần (trong việc) | Agent **nhặt Block** chạy luôn — zero ceremony |
| 9h sáng báo cáo vào room | Bot `trigger: schedule` (Automation đứng nền) |
| Có approval mới → notify | Bot `trigger: event` |
| Việc lặp lại | Agent **ghép Block** → Bot; user **bật/tắt/sửa/xóa** |
| Cần khối chưa có | Agent **sinh JS inline** (user kiểm soát) + tín hiệu roadmap |

**Automation đứng nền:** user luôn thấy trong danh sách Automations, toàn quyền bật / tắt / sửa / xóa. Side-effect ra ngoài (đăng bài) qua Approval queue nội dung.

### C.3 Defer

| Tính năng | Lý do |
|-----------|-------|
| Code interpreter (Python sandbox) | Security + infra nặng |
| Workflow editor vẽ tay (Coze) | Bot Template + UI riêng |
| Multi-agent mesh (agent gọi agent) | Star + orchestrator đủ — xem architecture |

---

## Model dữ liệu (đề xuất)

> Additive — không sửa `Conversation` hiện có. `userId` trên conversation = `ownerId` (seam tenancy).

### Phase A

```prisma
model Agent {
  id                    String   @id @default(cuid())
  ownerId               String   @map("owner_id")
  name                  String
  avatarUrl             String?  @map("avatar_url")
  bio                   String?
  tonePreset            String   @map("tone_preset")      // enum app layer
  toneNotes             String?  @map("tone_notes")
  backgroundStory       String?  @map("background_story")
  presetId              String?  @map("preset_id")        // hạt giống wizard
  role                  String                             // chức danh (preset hoặc custom)
  description           String?  @db.Text                  // làm gì + không làm gì
  instructionsSource    Json     @map("instructions_source")
  instructionsCompiled  String   @map("instructions_compiled") @db.Text
  enabledSkillGroups    String[] @map("enabled_skill_groups")
  createdAt             DateTime @default(now()) @map("created_at")
  updatedAt             DateTime @updatedAt @map("updated_at")

  members ConversationMember[]

  @@index([ownerId])
  @@map("agents")
}

enum ConversationMemberType {
  user
  agent
}

model ConversationMember {
  id             String                 @id @default(cuid())
  conversationId String                 @map("conversation_id")
  memberType     ConversationMemberType @map("member_type")
  userId         String?                @map("user_id")
  agentId        String?                @map("agent_id")
  role           String                 @default("member")  // owner | admin | member
  isDefault      Boolean                @default(false) @map("is_default")  // session assistant
  createdAt      DateTime               @default(now()) @map("created_at")

  conversation Conversation @relation(...)
  agent        Agent?       @relation(...)

  @@unique([conversationId, agentId])
  @@map("conversation_members")
}

enum MessageSenderType {
  user
  agent
  system
}

model Message {
  id             String            @id @default(uuid(7))
  conversationId String            @map("conversation_id")
  ownerId        String            @map("owner_id")   // seam shard
  senderType     MessageSenderType @map("sender_type")
  agentId        String?           @map("agent_id")
  content        String            @db.Text
  createdAt      DateTime          @default(now()) @map("created_at")

  @@index([conversationId, createdAt])
  @@map("messages")
}
```

### Phase B+

`AgentDocument`, `AgentMemory` — xem Phase B ở trên.  
`Bot`, `BotTemplate`, `BotVersion` — xem `aucobot-architecture.md`.

---

## API contract (draft)

### Agents

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/api/agents` | Danh sách agent của user |
| POST | `/api/agents` | Tạo agent (wizard payload) |
| GET | `/api/agents/:id` | Chi tiết |
| PATCH | `/api/agents/:id` | Sửa → recompile prompt |
| DELETE | `/api/agents/:id` | Xóa (soft delete 💡) |

**POST body (wizard):**

```json
{
  "name": "Mai Content",
  "bio": "Chuyên viết caption TikTok",
  "avatarUrl": null,
  "tonePreset": "friendly",
  "toneNotes": "Xưng bạn, emoji vừa phải",
  "backgroundStory": "5 năm content marketing F&B",
  "presetId": "content",
  "role": "Content writer",
  "description": "Viết caption TikTok, lên lịch bài.\nKHÔNG làm: phân tích số liệu, trả lời khiếu nại pháp lý.",
  "enabledSkillGroups": ["facebook", "web-search"]
}
```

### Nhóm kỹ năng (catalog)

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/api/skill-groups` | Danh sách nhóm platform hỗ trợ + trạng thái kết nối OAuth user |

Response gợi ý: `{ id, label, icon, connected, featureEnabled }` — wizard dùng để render toggle.

### Role catalog

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/api/roles` | Danh sách role preset + cho phép `custom` |

### Gắn agent vào conversation

| Method | Path | Mô tả |
|--------|------|-------|
| POST | `/api/conversations/:id/members` | `{ memberType: "agent", agentId }` |
| DELETE | `/api/conversations/:id/members/:memberId` | Gỡ agent khỏi room |
| GET | `/api/conversations/:id/members` | List members (user + agent) |

### Chat 💡

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/api/conversations/:id/messages` | History |
| POST | `/api/conversations/:id/messages` | `{ content, agentId? }` → stream WS |

---

## UX — Wizard tạo Agent (3 bước)

```text
┌─ Bước 1: Ai là agent? ─────────────────┐
│  Tên *                                  │
│  Avatar (upload / chọn icon)            │
│  Bio ngắn                               │
│  Chọn preset: Content | CS | Custom     │
└─────────────────────────────────────────┘
          ↓
┌─ Bước 2: Vai trò & tính cách ──────────┐
│  Role: [Content writer ▼] hoặc tự đặt  │
│  Mô tả (khung gợi ý):                  │
│    Agent này là ai? ______              │
│    Làm được gì? ______                  │
│    KHÔNG làm gì? ______   ← negative    │
│  Tone: Friendly / Professional / Casual │
│  Ghi chú giọng điệu (tùy chọn)         │
│  Background story (tùy chọn)            │
└─────────────────────────────────────────┘
          ↓
┌─ Bước 3: Nhóm kỹ năng ─────────────────┐
│  Bật tích hợp agent được dùng (toggle): │
│  ☐ Tra cứu web                          │
│  ☐ Facebook          [Chưa kết nối →]   │
│  ☐ Google Drive      [Kết nối]         │
│  ☐ Notion            [Kết nối]         │
│  [Phase B] ☐ Tài liệu phòng             │
│  Preview: "Xin chào, mình là Mai..."    │
└─────────────────────────────────────────┘
```

- Mỗi dòng = **một nhóm kỹ năng** (một MCP), không liệt kê tool con.
- Nhóm chưa có OAuth → toggle disabled hoặc bật nhưng agent báo *"Cần kết nối Google Drive"* khi gọi.
- Preset gợi ý nhóm bật sẵn; user chỉnh trước khi lưu.

**Session:** sau khi tạo agent → tự gắn `isDefault: true` vào session mới (hoặc chọn khi tạo session).  
**Room:** user add agent từ danh sách contact; `@Trợ Lý` auto-provision khi tạo room.

---

## Kiến trúc code

```text
apps/api/src/
├── core/
│   ├── agents/              🔜 CRUD, compile prompt, capability manifest, resolve agent
│   ├── conversations/       ✅ + members endpoint
│   ├── plugins/             💡 MCP registry (khi có tool)
│   └── realtime/            💜 WSS gateway
│
├── features/
│   ├── ai-orchestration/    🔜 LLM stream + tool loop
│   ├── integrations/web-search/
│   └── channels/facebook/   💡
│
packages/
├── llm-services/            Vercel AI SDK + Together
├── mcp-core/                Định nghĩa tool + map nhóm kỹ năng
└── shared/                  AgentSchema, CreateAgentSchema, WS events
```

**Luồng compile prompt:**

```text
CreateAgentDto (Zod)
  → AgentPromptCompiler.compile(source)
  → instructionsCompiled
  → lưu DB
```

**Luồng chat:**

```text
User message
  → ConversationAccessService.assert
  → AgentResolver.resolve(conversation, mention?)
  → PromptAssembler.build(system + memory + RAG chunks + history)
  → resolve tools từ enabledSkillGroups → registry
  → llm-services.streamText({ tools })
  → Message persist + WS push
```

---

## Thứ tự implement đề xuất

```text
Sprint 1 — Data + CRUD
  Prisma Agent, ConversationMember
  core/agents/ CRUD + prompt compiler
  shared Zod schemas

Sprint 2 — Chat cơ bản
  Message model + GET/POST messages
  features/ai-orchestration (stream, chưa tool)
  core/realtime WSS

Sprint 3 — Web wizard + UX
  Form tạo agent
  Hiển thị agent trong room sidebar
  Session default agent

Sprint 4 — Phase B kickoff
  AgentDocument upload
  AgentMemory + update tool

Sprint 5+ — Nhóm kỹ năng & Bot
  plugins registry + MCP (facebook, notion, drive…)
  Bot entity (automation)
```

---

## Quyết định cần nghiên cứu thêm

| # | Câu hỏi | Phương án | Gợi ý |
|---|---------|-----------|-------|
| 1 | Agent scope | User-level vs copy per room | **User-level** + member link |
| 2 | MVP có nhóm kỹ năng không? | Chỉ chat vs + web-search | **Chỉ chat** sprint 2; nhóm đầu tiên sprint 4 |
| 3 | Model LLM | Together model nào | Qwen / Llama — cost vs tiếng Việt |
| 4 | History window | Bao nhiêu tin inject | 20–30 tin hoặc token budget |
| 5 | Orchestrator `@Trợ Lý` | Auto mỗi room? | **Có** — preset `orchestrator`, star dispatch |
| 6 | Avatar | Upload vs AI gen | **Upload + preset** MVP |
| 7 | RAG storage | R2 vs DB text | Text ngắn DB; file → R2 💡 |
| 8 | Memory format | KV vs free text | **KV có key** — dễ audit |

---

## Tham chiếu nội bộ

| Doc | Nội dung |
|-----|----------|
| [`aucobot-architecture.md`](./aucobot-architecture.md) | Star topology, route 2 lớp, Room orchestrator |
| [`apps/api/src/core/agents/README.md`](./apps/api/src/core/agents/README.md) | Module agents (planned) |
| [`apps/api/src/features/ai-orchestration/README.md`](./apps/api/src/features/ai-orchestration/README.md) | LLM feature |
---

## Tóm tắt một dòng

**Phase A:** Agent = contact Telegram có persona + prompt compiled + chat stream.  
**Phase B:** Thêm tài liệu & memory.  
**Phase C:** Nhóm kỹ năng MCP (Facebook, Drive, Notion…) + Bot automation — **không** nhồi cron/workflow vào Agent.
