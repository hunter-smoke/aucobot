import { HttpException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";

import { authOtpRedisKeys } from "../../../redis/redis-keys";
import { RedisService } from "../../../redis/redis.service";

import { OtpRateLimitService } from "./otp-rate-limit.service";

describe("OtpRateLimitService", () => {
  let service: OtpRateLimitService;

  const redis = {
    exists: jest.fn(),
    set: jest.fn(),
    incr: jest.fn(),
    expire: jest.fn(),
  };

  const redisService = {
    getClient: jest.fn(() => redis),
  };

  const configService = {
    getOrThrow: jest.fn((key: string) => {
      const values: Record<string, number> = {
        emailOtpResendCooldownSeconds: 60,
        emailOtpIpMaxRequests: 10,
        emailOtpIpWindowSeconds: 600,
      };

      return values[key];
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        OtpRateLimitService,
        { provide: RedisService, useValue: redisService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = moduleRef.get(OtpRateLimitService);
  });

  describe("isInResendCooldown", () => {
    it("returns true when cooldown key exists", async () => {
      redis.exists.mockResolvedValue(1);

      await expect(service.isInResendCooldown("a@b.com", "login")).resolves.toBe(true);

      expect(redis.exists).toHaveBeenCalledWith(
        authOtpRedisKeys.resendCooldown("a@b.com", "login"),
      );
    });

    it("returns false when cooldown key is missing", async () => {
      redis.exists.mockResolvedValue(0);

      await expect(service.isInResendCooldown("a@b.com", "register")).resolves.toBe(
        false,
      );
    });
  });

  describe("markResendSent", () => {
    it("sets cooldown key with configured TTL", async () => {
      await service.markResendSent("a@b.com", "login");

      expect(redis.set).toHaveBeenCalledWith(
        authOtpRedisKeys.resendCooldown("a@b.com", "login"),
        "1",
        "EX",
        60,
      );
    });
  });

  describe("assertIpSendAllowed", () => {
    const ip = "203.0.113.1";
    const key = authOtpRedisKeys.ipRateLimit("send", ip);

    it("increments counter and sets expiry on first request", async () => {
      redis.incr.mockResolvedValue(1);

      await service.assertIpSendAllowed(ip);

      expect(redis.incr).toHaveBeenCalledWith(key);
      expect(redis.expire).toHaveBeenCalledWith(key, 600);
    });

    it("does not set expiry after the first request", async () => {
      redis.incr.mockResolvedValue(5);

      await service.assertIpSendAllowed(ip);

      expect(redis.expire).not.toHaveBeenCalled();
    });

    it("throws 429 when IP exceeds max requests", async () => {
      redis.incr.mockResolvedValue(11);

      const error = await service
        .assertIpSendAllowed(ip)
        .catch((caught: unknown) => caught);

      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(429);
      expect(redis.expire).not.toHaveBeenCalled();
    });
  });

  describe("assertIpVerifyAllowed", () => {
    it("uses verify-specific redis key", async () => {
      const ip = "198.51.100.2";
      redis.incr.mockResolvedValue(1);

      await service.assertIpVerifyAllowed(ip);

      expect(redis.incr).toHaveBeenCalledWith(
        authOtpRedisKeys.ipRateLimit("verify", ip),
      );
    });
  });
});
