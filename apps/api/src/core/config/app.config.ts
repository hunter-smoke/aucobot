export const appConfig = () => ({
  apiPort: parseInt(process.env.API_PORT ?? "4000", 10),
  webOrigin: process.env.WEB_ORIGIN ?? "http://localhost:3000",
  enabledFeatures: process.env.ENABLED_FEATURES ?? "",
  nodeEnv: process.env.NODE_ENV ?? "development",
});

export type AppConfig = ReturnType<typeof appConfig>;
