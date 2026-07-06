# ESLint — `@aucobot/api`

> Chỉ quy định **lint** cho `apps/api/`. Config: [`eslint.config.mjs`](../eslint.config.mjs) (tạo theo file này).

---

## Mục tiêu

- Bắt lỗi logic / type unsafe sớm trên `src/`
- Giữ **kiến trúc** `core/` ↔ `features/` (plugin, không import chéo feature)
- Format thống nhất (Prettier qua ESLint)
- CI sau này: `lint:ci` = **0 error**

---

## Công cụ

| Thành phần | Ghi chú |
|------------|---------|
| **ESLint 9** | Flat config `eslint.config.mjs` — **pin `eslint@^9`** (`eslint-plugin-import` chưa tương thích ESLint 10) |
| **typescript-eslint** | `recommendedTypeChecked`, `projectService: true` |
| **eslint-plugin-import** | Thứ tự import, `no-restricted-imports` |
| **eslint-plugin-prettier** | `prettier/prettier` → **error** |
| **Prettier** | `.prettierrc` repo root hoặc `apps/api` |

**Không dùng:** `eslint-config-next`, Airbnb full preset, rule copy từ project OpenClaw/control-plane khác.

---

## Scripts (`package.json`)

```json
{
  "lint": "eslint \"src/**/*.ts\" --fix",
  "lint:ci": "eslint \"src/**/*.ts\" --max-warnings 0",
  "test": "jest"
}
```

Verify local trước khi xong task:

```bash
pnpm --filter @aucobot/api lint:ci
pnpm --filter @aucobot/api test
pnpm --filter @aucobot/api build
```

---

## Cấu trúc service (`service/`)

Mọi **domain service** (`@Injectable` business logic) đặt trong thư mục **`service/`** của module. **Mỗi service một folder riêng** — không để `*.service.ts` ngang hàng controller hay ngang hàng nhau trong `service/`.

### Một service

```
core/users/
  users.controller.ts
  users.module.ts
  dto/
  service/
    users/
      users.service.ts
      users.service.test.ts
```

### Nhiều service (chuẩn: `core/auth/`)

```
core/auth/
  auth.controller.ts
  auth.module.ts
  dto/
  guards/
  strategies/
  service/
    auth/
      auth.service.ts
      auth.service.test.ts
    otp-rate-limit/
      otp-rate-limit.service.ts
      otp-rate-limit.service.test.ts
```

| Quy tắc | Ghi chú |
|---------|---------|
| Folder | `service/{tên-service}/` — kebab-case nếu tên ghép (vd `otp-rate-limit/`) |
| Tên file | `{tên-service}.service.ts` trong folder con tương ứng |
| Import (module) | `from "./service/auth/auth.service"` |
| Import (service ↔ service) | `from "../otp-rate-limit/otp-rate-limit.service"` (cùng `service/`) |
| Test **bắt buộc** | Mỗi `*.service.ts` **phải** có `*.service.test.ts` (hoặc `*.spec.ts`) **cùng folder** — mock Prisma/JWT/Redis, không hit DB thật |
| Exception | `PrismaService`, `LoggingService`, `RedisService` — infra, giữ `database/` / `logging/` / `redis/` |

**Cấm:** `conversations.service.ts` ngang hàng `conversations.controller.ts`; `service/auth.service.ts` không có folder con.

Khi thêm module mới: `users/service/users/users.service.ts` + `users.service.test.ts`.

---

## Config — một nguồn default

| Quy tắc | Ghi chú |
|---------|---------|
| Default env | Chỉ khai báo **một lần** trong `core/config/env.schema.ts` (Zod `.default()`) |
| Đọc config | `ConfigService.getOrThrow("camelCaseKey")` — **không** lặp lại default ở `auth.module`, strategy, service, … |
| Map env → key | `app.config.ts` map `JWT_SECRET` → `jwtSecret`; consumer chỉ dùng camelCase key |

**Cấm:** cùng một giá trị fallback (vd secret JWT, `15m`, max-age cookie) xuất hiện ở cả schema lẫn `configService.get(key, default)`.

---

## Hai mức

| Mức | CI | Ý nghĩa |
|-----|-----|---------|
| **error** | Chặn merge | Cam kết bắt buộc |
| **warn** | Không chặn | Nợ kỹ thuật — code **mới** không thêm warn |

Luật mới: `warn` → `error` khi snapshot sạch.

---

## Luật `error` — an toàn & logic (ESLint core)

| Rule | Mô tả |
|------|--------|
| `eqeqeq` | `===` / `!==` (`== null` OK) |
| `no-eval`, `no-implied-eval`, `no-new-func`, `no-script-url` | Cấm eval |
| `no-throw-literal` | `throw new Error(...)` |
| `prefer-promise-reject-errors` | `Promise.reject(new Error(...))` |
| `array-callback-return`, `no-promise-executor-return` | Return đúng trong callback |
| `no-return-assign`, `no-self-assign`, `no-unreachable-loop` | Logic bug |
| `no-unsafe-optional-chaining` | Không arithmetic trên `?.` |
| **`no-console`** | Cấm `console.*` trong `src/` — dùng `LoggingService` (Pino) |
| `no-param-reassign` | Không mutate param (`acc` / `draft` whitelist nếu cần) |
| `consistent-return`, `default-case`, `default-case-last` | Return / switch nhất quán |
| `prefer-template` | Template literal |
| `guard-for-in` | Ưu tiên `Object.keys` / `values` / `entries` |

---

## Luật `error` — import

| Rule | Mô tả |
|------|--------|
| `import/no-duplicates` | Không import trùng |
| `import/no-self-import` | — |
| `import/no-useless-path-segments` | — |
| `import/first` | Import trước code |
| `import/newline-after-import` | Dòng trống sau import |
| **`import/order`** | Nhóm: builtin → external → `@aucobot/**` → relative; alphabetize; `import type` last |

---

## Luật `error` — TypeScript

| Rule | Mô tả |
|------|--------|
| `@typescript-eslint/no-explicit-any` | Cấm `any` |
| `@typescript-eslint/ban-ts-comment` | Cấm `@ts-ignore`; `@ts-expect-error` + mô tả |
| `@typescript-eslint/consistent-type-imports` | `import type` tách riêng |
| `@typescript-eslint/no-floating-promises` | `await` / `void` / `.catch` có chủ đích |
| `@typescript-eslint/no-misused-promises` | Không `async` sai chỗ (vd handler sync) |
| `@typescript-eslint/no-unsafe-argument` | Typed lint |
| `@typescript-eslint/no-unsafe-return` | Typed lint |
| `@typescript-eslint/no-unsafe-call` | Typed lint |
| `@typescript-eslint/no-unsafe-assignment` | Typed lint |
| `@typescript-eslint/no-unsafe-member-access` | Typed lint |
| `@typescript-eslint/require-await` | Async phải có `await` |
| `@typescript-eslint/restrict-template-expressions` | Chỉ interpolate type an toàn trong template |
| `@typescript-eslint/no-base-to-string` | Typed lint |
| `@typescript-eslint/no-require-imports` | Cấm `require()` |

---

## Luật `error` — kiến trúc Nest (`no-restricted-imports`)

Áp dụng cho `apps/api/src/**/*.ts`:

| Scope | Cấm import (runtime) | Thay bằng |
|-------|----------------------|-----------|
| `src/core/**` *(trừ `database/`)* | `features/**` | Contract trong `core/plugins`; `import type` OK |
| `src/features/**` | feature khác (`features/*/…` chéo domain) | Event bus / `@aucobot/shared` |
| `**/dto/**` | `@Injectable`, `prisma.service`, `@aucobot/database` | Chỉ Zod DTO |
| `**/*.controller.ts` | `@aucobot/database`, `PrismaService` trực tiếp | Delegate service |
| `src/**` | `@nestjs/platform-fastify` | Dùng **Express** (`@nestjs/platform-express`) |

**Feature layout** (để đặt path trong rule, không lint folder tên):

- `features/tools/` — tool thuần app  
- `features/integrations/` — API key platform  
- `features/channels/` — OAuth social  
- `features/workflow/` — queue / job  

---

## Luật `warn` — nợ kỹ thuật

Hiện **không có** rule warn trong snapshot — mọi rule typed lint ở trên đã ratchet lên `error`.  
Khi thêm rule mới: bắt đầu `warn`, chuyển `error` khi `lint:ci` sạch.

---

## Ngoại lệ (`overrides`)

| Glob | Nới |
|------|-----|
| `**/*.middleware.ts` | `no-param-reassign` — gán `req.*` (Express) |
| `**/*.spec.ts` | `no-console` (nếu cần), giữ Promise typed lint |
| `eslint.config.mjs` | `no-console`, import rules nhẹ |

---

## `eslint-disable`

- Chỉ khi bắt buộc — comment `// eslint-disable-next-line rule -- lý do`
- **Cấm** disable trên code mới thay vì sửa đúng chuẩn

---

## TypeScript cho typed lint

`tsconfig.json` **include** `src/**/*.ts`, `**/*.spec.ts`, `**/*.test.ts`.  
Build production: `tsconfig.build.json` exclude `**/*spec.ts`, `**/*.test.ts`.

---

## Fix on save (tuỳ chọn)

`.vscode/settings.json` ở repo root:

```json
{
  "editor.codeActionsOnSave": { "source.fixAll.eslint": "always" },
  "eslint.useFlatConfig": true,
  "eslint.workingDirectories": [{ "directory": "apps/api", "changeProcessCWD": true }]
}
```

---

## Checklist khi thêm / sửa rule

- [ ] Sửa **cả** `rule.md` và `eslint.config.mjs`
- [ ] Chạy `pnpm --filter @aucobot/api lint:ci`
- [ ] Chạy `pnpm --filter @aucobot/api build`
- [ ] Không thêm rule chỉ tồn tại trên project khác (OpenClaw, control-plane, Fastify, …)

---

_Cập nhật lint: sửa file này và `eslint.config.mjs` cùng lúc._
