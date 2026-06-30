import { envSchema, type EnvConfig } from "./env.schema";

function readEnv(): EnvConfig {
  return envSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    API_PORT: process.env.API_PORT ?? process.env.PORT,
    WEB_ORIGIN: process.env.WEB_ORIGIN,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
    AUTH_ACCESS_COOKIE_MAX_AGE_MS: process.env.AUTH_ACCESS_COOKIE_MAX_AGE_MS,
    REFRESH_TOKEN_EXPIRES_IN_DAYS: process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS,
    AUTH_REFRESH_COOKIE_MAX_AGE_MS: process.env.AUTH_REFRESH_COOKIE_MAX_AGE_MS,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    SWAGGER_ENABLED: process.env.SWAGGER_ENABLED,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_VERIFICATION_EXPIRES_HOURS: process.env.EMAIL_VERIFICATION_EXPIRES_HOURS,
    UNVERIFIED_USER_TTL_HOURS: process.env.UNVERIFIED_USER_TTL_HOURS,
    EMAIL_OTP_EXPIRES_MINUTES: process.env.EMAIL_OTP_EXPIRES_MINUTES,
    EMAIL_OTP_RESEND_COOLDOWN_SECONDS: process.env.EMAIL_OTP_RESEND_COOLDOWN_SECONDS,
    EMAIL_OTP_MAX_ATTEMPTS: process.env.EMAIL_OTP_MAX_ATTEMPTS,
  });
}

export const appConfig = () => {
  const env = readEnv();

  return {
    nodeEnv: env.NODE_ENV,
    databaseUrl: env.DATABASE_URL,
    apiPort: env.API_PORT,
    webOrigin: env.WEB_ORIGIN,
    jwtSecret: env.JWT_SECRET,
    jwtAccessExpiresIn: env.JWT_ACCESS_EXPIRES_IN,
    authAccessCookieMaxAgeMs: env.AUTH_ACCESS_COOKIE_MAX_AGE_MS,
    refreshTokenExpiresInDays: env.REFRESH_TOKEN_EXPIRES_IN_DAYS,
    authRefreshCookieMaxAgeMs: env.AUTH_REFRESH_COOKIE_MAX_AGE_MS,
    googleClientId: env.GOOGLE_CLIENT_ID,
    googleClientSecret: env.GOOGLE_CLIENT_SECRET,
    googleCallbackUrl: env.GOOGLE_CALLBACK_URL,
    swaggerEnabled: env.NODE_ENV === "production" ? env.SWAGGER_ENABLED : true,
    resendApiKey: env.RESEND_API_KEY,
    emailFrom: env.EMAIL_FROM,
    emailVerificationExpiresHours: env.EMAIL_VERIFICATION_EXPIRES_HOURS,
    unverifiedUserTtlHours: env.UNVERIFIED_USER_TTL_HOURS,
    emailOtpExpiresMinutes: env.EMAIL_OTP_EXPIRES_MINUTES,
    emailOtpResendCooldownSeconds: env.EMAIL_OTP_RESEND_COOLDOWN_SECONDS,
    emailOtpMaxAttempts: env.EMAIL_OTP_MAX_ATTEMPTS,
  };
};

export type AppConfig = ReturnType<typeof appConfig>;
