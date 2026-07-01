# `app/site/(auth)/` — Email OTP trên **aucobot.com**

> `/login` và `/register` trên domain marketing. Sau OTP → redirect `app.aucobot.com`.

> Hai route riêng `/login` và `/register`, mỗi route 2 step nội bộ + Zustand. Không password trên UI.  
> API spec: [`apps/api/src/core/auth/README.md`](../../../api/src/core/auth/README.md)

## Routes

| Path | Mô tả |
|------|--------|
| `/login` | Đăng nhập — copy + `purpose: login` cho email |
| `/register` | Đăng ký — copy + `purpose: register` cho email |

**Verify thống nhất (cả hai route):** OTP đúng → chưa có user thì tạo, đã có thì đăng nhập (kể cả user legacy chưa verify → set `emailVerifiedAt`).

Sau auth thành công → `app.aucobot.com/` (hoặc `/#<departmentId>` khi API trả phòng mặc định).

## Luồng UX (2 step / route)

```text
step=email                    step=code
┌──────────────────┐         ┌──────────────────┐
│ Nhập email       │  send   │ 6 ô OTP          │
│ [ CTA ]          │ ──────► │ Resend 60s       │
│ ── or ──         │         │ [ Continue ]     │
│ [ Google ]       │         │ ← Back           │
└──────────────────┘         └──────────────────┘
```

- **Cross-link** ở step email: login ↔ register.
- **Password:** không hiển thị (API `login`/`register` giữ cho admin/dev).
- **Google:** nút phụ dưới divider trên cả hai route.

## Web architecture

```text
app/site/
  page.tsx
  (auth)/login/...
  (auth)/register/...

components/auth/
  AuthShell/
  EmailStep/
  OtpStep/
components/ui/
  OtpInput/

stores/auth-flow/
  auth-flow.store.ts   # mode, step, email, resendEndsAt

hooks/auth/
  use-email-otp-flow.ts

lib/api/auth.ts
  sendEmailCode(email, purpose)
  verifyEmailCode(email, code, purpose)
  resendEmailCode(email, purpose)
```

### Zustand (`auth-flow.store`)

| State | Mô tả |
|-------|--------|
| `mode` | `'login'` \| `'register'` — cố định theo route |
| `step` | `'email'` \| `'code'` |
| `email` | Email đã nhập (step 1) |
| `resendEndsAt` | Timestamp hết countdown resend (60s) |

## REST calls (frontend mỏng)

| User action | API |
|-------------|-----|
| Continue / Sign up | `POST /api/auth/email/send-code` `{ email, purpose }` |
| Đủ 6 số | `POST /api/auth/email/verify-code` → cookies |
| Resend | `POST /api/auth/email/resend-code` |
| Google | `GET /api/auth/google` |

**Quan trọng:** `send-code` **không** tạo user. `purpose` chỉ ảnh hưởng copy email Resend; verify **không** phân nhánh theo route.

## Lỗi UX

Chỉ hiển thị lỗi OTP sai / hết hạn — không còn 409/401 vì nhầm route.

## Deprecate

| Cũ | Hành động |
|----|-----------|
| `app/_components/` (root) | Đã xóa — `StatusBadge` → `components/ui/` |
| `app/verify-email/` | Đã xóa |
| Guest `app/page.tsx` | Redirect → `/login` |

