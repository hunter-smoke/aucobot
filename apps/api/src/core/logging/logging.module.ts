import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LoggerModule } from "nestjs-pino";

import { createPinoParams } from "./logging.config";
import { LoggingService } from "./logging.service";

@Global()
@Module({
  imports: [
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => createPinoParams(configService),
    }),
  ],
  providers: [LoggingService],
  exports: [LoggingService, LoggerModule],
})
export class LoggingModule {}
