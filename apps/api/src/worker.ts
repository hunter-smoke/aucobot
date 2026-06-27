import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { LoggingService } from "./core/logging/logging.service";
import { WorkerModule } from "./worker.module";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(WorkerModule, {
    bufferLogs: true,
  });

  const loggingService = app.get(LoggingService);
  app.useLogger(loggingService);
  loggingService.log("Worker context ready", "Bootstrap");
}

void bootstrap();
