import type { EmailOtpPurpose } from "@aucobot/shared";

/**
 * Logical Redis key namespaces (before `REDIS_KEY_PREFIX` from ioredis).
 *
 * Pattern: `{domain}:{feature}:{...segments}`
 * - auth:otp:*     — OTP cooldown + IP rate limits
 * - cron:*         — scheduled jobs / distributed locks (reserved)
 * - queue:*        — BullMQ (reserved)
 */
export const RedisNamespace = {
  AUTH_OTP: "auth:otp",
  CRON: "cron",
  QUEUE: "queue",
} as const;

function joinKey(...parts: string[]): string {
  return parts.join(":");
}

export const authOtpRedisKeys = {
  resendCooldown(email: string, purpose: EmailOtpPurpose): string {
    return joinKey(RedisNamespace.AUTH_OTP, "cooldown", email, purpose);
  },

  ipRateLimit(action: "send" | "verify", clientIp: string): string {
    return joinKey(RedisNamespace.AUTH_OTP, "ip", action, clientIp);
  },
};

/** Reserved — use when adding cron / schedule features. */
export const cronRedisKeys = {
  scheduleLock(scheduleId: string): string {
    return joinKey(RedisNamespace.CRON, "lock", scheduleId);
  },

  scheduleTrigger(scheduleId: string): string {
    return joinKey(RedisNamespace.CRON, "trigger", scheduleId);
  },
};
