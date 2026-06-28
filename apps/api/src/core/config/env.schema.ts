import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  API_PORT: z.coerce.number().int().positive().default(4000),
  WEB_ORIGIN: z.string().url().default("http://localhost:3000"),
  ENABLED_FEATURES: z.string().default(""),
  JWT_SECRET: z
    .string()
    .min(16)
    .default("dev-jwt-secret-change-me-in-production"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  TOGETHER_API_KEY: z.string().optional(),
  TAVILY_API_KEY: z.string().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;
