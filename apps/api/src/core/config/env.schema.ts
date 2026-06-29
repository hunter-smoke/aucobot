import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().min(1),
  API_PORT: z.coerce.number().int().positive().default(8387),
  WEB_ORIGIN: z.string().url().default("http://localhost:8386"),
  JWT_SECRET: z.string().min(16).default("dev-jwt-secret-change-me-in-production"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  AUTH_ACCESS_COOKIE_MAX_AGE_MS: z.coerce.number().int().positive().default(900_000),
  REFRESH_TOKEN_EXPIRES_IN_DAYS: z.coerce.number().int().positive().default(30),
  AUTH_REFRESH_COOKIE_MAX_AGE_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(2_592_000_000),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z
    .string()
    .url()
    .default("http://localhost:8387/api/auth/google/callback"),
  SWAGGER_ENABLED: z.coerce.boolean().default(true),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default("Aucobot <noreply@send.aucobot.com>"),
  EMAIL_VERIFICATION_EXPIRES_HOURS: z.coerce.number().int().positive().default(24),
  UNVERIFIED_USER_TTL_HOURS: z.coerce.number().int().positive().default(72),
});

export type EnvConfig = z.infer<typeof envSchema>;
