import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().min(1),
  API_PORT: z.coerce.number().int().positive().default(8387),
  WEB_ORIGIN: z.string().url().default("http://localhost:8386"),
  JWT_SECRET: z.string().min(16).default("dev-jwt-secret-change-me-in-production"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z
    .string()
    .url()
    .default("http://localhost:8387/api/auth/google/callback"),
  AUTH_COOKIE_MAX_AGE_MS: z.coerce.number().int().positive().default(604_800_000),
  SWAGGER_ENABLED: z.coerce.boolean().default(true),
});

export type EnvConfig = z.infer<typeof envSchema>;
