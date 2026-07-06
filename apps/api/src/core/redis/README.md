# `redis/` — Redis client & key conventions

> **✅ Implemented** — ioredis singleton; dùng cho OTP rate limit (auth).

## Vai trò

- Kết nối Redis với `REDIS_KEY_PREFIX` (mặc định `aucobot:`)
- Chuẩn hóa **logical key** trong `redis-keys.ts` — tránh string magic rải code

## Files

| File | Vai trò |
|------|---------|
| `redis.service.ts` | `getClient()` — shared ioredis instance |
| `redis-keys.ts` | `authOtpRedisKeys`, `cronRedisKeys` (reserved) |
| `redis.module.ts` | Export global `RedisService` |

## Key namespaces

| Logical prefix | Dùng cho | Trạng thái |
|----------------|----------|------------|
| `auth:otp:*` | Cooldown resend, IP rate limit | ✅ |
| `cron:*` | Distributed lock / schedule trigger | 💡 reserved |
| `queue:*` | BullMQ | 💡 reserved |

Full key ví dụ: `aucobot:auth:otp:cooldown:user@mail.com:login`

## Env

| Env | Config key | Default |
|-----|------------|---------|
| `REDIS_URL` | `redisUrl` | `redis://localhost:6379` |
| `REDIS_KEY_PREFIX` | `redisKeyPrefix` | `aucobot:` |

## Consumer

`OtpRateLimitService` (`core/auth/service/otp-rate-limit/`).
