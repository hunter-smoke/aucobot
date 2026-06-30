import { z } from "zod";

export const userResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  timezone: z.string(),
  emailVerifiedAt: z.string().nullable(),
  createdAt: z.string(),
});

export const authSuccessResponseSchema = z.object({
  ok: z.literal(true).optional(),
  user: userResponseSchema,
  accessExpiresAt: z.string(),
});

export const registerResponseSchema = z.object({
  message: z.string(),
  email: z.string(),
});

export const sendEmailCodeResponseSchema = z.object({
  ok: z.literal(true),
  expiresInSeconds: z.number(),
});

export const authSessionMetaSchema = z.object({
  accessExpiresAt: z.string().nullable(),
});

export const apiErrorMessageSchema = z.object({
  message: z.union([z.string(), z.array(z.string())]).optional(),
});
