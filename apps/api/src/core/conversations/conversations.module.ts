import { Module } from "@nestjs/common";

import { DatabaseModule } from "../database/database.module";

import { ConversationAccessService } from "./conversation-access.service";
import { ConversationsController } from "./conversations.controller";
import { ConversationsService } from "./conversations.service";

@Module({
  imports: [DatabaseModule],
  controllers: [ConversationsController],
  providers: [ConversationsService, ConversationAccessService],
  exports: [ConversationsService, ConversationAccessService],
})
export class ConversationsModule {}
