import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().max(120).optional(),
  timezone: z.string().max(64).optional(),
});

export class CreateUserDto extends createZodDto(createUserSchema) {}

export type CreateUserInput = z.infer<typeof createUserSchema>;
