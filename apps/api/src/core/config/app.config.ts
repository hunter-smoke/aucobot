import { envSchema, type EnvConfig } from "./env.schema";

function readEnv(): EnvConfig {
  return envSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    REDIS_URL: process.env.REDIS_URL,
    API_PORT: process.env.API_PORT,
    WEB_ORIGIN: process.env.WEB_ORIGIN,
    ENABLED_FEATURES: process.env.ENABLED_FEATURES,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    TOGETHER_API_KEY: process.env.TOGETHER_API_KEY,
    TAVILY_API_KEY: process.env.TAVILY_API_KEY,
  });
}

export const appConfig = () => {
  const env = readEnv();

  return {
    nodeEnv: env.NODE_ENV,
    databaseUrl: env.DATABASE_URL,
    redisUrl: env.REDIS_URL,
    apiPort: env.API_PORT,
    webOrigin: env.WEB_ORIGIN,
    enabledFeatures: env.ENABLED_FEATURES,
    jwtSecret: env.JWT_SECRET,
    jwtExpiresIn: env.JWT_EXPIRES_IN,
    togetherApiKey: env.TOGETHER_API_KEY,
    tavilyApiKey: env.TAVILY_API_KEY,
  };
};

export type AppConfig = ReturnType<typeof appConfig>;
