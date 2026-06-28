import "reflect-metadata";
import cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { API_DEFAULT_PORT } from "@aucobot/shared";
import { ZodValidationPipe } from "nestjs-zod";
import { AppModule } from "./app.module";
import { LoggingService } from "./core/logging/logging.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const loggingService = app.get(LoggingService);
  app.useLogger(loggingService);

  app.use(cookieParser());

  app.enableCors({
    origin: process.env.WEB_ORIGIN ?? "http://localhost:3000",
    credentials: true,
  });

  app.useGlobalPipes(new ZodValidationPipe(), new ValidationPipe({ transform: true }));

  app.setGlobalPrefix("api");

  const config = app.get(ConfigService);
  const port = config.get<number>("apiPort", API_DEFAULT_PORT);

  await app.listen(port);
  loggingService.log(`API running on http://localhost:${port}/api`, "Bootstrap");
}

void bootstrap();
