import { Injectable } from "@nestjs/common";
import type { UserResponse } from "@aucobot/shared";
import { PrismaService } from "../database/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<UserResponse[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    return users.map((user) => this.toResponse(user));
  }

  async create(dto: CreateUserDto): Promise<UserResponse> {
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        timezone: dto.timezone ?? "Asia/Ho_Chi_Minh",
      },
    });

    return this.toResponse(user);
  }

  private toResponse(user: {
    id: string;
    email: string;
    name: string | null;
    timezone: string;
    createdAt: Date;
  }): UserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      timezone: user.timezone,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
