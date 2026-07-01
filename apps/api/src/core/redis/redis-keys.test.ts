import { authOtpRedisKeys, cronRedisKeys } from "./redis-keys";

describe("redis-keys", () => {
  it("builds auth OTP keys under auth:otp namespace", () => {
    expect(authOtpRedisKeys.resendCooldown("a@b.com", "login")).toBe(
      "auth:otp:cooldown:a@b.com:login",
    );
    expect(authOtpRedisKeys.ipRateLimit("send", "127.0.0.1")).toBe(
      "auth:otp:ip:send:127.0.0.1",
    );
  });

  it("reserves cron namespace for future schedulers", () => {
    expect(cronRedisKeys.scheduleLock("sched-1")).toBe("cron:lock:sched-1");
    expect(cronRedisKeys.scheduleTrigger("sched-1")).toBe("cron:trigger:sched-1");
  });
});
