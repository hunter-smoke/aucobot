# `hooks/auth/`

## `use-email-otp-flow.ts`

Pipe giữa `lib/api/auth` và `stores/auth-flow`. Nhận store từ `createAuthFlowStore(mode)`.

| Method | REST | Store |
|--------|------|-------|
| `submitEmail(email)` | `sendEmailCode(email, mode)` | `setEmail`, `setStep('code')`, resend cooldown |
| `verifyCode(code)` | `verifyEmailCode(email, code, mode)` | redirect `/` on success |
| `resendCode()` | `resendEmailCode(email, mode)` | reset cooldown |

Lỗi `409` / `401` theo route đã bỏ — verify thống nhất.
