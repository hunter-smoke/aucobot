# `stores/auth-flow/`

Zustand — **UI state only** cho `/login` và `/register` (email OTP).

## `auth-flow.store.ts`

Factory `createAuthFlowStore(mode)` — mỗi route tạo store riêng khi mount.

| State | Mô tả |
|-------|--------|
| `mode` | `'login'` \| `'register'` |
| `step` | `'email'` \| `'code'` |
| `email` | Email từ step 1 |
| `resendEndsAt` | ms epoch — hết countdown resend (60s) |

## Không lưu

- Mã OTP 6 số (`OtpInput` local state)
- User / token (cookie httpOnly)

## Cấm

- Import `lib/api` — hook `use-email-otp-flow` gọi API rồi patch store.
