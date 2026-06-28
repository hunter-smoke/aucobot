import { Module, OnModuleInit } from "@nestjs/common";
import { CoreModule } from "./core/core.module";
import { LoggingService } from "./core/logging/logging.service";
import { QueueService } from "./core/queue/queue.service";
import { FeaturesModule } from "./features/features.module";

@Module({
  imports: [CoreModule, FeaturesModule.register()],
})
export class WorkerModule implements OnModuleInit {
  constructor(
    private readonly queueService: QueueService,
    private readonly loggingService: LoggingService,
  ) {}

  async onModuleInit() {
    await this.queueService.startWorkers();
    this.loggingService.log("Worker processors started", "WorkerBootstrap");
  }
}
