import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
});

export class LoginDto extends createZodDto(loginSchema) {}
