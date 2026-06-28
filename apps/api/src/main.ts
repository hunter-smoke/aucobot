import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { ZodValidationPipe } from "nestjs-zod";

import { API_DEFAULT_PORT, WEB_DEFAULT_PORT } from "@aucobot/shared";

import { AppModule } from "./app.module";
import { LoggingService } from "./core/logging/logging.service";
import { setupSwagger, SWAGGER_PATH } from "./core/swagger/setup-swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const loggingService = app.get(LoggingService);
  app.useLogger(loggingService);

  app.use(cookieParser());

  app.enableCors({
    origin: process.env.WEB_ORIGIN ?? `http://localhost:${WEB_DEFAULT_PORT}`,
    credentials: true,
  });

  app.useGlobalPipes(new ZodValidationPipe(), new ValidationPipe({ transform: true }));

  app.setGlobalPrefix("api");

  const config = app.get(ConfigService);
  const port = config.get<number>("apiPort", API_DEFAULT_PORT);
  const swaggerEnabled = config.get<boolean>("swaggerEnabled", true);

  setupSwagger(app, { enabled: swaggerEnabled });

  await app.listen(port);
  loggingService.log(`API running on http://localhost:${port}/api`, "Bootstrap");

  if (swaggerEnabled) {
    loggingService.log(
      `Swagger UI at http://localhost:${port}/${SWAGGER_PATH}`,
      "Bootstrap",
    );
  }
}

void bootstrap();
