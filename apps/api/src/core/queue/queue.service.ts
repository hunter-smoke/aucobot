import { Injectable, Logger } from "@nestjs/common";

export type QueueProcessor = () => void | Promise<void>;

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);
  private readonly processors = new Map<string, QueueProcessor>();

  registerProcessor(name: string, processor: QueueProcessor): void {
    this.processors.set(name, processor);
    this.logger.log(`Queue processor registered: ${name}`);
  }

  listProcessors(): string[] {
    return [...this.processors.keys()];
  }

  async startProcessors(): Promise<void> {
    for (const [name, processor] of this.processors.entries()) {
      this.logger.log(`Starting queue processor: ${name}`);
      await processor();
    }
  }
}
