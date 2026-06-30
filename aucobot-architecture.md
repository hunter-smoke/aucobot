# Aucobot — Architecture

> Tài liệu mô tả **ý tưởng giải pháp**, **key quảng cáo**, **MVP features**, **cấu trúc monorepo** và **kiến trúc kỹ thuật**. **Ưu tiên hiện tại: API (`apps/api`).**

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

## MVP — Tính năng (đã chốt)

### Ưu tiên phát triển: **API trước**

Giai đoạn hiện tại tập trung **`apps/api`** — NestJS modules, Prisma schema, MCP tools, queue worker. Frontend (`apps/web`) gọi API sau khi contract ổn định.

```text
Phase hiện tại:  API + Database + Redis/BullMQ + MCP core
Phase song song:  Web scaffold (folder + rule) — frontend mỏng, stream-only
Phase sau:        Implement UI chat (CSS Modules) khi API contract ổn định
```

### Mô hình sản phẩm: Phòng marketing ảo khép kín

```text
User (workspace)
 └── Department — Phòng marketing ảo (1/user MVP, mở rộng sau)
      ├── Brand kit chung (tone, ngành, quy tắc)
      ├── Document library (brochure, brief…)
      ├── Agents (preset + tùy chỉnh sau)
      │    ├── Orchestrator — nhận lệnh user, chia việc
      │    ├── Content — viết caption (tools: read_doc, web_search)
      │    ├── Scheduler — lên lịch (tools: schedule_post)
      │    └── Publisher — đăng bài (tools: publish FB/TikTok via MCP)
      ├── Approval queue — bài chờ user duyệt
      └── Jobs / audit — trạng thái + lịch sử thực thi
```

### Tính năng P0 — MVP bắt buộc

| # | Tính năng | API / ghi chú |
|---|-----------|---------------|
| 1 | **Auth + session** | Passport + JWT httpOnly cookie |
| 2 | **OAuth Facebook + TikTok** | Lưu token encrypt trong `social_accounts` |
| 3 | **Department CRUD** | 1 phòng marketing / user (MVP) |
| 4 | **Agent preset + setup** | Wizard API → sinh system prompt từ form (ngành, tone, brand) |
| 5 | **Tool allowlist / agent** | Mỗi agent chỉ gọi MCP tools được gán |
| 6 | **MCP tools — social** | `list_accounts`, `create_draft`, `schedule_post`, `publish_post`, `get_post_status` |
| 7 | **MCP tools — knowledge** | `read_document`, `web_search` (Tavily/Serper) |
| 8 | **Human-in-the-loop** | `POST approve` → mới enqueue publish |
| 9 | **BullMQ worker** | Delayed job đăng bài + retry + idempotency |
| 10 | **Task / job status API** | Poll trạng thái: draft → pending_approval → scheduled → published / failed |
| 11 | **Audit log** | Agent nào làm gì, lúc nào |
| 12 | **Agent memory / learning** | `update_agent_memory` — insight JSON sau bài thành công |

### Agent setup wizard (API contract)

User không viết raw system prompt — backend sinh từ structured input:

| Bước | Input | Output |
|------|-------|--------|
| 1 | Mẫu ngành (shop, spa, BĐS, custom) | Department + brand kit |
| 2 | Tên thương hiệu, tone, đối tượng KH | Brand kit JSON |
| 3 | Kết nối FB / TikTok | `social_accounts` linked |
| 4 | Chọn agent preset (Content, Scheduler, Publisher) | Agents + tool allowlist |
| 5 | Test sandbox | Chạy thử agent — **không đăng thật** |

Endpoints planned: `POST /api/departments`, `POST /api/departments/:id/agents`, `POST /api/departments/:id/setup/complete`, `POST /api/departments/:id/sandbox/run`

### MCP tools — danh sách planned (`packages/mcp-core`)

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
| `update_agent_memory` | Ghi insight học được theo user/department |

**Orchestration (agent ↔ agent):**

| Tool | Mô tả |
|------|--------|
| `handoff_to_agent` | Content → Scheduler: truyền structured payload (Zod) |
| `list_pending_approvals` | Orchestrator liệt kê bài chờ duyệt |

### Approval queue & job state machine

```text
draft → pending_approval → approved → scheduled → publishing → published
                        ↘ rejected
                        ↘ failed (retry tối đa N lần)
```

API: `GET /api/departments/:id/approvals`, `POST /api/approvals/:id/approve`, `POST /api/approvals/:id/reject`

### Defer (post-MVP v1)

| Tính năng | Lý do |
|-----------|--------|
| Unlimited custom agents | Preset 3–4 agent đủ demo |
| Comment / inbox automation | Scope & risk cao |
| RAG / pgvector | Doc ngắn → context window |
| Analytics agent riêng | Sau khi có insights API ổn |
| Billing / team workspace | Sau product-market fit |

### Schema DB planned (bổ sung Prisma)

| Model | Vai trò |
|-------|---------|
| `Department` | Phòng marketing ảo |
| `Agent` | Agent trong phòng (role, instructions, tool allowlist) |
| `BrandKit` | Tone, rules, industry template |
| `Approval` | Hàng đợi duyệt bài |
| `AgentMemory` | Learning JSON per department/agent |
| `AuditLog` | Who / which agent / what / when |

*(Models hiện có: `User`, `SocialAccount`, `Document`, `ScheduledPost`, `PostResult`, `AgentLearning` — sẽ mở rộng / map khi implement API.)*

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
4. web nhận event `job.status` qua WebSocket (cùng socket department)
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
  → WSS /api/ws/departments/:departmentId
  → JSON event envelope (Zod trong @aucobot/shared)
  → web: lib/stream → hooks → stores → UI
```

**REST — ví dụ:**

| Method | Path | Mục đích |
|--------|------|----------|
| POST | `/api/departments/:id/messages` | User gửi tin → API bắt đầu agent |
| GET | `/api/departments/:id/messages` | History / snapshot (RSC + client) |
| POST | `/api/approvals/:id/approve` | Duyệt bài |
| POST | `/api/scheduled-posts` | Tạo lịch đăng |

**WebSocket — một connection / department khi mở chat:**

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

### Kiến trúc API: Core + Features (plugin)

API chia **`src/core`** (nền tảng bắt buộc) và **`src/features`** (cắm / rút như plugin). Core **không phụ thuộc** feature nào; feature chỉ phụ thuộc core qua **contract** (interface / event).

#### Nguyên tắc

| Nguyên tắc | Mô tả |
|------------|--------|
| **Core luôn chạy** | Auth, health, department shell, agent registry, queue infra, audit — tắt feature không làm sập API |
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
    │  auth, departments  │                 │  facebook, tiktok     │
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
| `config/` | Env validation (Zod), `ENABLED_FEATURES`, feature flags |
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
| `departments/` | Phòng marketing ảo — CRUD, brand kit cơ bản |
| `agents/` | Agent registry: role, instructions, **tool allowlist** (tools lấy từ plugin registry) |

**`common/` chi tiết:**

| Thư mục | Ví dụ |
|---------|--------|
| `decorators/` | `@CurrentUser()`, `@Public()`, `@RequireDepartment()` |
| `filters/` | `HttpExceptionFilter`, `ZodExceptionFilter` |
| `interceptors/` | `LoggingInterceptor`, `TransformInterceptor` |
| `middleware/` | `RequestIdMiddleware` |
| `pipes/` | `ZodValidationPipe` |
| `utils/` | `encryptToken`, `parseTimezone` — helpers thuần |

**Ranh giới core vs feature:**

| Thuộc core | Thuộc feature |
|------------|---------------|
| User, auth, department shell, agent registry | OAuth Facebook/TikTok, MCP tools social |
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
| `documents` | Upload, extract text, `read_document` tool | core `departments` |
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
│   ├── departments/
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
  api-core          → auth, users, departments, agents, plugin gateway
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

**Ưu tiên implement:** `core/common` + `core/plugins` → `core/departments` → `core/agents` → `features/facebook` → `features/publishing` → `features/approvals`

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

**Endpoints hiện có:**

| Method | Path          | Mô tả                  |
| ------ | ------------- | ---------------------- |
| GET    | `/api/health` | Health + trạng thái DB |
| GET    | `/api/users`  | Danh sách users        |
| POST   | `/api/users`  | Tạo user               |

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
│   ├── departments/
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

**Ưu tiên implement:** `core/common` + `core/plugins` → `core/departments` → `core/agents` → `features/facebook` → `features/publishing` → `features/approvals`

### `apps/web`

Frontend Next.js 16 (App Router) — deploy **Vercel**. **Frontend mỏng:** chỉ stream & hiển thị; não nghiệp vụ ở `apps/api`.

**Phụ thuộc nội bộ:** `@aucobot/shared`

**Stack (đã chốt):** xem [Tech Stack — Frontend](#tech-stack--frontend)

**Quy ước UI:**

| Quy ước | Mô tả |
| -------- | ----- |
| **Frontend mỏng** | Next.js + Zustand buffer stream; không logic agent/approval/job trên client |
| **UX Telegram-style** | List thread (phòng marketing) \| chat full-bleed — không dashboard AI SaaS |
| **CSS Modules** | `ComponentName.module.css` — không Tailwind / UI kit ngoài |
| **Components tự viết** | `components/ui`, `layout`, `chat` |
| **Storybook** | `.stories.tsx` cạnh component — defer đến khi có `components/ui` |

**Sơ đồ folder (đã scaffold — xem `README.md` từng folder):**

> Chi tiết: [`apps/web/STRUCTURE.md`](apps/web/STRUCTURE.md) · rule: [`apps/web/.agent/rule.md`](apps/web/.agent/rule.md)

```text
apps/web/
├── STRUCTURE.md
├── app/
│   ├── (auth)/                    login, register
│   ├── (main)/                    shell Telegram-style
│   │   ├── page.tsx               thread list
│   │   └── c/[departmentId]/      chat + ClientChatPage
│   └── setup/                     wizard form → API
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
├── proxy.ts                       auth guard (planned)
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
| `departments.ts` | `/api/departments` |
| `agents.ts` | agents trong department |
| `messages.ts` | chat REST (nếu có) |
| `approvals.ts` | approval queue |
| `scheduled-posts.ts` | lịch đăng; status qua WS `job.status` |

**Giao thức:** REST (lệnh) + WebSocket (push) — không GraphQL. Xem [Giao thức client web](#giao-thức-client-web-đã-chốt-rest--websocket).

**Trạng thái:** folder + `README.md` đã tạo; code MVP tạm (`app/page.tsx`, `lib/http`, `lib/api/auth`). UI chat chờ API contract.

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

Password (admin/dev only — ẩn web MVP):
  POST /api/auth/login | register | verify-email (link legacy)

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

**Models:** `User`, `SocialAccount`, `Document`, `ScheduledPost`, `PostResult`, `AgentLearning`

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

| Hạng mục                                            | Trạng thái                      |
| --------------------------------------------------- | ------------------------------- |
| Monorepo + Turborepo                                | ✅                              |
| PostgreSQL + Prisma schema (base)                   | ✅                              |
| NestJS `apps/api` (health, users)                   | ✅                              |
| Đổi tên `@aucobot/api`, cấu trúc core/features      | ✅ Đã chốt trong doc            |
| Next.js 16 web — folder scaffold + rule (frontend mỏng) | ✅ Scaffold + MVP tạm |
| Next.js 16 web — UI chat implement                     | 🔜 Sau API contract   |
| Kiến trúc MVP deploy (Vercel + Railway)             | ✅ Đã chốt                      |
| Key quảng cáo: **「Xây dựng Phòng Marketing Ảo Của Riêng Bạn」** | ✅ Đã chốt           |
| MVP features spec (department, agents, MCP, approval) | ✅ Đã chốt                    |
| API architecture: **core + features (plugin)**      | ✅ Đã chốt                    |
| Giao thức client: **REST + WebSocket** (không GraphQL) | ✅ Đã chốt            |
| **API: WebSocket gateway** (`/api/ws/departments/:id`) | 🔜                              |
| Tech stack (Zod, BullMQ, Passport, AI SDK, MCP)     | ✅ Đã chốt                      |
| **Scaffold `core/common` + `core/plugins` registry** | ✅                              |
| Refactor `apps/api` → `core/` + `features/`          | ✅                              |
| **core: departments + agents (implement)**           | 🔜                              |
| **API: MCP tools FB/TikTok**                        | 🔜                              |
| Redis + BullMQ worker                               | 🔜                              |
| Auth Passport + JWT cookie                          | 🔜                              |
| Approval queue + audit log                          | 🔜                              |
| Frontend folder + `STRUCTURE.md` + ESLint Phase A    | ✅                              |
| Frontend CSS Modules + `components/ui` + Storybook   | 🔜 Sau API                      |
| Tách worker service riêng                           | ⏸️ Defer post-MVP               |
