import { createHash } from "node:crypto";

import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import bcrypt from "bcrypt";

import { PrismaService } from "../../database/prisma.service";
import { EmailService } from "../../email/service/email.service";

import { AuthService } from "./auth.service";

import type { User } from "@aucobot/database";
import type { RegisterResponse } from "@aucobot/shared";

jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("hashed-password"),
  compare: jest.fn(),
}));

const mockUser = (overrides: Partial<User> = {}): User => ({
  id: "user-1",
  email: "demo@aucobot.vn",
  passwordHash: "hashed-password",
  googleId: null,
  avatarUrl: null,
  name: "Demo",
  timezone: "Asia/Ho_Chi_Minh",
  emailVerifiedAt: new Date("2025-06-28T00:00:00.000Z"),
  createdAt: new Date("2025-06-28T00:00:00.000Z"),
  updatedAt: new Date("2025-06-28T00:00:00.000Z"),
  ...overrides,
});

describe("AuthService", () => {
  let authService: AuthService;

  const prisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    emailVerificationToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
    },
    emailOtpChallenge: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  const jwtService = {
    signAsync: jest.fn().mockResolvedValue("jwt-token"),
    decode: jest.fn().mockReturnValue({ exp: 1_900_000_000 }),
  };

  const configService = {
    get: jest.fn((key: string, defaultValue?: unknown) => {
      if (key === "refreshTokenExpiresInDays") {
        return 30;
      }

      return defaultValue;
    }),
    getOrThrow: jest.fn((key: string) => {
      const values: Record<string, unknown> = {
        webOrigin: "http://localhost:8386",
        emailVerificationExpiresHours: 24,
        unverifiedUserTtlHours: 72,
        authAccessCookieMaxAgeMs: 900_000,
        refreshTokenExpiresInDays: 30,
        emailOtpExpiresMinutes: 10,
        emailOtpResendCooldownSeconds: 60,
        emailOtpMaxAttempts: 5,
      };

      return values[key];
    }),
  };

  const emailService = {
    sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
    sendOtpEmail: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
        { provide: EmailService, useValue: emailService },
      ],
    }).compile();

    authService = moduleRef.get(AuthService);
    prisma.refreshToken.create.mockResolvedValue({ id: "rt-1" });
    prisma.user.deleteMany.mockResolvedValue({ count: 0 });
    prisma.emailVerificationToken.deleteMany.mockResolvedValue({ count: 0 });
    prisma.emailVerificationToken.create.mockResolvedValue({ id: "evt-1" });
    prisma.emailOtpChallenge.deleteMany.mockResolvedValue({ count: 0 });
    prisma.emailOtpChallenge.create.mockResolvedValue({ id: "otp-1" });
  });

  describe("register", () => {
    it("throws ConflictException when email already verified", async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser());

      await expect(
        authService.register({
          email: "demo@aucobot.vn",
          password: "password123",
        }),
      ).rejects.toThrow(ConflictException);
    });

    it("creates user, sends verification email, and does not issue tokens", async () => {
      const user = mockUser({ emailVerifiedAt: null });
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(user);

      const result: RegisterResponse = await authService.register({
        email: user.email,
        password: "password123",
        name: user.name ?? undefined,
      });

      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(prisma.emailVerificationToken.create).toHaveBeenCalled();
      expect(emailService.sendVerificationEmail).toHaveBeenCalled();
      expect(jwtService.signAsync).not.toHaveBeenCalled();
      expect(result.email).toBe(user.email);
      expect(result.message).toContain("Check your email");
    });
  });

  describe("loginWithPassword", () => {
    it("throws when user has no password hash", async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser({ passwordHash: null }));

      await expect(
        authService.loginWithPassword("demo@aucobot.vn", "password123"),
      ).rejects.toThrow(UnauthorizedException);
    });

    it("throws when email is not verified", async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser({ emailVerifiedAt: null }));
      jest.mocked(bcrypt.compare).mockResolvedValue(true as never);

      await expect(
        authService.loginWithPassword("demo@aucobot.vn", "password123"),
      ).rejects.toThrow(ForbiddenException);
    });

    it("throws when password is invalid", async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser());
      jest.mocked(bcrypt.compare).mockResolvedValue(false as never);

      await expect(
        authService.loginWithPassword("demo@aucobot.vn", "wrong-password"),
      ).rejects.toThrow(UnauthorizedException);
    });

    it("returns token pair when credentials are valid", async () => {
      const user = mockUser();
      prisma.user.findUnique.mockResolvedValue(user);
      jest.mocked(bcrypt.compare).mockResolvedValue(true as never);

      const result = await authService.loginWithPassword(user.email, "password123");

      expect(result.accessToken).toBe("jwt-token");
      expect(result.refreshToken).toEqual(expect.any(String));
      expect(result.user.id).toBe(user.id);
    });
  });

  describe("verifyEmail", () => {
    it("throws when token is invalid", async () => {
      prisma.emailVerificationToken.findUnique.mockResolvedValue(null);

      await expect(authService.verifyEmail("bad-token")).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it("verifies user and returns token pair", async () => {
      const user = mockUser({ emailVerifiedAt: null });
      const stored = {
        id: "evt-1",
        userId: user.id,
        tokenHash: "hash",
        expiresAt: new Date(Date.now() + 86_400_000),
        usedAt: null,
        createdAt: new Date(),
        user,
      };

      prisma.emailVerificationToken.findUnique.mockResolvedValue(stored);
      prisma.user.update.mockResolvedValue(mockUser());
      prisma.emailVerificationToken.update.mockResolvedValue({
        ...stored,
        usedAt: new Date(),
      });

      const result = await authService.verifyEmail("valid-plain-token");

      expect(prisma.user.update).toHaveBeenCalled();
      expect(result.accessToken).toBe("jwt-token");
      expect(result.refreshToken).toEqual(expect.any(String));
    });
  });

  describe("resendVerificationEmail", () => {
    it("returns ok without sending when user is verified", async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser());

      const result = await authService.resendVerificationEmail("demo@aucobot.vn");

      expect(result).toEqual({ ok: true });
      expect(emailService.sendVerificationEmail).not.toHaveBeenCalled();
    });

    it("sends email for unverified password user", async () => {
      const user = mockUser({ emailVerifiedAt: null });
      prisma.user.findUnique.mockResolvedValue(user);

      const result = await authService.resendVerificationEmail(user.email);

      expect(result).toEqual({ ok: true });
      expect(emailService.sendVerificationEmail).toHaveBeenCalled();
    });
  });

  describe("email OTP", () => {
    const email = "otp@aucobot.vn";
    const code = "123456";
    const codeHash = createHash("sha256").update(code).digest("hex");

    const activeChallenge = {
      id: "otp-1",
      email,
      purpose: "register" as const,
      codeHash,
      attempts: 0,
      expiresAt: new Date(Date.now() + 600_000),
      usedAt: null,
      createdAt: new Date(),
    };

    it("sendEmailCode does not create a user", async () => {
      const result = await authService.sendEmailCode(email, "register");

      expect(result).toEqual({ ok: true, expiresInSeconds: 600 });
      expect(prisma.user.create).not.toHaveBeenCalled();
      expect(prisma.emailOtpChallenge.create).toHaveBeenCalled();
      expect(emailService.sendOtpEmail).toHaveBeenCalledWith(
        expect.objectContaining({ to: email, purpose: "register" }),
      );
    });

    it("verify creates a new user when email is new", async () => {
      prisma.emailOtpChallenge.findFirst.mockResolvedValue({
        ...activeChallenge,
        purpose: "register",
      });
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(mockUser({ email }));
      prisma.emailOtpChallenge.update.mockResolvedValue({
        ...activeChallenge,
        usedAt: new Date(),
      });

      const result = await authService.verifyEmailCode(email, code, "register");

      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email,
            passwordHash: null,
            emailVerifiedAt: expect.any(Date) as Date,
          }) as object,
        }),
      );
      expect(result.accessToken).toBe("jwt-token");
    });

    it("verify signs in when email already exists (register route)", async () => {
      const user = mockUser({ email });
      prisma.emailOtpChallenge.findFirst.mockResolvedValue({
        ...activeChallenge,
        purpose: "register",
      });
      prisma.user.findUnique.mockResolvedValue(user);
      prisma.emailOtpChallenge.update.mockResolvedValue({
        ...activeChallenge,
        usedAt: new Date(),
      });

      const result = await authService.verifyEmailCode(email, code, "register");

      expect(prisma.user.create).not.toHaveBeenCalled();
      expect(result.user.email).toBe(email);
    });

    it("verify creates user when email is new (login route)", async () => {
      prisma.emailOtpChallenge.findFirst.mockResolvedValue({
        ...activeChallenge,
        purpose: "login",
      });
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(mockUser({ email }));
      prisma.emailOtpChallenge.update.mockResolvedValue({
        ...activeChallenge,
        usedAt: new Date(),
      });

      await authService.verifyEmailCode(email, code, "login");

      expect(prisma.user.create).toHaveBeenCalled();
    });

    it("verify signs in existing verified user (login route)", async () => {
      const user = mockUser({ email });
      prisma.emailOtpChallenge.findFirst.mockResolvedValue({
        ...activeChallenge,
        purpose: "login",
      });
      prisma.user.findUnique.mockResolvedValue(user);
      prisma.emailOtpChallenge.update.mockResolvedValue({
        ...activeChallenge,
        usedAt: new Date(),
      });

      const result = await authService.verifyEmailCode(email, code, "login");

      expect(prisma.user.create).not.toHaveBeenCalled();
      expect(result.user.email).toBe(email);
    });

    it("verify verifies legacy unverified user on OTP success", async () => {
      const unverified = mockUser({ email, emailVerifiedAt: null });
      prisma.emailOtpChallenge.findFirst.mockResolvedValue({
        ...activeChallenge,
        purpose: "login",
      });
      prisma.user.findUnique.mockResolvedValue(unverified);
      prisma.user.update.mockResolvedValue(mockUser({ email }));
      prisma.emailOtpChallenge.update.mockResolvedValue({
        ...activeChallenge,
        usedAt: new Date(),
      });

      await authService.verifyEmailCode(email, code, "login");

      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: unverified.id },
          data: { emailVerifiedAt: expect.any(Date) as Date },
        }),
      );
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe("validateGoogleProfile", () => {
    it("merges googleId when user exists by email", async () => {
      const existing = mockUser({ googleId: null, emailVerifiedAt: null });
      const merged = mockUser({ googleId: "google-123" });

      prisma.user.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(existing);
      prisma.user.update.mockResolvedValue(merged);

      const result = await authService.validateGoogleProfile({
        googleId: "google-123",
        email: existing.email,
        name: "Google Name",
      });

      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: existing.id },
          data: expect.objectContaining({
            googleId: "google-123",
            emailVerifiedAt: expect.any(Date) as Date,
          }) as object,
        }),
      );
      expect(result.googleId).toBe("google-123");
    });

    it("creates verified user when no match by googleId or email", async () => {
      const created = mockUser({ email: "new@aucobot.vn", googleId: "google-new" });

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(created);

      const result = await authService.validateGoogleProfile({
        googleId: "google-new",
        email: "new@aucobot.vn",
      });

      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            emailVerifiedAt: expect.any(Date) as Date,
          }) as object,
        }),
      );
      expect(result.email).toBe("new@aucobot.vn");
    });
  });

  describe("refreshSession", () => {
    it("throws when refresh token is invalid", async () => {
      prisma.refreshToken.findUnique.mockResolvedValue(null);

      await expect(authService.refreshSession("invalid-token")).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it("rotates refresh token and returns new pair", async () => {
      const user = mockUser();
      const stored = {
        id: "rt-old",
        userId: user.id,
        tokenHash: "hash",
        expiresAt: new Date(Date.now() + 86_400_000),
        revokedAt: null,
        createdAt: new Date(),
        user,
      };

      prisma.refreshToken.findUnique.mockResolvedValue(stored);
      prisma.refreshToken.update.mockResolvedValue({
        ...stored,
        revokedAt: new Date(),
      });

      const result = await authService.refreshSession("valid-plain-token");

      expect(prisma.refreshToken.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: stored.id },
          data: { revokedAt: expect.any(Date) as Date },
        }),
      );
      expect(prisma.refreshToken.create).toHaveBeenCalled();
      expect(result.accessToken).toBe("jwt-token");
      expect(result.refreshToken).toEqual(expect.any(String));
    });
  });

  describe("revokeRefreshToken", () => {
    it("revokes active refresh token", async () => {
      await authService.revokeRefreshToken("logout-token");

      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ revokedAt: null }) as object,
          data: { revokedAt: expect.any(Date) as Date },
        }),
      );
    });

    it("no-ops when token missing", async () => {
      await authService.revokeRefreshToken(undefined);

      expect(prisma.refreshToken.updateMany).not.toHaveBeenCalled();
    });
  });

  describe("decodeAccessExpiresAt", () => {
    it("returns ISO expiry from JWT exp claim", () => {
      expect(authService.decodeAccessExpiresAt("jwt-token")).toBe(
        new Date(1_900_000_000 * 1000).toISOString(),
      );
    });

    it("returns null when token missing or undecodable", () => {
      jwtService.decode.mockReturnValueOnce(null);

      expect(authService.decodeAccessExpiresAt(undefined)).toBeNull();
      expect(authService.decodeAccessExpiresAt("bad-token")).toBeNull();
    });
  });

  describe("getMe", () => {
    it("throws NotFoundException when user missing", async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(authService.getMe("missing-id")).rejects.toThrow(NotFoundException);
    });

    it("returns user response", async () => {
      const user = mockUser();
      prisma.user.findUnique.mockResolvedValue(user);

      const result = await authService.getMe(user.id);

      expect(result).toEqual({
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        timezone: user.timezone,
        emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
        createdAt: user.createdAt.toISOString(),
      });
    });
  });
});
