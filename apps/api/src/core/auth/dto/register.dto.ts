import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().max(120).optional(),
  timezone: z.string().max(64).optional(),
});

export class RegisterDto extends createZodDto(registerSchema) {}

export type RegisterInput = z.infer<typeof registerSchema>;
