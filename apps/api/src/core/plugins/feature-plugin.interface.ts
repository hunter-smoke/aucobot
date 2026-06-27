import type { DynamicModule, Type } from "@nestjs/common";
import type { QueueService } from "../queue/queue.service";

export interface McpToolDefinition {
  name: string;
  description: string;
}

export interface FeaturePlugin {
  readonly id: string;
  readonly mcpTools?: McpToolDefinition[];
  registerModule(): Type | DynamicModule;
  registerWorkerProcessors?(queueService: QueueService): void;
}
