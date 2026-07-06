# `email/` — Transactional email

> **✅ Implemented** — OTP login/register qua [Resend](https://resend.com).

## Vai trò

Gửi email 6-digit OTP cho `auth` module. Dev không có `RESEND_API_KEY` → log code ra console (không gửi thật).

## Files

| Path | Vai trò |
|------|---------|
| `service/email.service.ts` | `sendOtpEmail()` — gọi Resend API |
| `templates/otp-email.template.ts` | HTML + subject theo `purpose` (login/register) |
| `email.module.ts` | Export `EmailService` |

## Env

| Env | Config key | Default |
|-----|------------|---------|
| `RESEND_API_KEY` | `resendApiKey` | optional (dev log) |
| `EMAIL_FROM` | `emailFrom` | `Aucobot <noreply@send.aucobot.com>` |
| `EMAIL_OTP_EXPIRES_MINUTES` | `emailOtpExpiresMinutes` | `10` |

## Consumer

`AuthService` (`core/auth/`) — không expose HTTP endpoint riêng.
