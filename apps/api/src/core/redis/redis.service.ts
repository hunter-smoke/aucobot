import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

import { LoggingService } from "../logging/logging.service";

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: Redis;

  constructor(
    private readonly configService: ConfigService,
    private readonly loggingService: LoggingService,
  ) {
    this.client = new Redis(this.configService.getOrThrow<string>("redisUrl"), {
      keyPrefix: this.configService.getOrThrow<string>("redisKeyPrefix"),
      maxRetriesPerRequest: 3,
      retryStrategy: (attempt) => Math.min(attempt * 200, 2_000),
    });

    this.client.on("error", (error) => {
      this.loggingService.warn(
        `Redis connection error: ${error.message}`,
        "RedisService",
      );
    });
  }

  getClient(): Redis {
    return this.client;
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
  }
}
