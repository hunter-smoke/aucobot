# Auth — Email OTP only

> Passwordless email qua **6-digit code** (Resend) + **Google OAuth**. User chỉ được tạo khi `verify-code` thành công.

## Auth methods

| Method | Endpoint |
|--------|----------|
| Email OTP | `POST /api/auth/email/send-code`, `verify-code`, `resend-code` |
| Google | `GET /api/auth/google`, `google/callback` |
| Session | `POST /api/auth/refresh`, `logout` · `GET /api/auth/me`, `session` |

## Verify (unified)

OTP đúng → chưa có user thì **create**, đã có thì **login** (kể cả user chưa `emailVerifiedAt` → set verified).

`purpose` (`login` / `register`) chỉ dùng cho challenge lookup + copy email Resend.

## Security (OTP)

Redis keys use a two-layer prefix:

1. **App prefix** — `REDIS_KEY_PREFIX` (default `aucobot:`), applied by ioredis on every key
2. **Feature namespace** — built in `core/redis/redis-keys.ts`

| Key (logical) | Example |
|---------------|---------|
| Resend cooldown | `auth:otp:cooldown:{email}:{purpose}` |
| IP rate limit | `auth:otp:ip:{send\|verify}:{ip}` |

Full key in Redis: `aucobot:auth:otp:cooldown:user@mail.com:login`

Reserved for cron/scheduling: `cron:lock:{id}`, `cron:trigger:{id}` (see `cronRedisKeys`).

| Control | Implementation |
|---------|----------------|
| Resend cooldown | Redis TTL = `EMAIL_OTP_RESEND_COOLDOWN_SECONDS` (default 60s) |
| IP rate limit | Redis `INCR` + `EXPIRE` — max `EMAIL_OTP_IP_MAX_REQUESTS` (default 10) per `EMAIL_OTP_IP_WINDOW_SECONDS` (default 600s) |
| Brute-force | Max `EMAIL_OTP_MAX_ATTEMPTS` (default 5); challenge gets `usedAt` on lockout |
| OTP storage | HMAC-SHA256 with `EMAIL_OTP_HMAC_SECRET` (falls back to `JWT_SECRET`) |
| OTP generation | `randomInt` from `node:crypto` |

**Why Redis, not `@nestjs/throttler`?** Throttler defaults to in-memory (no multi-instance sync). Redis storage needs an extra adapter; we also need separate per-email cooldown vs per-IP counters — `OtpRateLimitService` handles both with one client.

Behind a reverse proxy, API sets `trust proxy` and reads `X-Forwarded-For` for client IP.

## Database

- `users` — không còn `password_hash`
- `email_otp_challenges` — OTP hash + attempts
- `refresh_tokens` — session

## Env

```env
REDIS_URL="redis://localhost:6379"
REDIS_KEY_PREFIX="aucobot:"
RESEND_API_KEY=
EMAIL_FROM="Aucobot <noreply@aucobot.com>"
EMAIL_OTP_EXPIRES_MINUTES=10
EMAIL_OTP_RESEND_COOLDOWN_SECONDS=60
EMAIL_OTP_MAX_ATTEMPTS=5
EMAIL_OTP_IP_MAX_REQUESTS=10
EMAIL_OTP_IP_WINDOW_SECONDS=600
EMAIL_OTP_HMAC_SECRET=   # optional; defaults to JWT_SECRET

# Production — cookies shared across www / app / api (omit in local dev)
AUTH_COOKIE_DOMAIN=.aucobot.com
WEB_ORIGIN=https://app.aucobot.com
MARKETING_ORIGIN=https://www.aucobot.com
```
