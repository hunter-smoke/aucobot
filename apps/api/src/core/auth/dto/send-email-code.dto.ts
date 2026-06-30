import { createZodDto } from "nestjs-zod";

import { sendEmailCodeSchema } from "@aucobot/shared";

export class SendEmailCodeDto extends createZodDto(sendEmailCodeSchema) {}
