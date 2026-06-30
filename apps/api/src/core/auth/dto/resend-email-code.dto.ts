import { createZodDto } from "nestjs-zod";

import { resendEmailCodeSchema } from "@aucobot/shared";

export class ResendEmailCodeDto extends createZodDto(resendEmailCodeSchema) {}
