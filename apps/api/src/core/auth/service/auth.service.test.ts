import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import bcrypt from "bcrypt";

import { PrismaService } from "../../database/prisma.service";

import { AuthService } from "./auth.service";

import type { User } from "@aucobot/database";

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
    },
    refreshToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
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
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    authService = moduleRef.get(AuthService);
    prisma.refreshToken.create.mockResolvedValue({ id: "rt-1" });
  });

  describe("register", () => {
    it("throws ConflictException when email already exists", async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser());

      await expect(
        authService.register({
          email: "demo@aucobot.vn",
          password: "password123",
        }),
      ).rejects.toThrow(ConflictException);
    });

    it("creates user, refresh token, and returns token pair", async () => {
      const user = mockUser();
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(user);

      const result = await authService.register({
        email: user.email,
        password: "password123",
        name: user.name ?? undefined,
      });

      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(prisma.refreshToken.create).toHaveBeenCalled();
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
      });
      expect(result.accessToken).toBe("jwt-token");
      expect(result.refreshToken).toEqual(expect.any(String));
      expect(result.accessExpiresAt).toBe(new Date(1_900_000_000 * 1000).toISOString());
      expect(result.user.email).toBe(user.email);
    });
  });

  describe("loginWithPassword", () => {
    it("throws when user has no password hash", async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser({ passwordHash: null }));

      await expect(
        authService.loginWithPassword("demo@aucobot.vn", "password123"),
      ).rejects.toThrow(UnauthorizedException);
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

  describe("validateGoogleProfile", () => {
    it("merges googleId when user exists by email", async () => {
      const existing = mockUser({ googleId: null });
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
          data: expect.objectContaining({ googleId: "google-123" }) as object,
        }),
      );
      expect(result.googleId).toBe("google-123");
    });

    it("creates user when no match by googleId or email", async () => {
      const created = mockUser({ email: "new@aucobot.vn", googleId: "google-new" });

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(created);

      const result = await authService.validateGoogleProfile({
        googleId: "google-new",
        email: "new@aucobot.vn",
      });

      expect(prisma.user.create).toHaveBeenCalled();
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
        createdAt: user.createdAt.toISOString(),
      });
    });
  });
});
