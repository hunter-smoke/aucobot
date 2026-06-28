import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { cleanupOpenApiDoc } from "nestjs-zod";

import type { INestApplication } from "@nestjs/common";

export const SWAGGER_PATH = "api/docs";

export interface SetupSwaggerOptions {
  enabled: boolean;
}

export function setupSwagger(
  app: INestApplication,
  options: SetupSwaggerOptions,
): void {
  if (!options.enabled) {
    return;
  }

  const config = new DocumentBuilder()
    .setTitle("Aucobot API")
    .setDescription(
      [
        "AI Agent Cloud MVP — Auth API.",
        "",
        "**Auth:** Access JWT cookie `access_token` (15m) + refresh `refresh_token` (30d, path `/api/auth`).",
        "Client: proactive refresh (< 2m left) + 401 fallback; `GET /auth/session` for expiry sync.",
      ].join("\n"),
    )
    .setVersion("0.1.0")
    .addCookieAuth("access_token", {
      type: "apiKey",
      in: "cookie",
      description: "JWT session cookie",
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(SWAGGER_PATH, app, cleanupOpenApiDoc(document), {
    swaggerOptions: {
      persistAuthorization: true,
      withCredentials: true,
    },
  });
}
