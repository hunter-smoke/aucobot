import { createZodDto } from "nestjs-zod";

import { createConversationSchema } from "@aucobot/shared";

export class CreateConversationDto extends createZodDto(createConversationSchema) {}
