import { createZodDto } from "nestjs-zod";

import { verifyEmailCodeSchema } from "@aucobot/shared";

export class VerifyEmailCodeDto extends createZodDto(verifyEmailCodeSchema) {}
