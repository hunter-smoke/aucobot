import { Injectable } from "@nestjs/common";

import { PrismaService } from "../database/prisma.service";

import { ConversationAccessService } from "./conversation-access.service";

import type { Conversation } from "@aucobot/database";
import type {
  ConversationListResponse,
  ConversationResponse,
  CreateConversationInput,
} from "@aucobot/shared";

@Injectable()
export class ConversationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: ConversationAccessService,
  ) {}

  async listForUser(userId: string): Promise<ConversationListResponse> {
    const rows = await this.prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

    return { items: rows.map((row) => this.toResponse(row)) };
  }

  async createForUser(
    userId: string,
    input: CreateConversationInput,
  ): Promise<ConversationResponse> {
    const description = input.description?.trim() || null;

    const row = await this.prisma.conversation.create({
      data: {
        userId,
        type: input.type,
        title: input.title.trim(),
        description,
      },
    });

    return this.toResponse(row);
  }

  async getForUser(userId: string, id: string): Promise<ConversationResponse> {
    return this.toResponse(await this.access.assert(userId, id));
  }

  private toResponse(row: Conversation): ConversationResponse {
    return {
      id: row.id,
      type: row.type,
      title: row.title,
      description: row.description,
      lastMessageAt: row.lastMessageAt?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
