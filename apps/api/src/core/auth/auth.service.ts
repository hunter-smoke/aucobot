import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcrypt";

import { PrismaService } from "../database/prisma.service";

import type { RegisterInput } from "./dto/register.dto";
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

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    dto: RegisterInput,
  ): Promise<{ accessToken: string; user: UserResponse }> {
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

    return this.issueSession(user);
  }

  async loginWithPassword(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; user: UserResponse }> {
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

    return this.issueSession(user);
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

  async issueSession(user: User): Promise<{ accessToken: string; user: UserResponse }> {
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return {
      accessToken,
      user: this.toUserResponse(user),
    };
  }

  async getMe(userId: string): Promise<UserResponse> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return this.toUserResponse(user);
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
