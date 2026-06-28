import { createHash, randomBytes } from "node:crypto";

import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcrypt";

import { PrismaService } from "../../database/prisma.service";

import type { RegisterInput } from "../dto/register.dto";
import type { User } from "@aucobot/database";
import type { UserResponse } from "@aucobot/shared";

export type AuthUser = User;

const BCRYPT_ROUNDS = 10;

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
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterInput): Promise<TokenPair> {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (existing) {
      throw new ConflictException("Email already registered");
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        name: dto.name,
        timezone: dto.timezone ?? "Asia/Ho_Chi_Minh",
      },
    });

    return this.issueTokenPair(user);
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

    return this.issueTokenPair(user);
  }

  async validateGoogleProfile(profile: GoogleProfileInput): Promise<User> {
    const byGoogleId = await this.prisma.user.findUnique({
      where: { googleId: profile.googleId },
    });

    if (byGoogleId) {
      return this.prisma.user.update({
        where: { id: byGoogleId.id },
        data: {
          avatarUrl: profile.avatarUrl ?? byGoogleId.avatarUrl,
          name: byGoogleId.name ?? profile.name ?? null,
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
        },
      });
    }

    return this.prisma.user.create({
      data: {
        email: profile.email,
        googleId: profile.googleId,
        avatarUrl: profile.avatarUrl ?? null,
        name: profile.name ?? null,
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

    const ms = this.configService.get<number>("authAccessCookieMaxAgeMs", 900_000);
    return new Date(Date.now() + ms).toISOString();
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
    return createHash("sha256").update(token).digest("hex");
  }

  private getRefreshExpiresAt(): Date {
    const days = this.configService.get<number>("refreshTokenExpiresInDays", 30);
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }

  private toUserResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      timezone: user.timezone,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
