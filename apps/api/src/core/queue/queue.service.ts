import type { Job, JobsOptions } from "bullmq";
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Queue, Worker } from "bullmq";
import type { ConnectionOptions } from "bullmq";

export type QueueJobHandler = (job: Job) => Promise<void>;

@Injectable()
export class QueueService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(QueueService.name);
  private readonly connection: ConnectionOptions;
  private readonly handlers = new Map<string, QueueJobHandler>();
  private readonly queues = new Map<string, Queue>();
  private workers: Worker[] = [];
  private workersStarted = false;

  constructor(private readonly configService: ConfigService) {
    this.connection = {
      url: this.configService.get<string>(
        "redisUrl",
        "redis://localhost:6379",
      ),
      maxRetriesPerRequest: null,
    };
  }

  onModuleInit() {
    this.logger.log("Queue service initialized (BullMQ)");
  }

  registerProcessor(queueName: string, handler: QueueJobHandler): void {
    this.handlers.set(queueName, handler);

    if (!this.queues.has(queueName)) {
      this.queues.set(
        queueName,
        new Queue(queueName, { connection: this.connection }),
      );
    }

    this.logger.log(`Queue processor registered: ${queueName}`);
  }

  getQueue(queueName: string): Queue {
    const existing = this.queues.get(queueName);

    if (existing) {
      return existing;
    }

    const queue = new Queue(queueName, { connection: this.connection });
    this.queues.set(queueName, queue);
    return queue;
  }

  async addJob<T>(
    queueName: string,
    jobName: string,
    data: T,
    options?: JobsOptions,
  ) {
    const queue = this.getQueue(queueName);
    return queue.add(jobName, data, options);
  }

  async startWorkers(): Promise<void> {
    if (this.workersStarted) {
      return;
    }

    for (const [queueName, handler] of this.handlers.entries()) {
      const worker = new Worker(queueName, handler, {
        connection: this.connection,
      });

      worker.on("failed", (job, error) => {
        this.logger.error(
          `Job ${job?.id ?? "unknown"} failed on ${queueName}: ${error.message}`,
        );
      });

      this.workers.push(worker);
      this.logger.log(`Worker started: ${queueName}`);
    }

    this.workersStarted = true;
  }

  listProcessors(): string[] {
    return [...this.handlers.keys()];
  }

  async onModuleDestroy() {
    await Promise.all(this.workers.map((worker) => worker.close()));
    await Promise.all([...this.queues.values()].map((queue) => queue.close()));
  }
}
