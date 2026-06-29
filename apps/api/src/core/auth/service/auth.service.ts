import { createHash, randomBytes } from "node:crypto";

import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcrypt";

import { PrismaService } from "../../database/prisma.service";
import { EmailService } from "../../email/service/email.service";

import type { RegisterInput } from "../dto/register.dto";
import type { User } from "@aucobot/database";
import type { RegisterResponse, UserResponse } from "@aucobot/shared";

export type AuthUser = User;

const BCRYPT_ROUNDS = 10;
const RESEND_COOLDOWN_MS = 60_000;

export interface GoogleProfileInput {
  googleId: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: string;
  user: UserResponse;
}

@Injectable()
export class AuthService {
  private readonly resendCooldownByEmail = new Map<string, number>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async register(dto: RegisterInput): Promise<RegisterResponse> {
    await this.purgeExpiredUnverifiedUsers();

    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (existing?.emailVerifiedAt) {
      throw new ConflictException("Email already registered");
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    let user: User;

    if (existing) {
      user = await this.prisma.user.update({
        where: { id: existing.id },
        data: {
          passwordHash,
          name: dto.name ?? existing.name,
          timezone: dto.timezone ?? existing.timezone,
        },
      });
    } else {
      user = await this.prisma.user.create({
        data: {
          email: dto.email,
          passwordHash,
          name: dto.name,
          timezone: dto.timezone ?? "Asia/Ho_Chi_Minh",
          emailVerifiedAt: null,
        },
      });
    }

    await this.sendVerificationEmailForUser(user);

    return {
      message: "Check your email to verify your account before signing in.",
      email: user.email,
    };
  }

  async loginWithPassword(email: string, password: string): Promise<TokenPair> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user?.passwordHash) {
      throw new UnauthorizedException(
        "Invalid credentials. Use Google Sign-In if you registered with Google.",
      );
    }

    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    if (!user.emailVerifiedAt) {
      throw new ForbiddenException(
        "Email not verified. Check your inbox or request a new verification link.",
      );
    }

    return this.issueTokenPair(user);
  }

  async verifyEmail(tokenPlain: string): Promise<TokenPair> {
    const tokenHash = this.hashToken(tokenPlain);

    const stored = await this.prisma.emailVerificationToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!stored || stored.usedAt || stored.expiresAt <= new Date()) {
      throw new UnauthorizedException("Invalid or expired verification link");
    }

    if (stored.user.emailVerifiedAt) {
      await this.prisma.emailVerificationToken.update({
        where: { id: stored.id },
        data: { usedAt: new Date() },
      });

      return this.issueTokenPair(stored.user);
    }

    const verifiedUser = await this.prisma.user.update({
      where: { id: stored.userId },
      data: { emailVerifiedAt: new Date() },
    });

    await this.prisma.emailVerificationToken.update({
      where: { id: stored.id },
      data: { usedAt: new Date() },
    });

    return this.issueTokenPair(verifiedUser);
  }

  async resendVerificationEmail(email: string): Promise<{ ok: true }> {
    await this.purgeExpiredUnverifiedUsers();

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || user.emailVerifiedAt || !user.passwordHash) {
      return { ok: true };
    }

    const lastSentAt = this.resendCooldownByEmail.get(email) ?? 0;

    if (Date.now() - lastSentAt < RESEND_COOLDOWN_MS) {
      return { ok: true };
    }

    this.resendCooldownByEmail.set(email, Date.now());
    await this.sendVerificationEmailForUser(user);

    return { ok: true };
  }

  async validateGoogleProfile(profile: GoogleProfileInput): Promise<User> {
    const now = new Date();
    const byGoogleId = await this.prisma.user.findUnique({
      where: { googleId: profile.googleId },
    });

    if (byGoogleId) {
      return this.prisma.user.update({
        where: { id: byGoogleId.id },
        data: {
          avatarUrl: profile.avatarUrl ?? byGoogleId.avatarUrl,
          name: byGoogleId.name ?? profile.name ?? null,
          emailVerifiedAt: byGoogleId.emailVerifiedAt ?? now,
        },
      });
    }

    const byEmail = await this.prisma.user.findUnique({
      where: { email: profile.email },
    });

    if (byEmail) {
      return this.prisma.user.update({
        where: { id: byEmail.id },
        data: {
          googleId: profile.googleId,
          avatarUrl: profile.avatarUrl ?? byEmail.avatarUrl,
          name: byEmail.name ?? profile.name ?? null,
          emailVerifiedAt: byEmail.emailVerifiedAt ?? now,
        },
      });
    }

    return this.prisma.user.create({
      data: {
        email: profile.email,
        googleId: profile.googleId,
        avatarUrl: profile.avatarUrl ?? null,
        name: profile.name ?? null,
        emailVerifiedAt: now,
      },
    });
  }

  async issueTokenPair(user: User): Promise<TokenPair> {
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    const refreshToken = await this.createRefreshToken(user.id);
    const accessExpiresAt = this.resolveAccessExpiresAt(accessToken);

    return {
      accessToken,
      refreshToken,
      accessExpiresAt,
      user: this.toUserResponse(user),
    };
  }

  decodeAccessExpiresAt(accessToken: string | undefined): string | null {
    if (!accessToken) {
      return null;
    }

    const decoded: unknown = this.jwtService.decode(accessToken);

    if (!this.isJwtExpPayload(decoded)) {
      return null;
    }

    return new Date(decoded.exp * 1000).toISOString();
  }

  async refreshSession(refreshTokenPlain: string): Promise<TokenPair> {
    const tokenHash = this.hashRefreshToken(refreshTokenPlain);

    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!stored || stored.revokedAt || stored.expiresAt <= new Date()) {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    if (!stored.user.emailVerifiedAt) {
      throw new ForbiddenException("Email not verified");
    }

    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    return this.issueTokenPair(stored.user);
  }

  async revokeRefreshToken(refreshTokenPlain: string | undefined): Promise<void> {
    if (!refreshTokenPlain) {
      return;
    }

    const tokenHash = this.hashRefreshToken(refreshTokenPlain);

    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async getMe(userId: string): Promise<UserResponse> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return this.toUserResponse(user);
  }

  private async sendVerificationEmailForUser(user: User): Promise<void> {
    const plain = randomBytes(32).toString("base64url");
    const tokenHash = this.hashToken(plain);
    const expiresAt = this.getVerificationExpiresAt();

    await this.prisma.emailVerificationToken.deleteMany({
      where: {
        userId: user.id,
        usedAt: null,
      },
    });

    await this.prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    const webOrigin = this.configService.getOrThrow<string>("webOrigin");
    const verifyUrl = `${webOrigin}/verify-email?token=${encodeURIComponent(plain)}`;

    await this.emailService.sendVerificationEmail({
      to: user.email,
      name: user.name,
      verifyUrl,
    });
  }

  private async purgeExpiredUnverifiedUsers(): Promise<void> {
    const ttlHours = this.configService.getOrThrow<number>("unverifiedUserTtlHours");
    const cutoff = new Date(Date.now() - ttlHours * 60 * 60 * 1000);

    await this.prisma.user.deleteMany({
      where: {
        emailVerifiedAt: null,
        passwordHash: { not: null },
        createdAt: { lt: cutoff },
      },
    });
  }

  private getVerificationExpiresAt(): Date {
    const hours = this.configService.getOrThrow<number>(
      "emailVerificationExpiresHours",
    );
    return new Date(Date.now() + hours * 60 * 60 * 1000);
  }

  private isJwtExpPayload(value: unknown): value is { exp: number } {
    if (typeof value !== "object" || value === null || !("exp" in value)) {
      return false;
    }

    return typeof Reflect.get(value, "exp") === "number";
  }

  private resolveAccessExpiresAt(accessToken: string): string {
    const decoded = this.decodeAccessExpiresAt(accessToken);

    if (decoded) {
      return decoded;
    }

    const ms = this.configService.getOrThrow<number>("authAccessCookieMaxAgeMs");
    return new Date(Date.now() + ms).toISOString();
  }

  private async createRefreshToken(userId: string): Promise<string> {
    const plain = randomBytes(32).toString("base64url");
    const tokenHash = this.hashRefreshToken(plain);
    const expiresAt = this.getRefreshExpiresAt();

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });

    return plain;
  }

  private hashRefreshToken(token: string): string {
    return this.hashToken(token);
  }

  private hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  private getRefreshExpiresAt(): Date {
    const days = this.configService.getOrThrow<number>("refreshTokenExpiresInDays");
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }

  private toUserResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      timezone: user.timezone,
      emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
