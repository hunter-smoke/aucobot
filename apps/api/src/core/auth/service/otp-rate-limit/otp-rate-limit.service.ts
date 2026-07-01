import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { authOtpRedisKeys } from "../../../redis/redis-keys";
import { RedisService } from "../../../redis/redis.service";

import type { EmailOtpPurpose } from "@aucobot/shared";

/**
 * OTP rate limits backed by Redis (shared across API replicas).
 *
 * Why Redis instead of @nestjs/throttler?
 * - Throttler defaults to in-memory storage; Redis storage needs an extra adapter package.
 * - We need distinct key spaces: per-email resend cooldown + per-IP send/verify windows.
 * - Cooldown is "silent" (no email) while IP limits return 429 — easier to express in one service.
 */
@Injectable()
export class OtpRateLimitService {
  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  async isInResendCooldown(email: string, purpose: EmailOtpPurpose): Promise<boolean> {
    const exists = await this.redisService
      .getClient()
      .exists(authOtpRedisKeys.resendCooldown(email, purpose));

    return exists === 1;
  }

  async markResendSent(email: string, purpose: EmailOtpPurpose): Promise<void> {
    const seconds = this.configService.getOrThrow<number>(
      "emailOtpResendCooldownSeconds",
    );

    await this.redisService
      .getClient()
      .set(authOtpRedisKeys.resendCooldown(email, purpose), "1", "EX", seconds);
  }

  async assertIpSendAllowed(clientIp: string): Promise<void> {
    await this.assertIpAllowed("send", clientIp);
  }

  async assertIpVerifyAllowed(clientIp: string): Promise<void> {
    await this.assertIpAllowed("verify", clientIp);
  }

  private async assertIpAllowed(
    action: "send" | "verify",
    clientIp: string,
  ): Promise<void> {
    const max = this.configService.getOrThrow<number>("emailOtpIpMaxRequests");
    const windowSeconds = this.configService.getOrThrow<number>(
      "emailOtpIpWindowSeconds",
    );
    const key = authOtpRedisKeys.ipRateLimit(action, clientIp);
    const redis = this.redisService.getClient();

    const count = await redis.incr(key);

    if (count === 1) {
      await redis.expire(key, windowSeconds);
    }

    if (count > max) {
      throw new HttpException(
        "Too many requests. Please try again later.",
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }
}
