import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AgentsModule } from "./agents/agents.module";
import { AuditModule } from "./audit/audit.module";
import { AuthModule } from "./auth/auth.module";
import { CommonModule } from "./common/common.module";
import { RequestIdMiddleware } from "./common/middleware/request-id.middleware";
import { AppConfigModule } from "./config/config.module";
import { DatabaseModule } from "./database/database.module";
import { DepartmentsModule } from "./departments/departments.module";
import { EventsModule } from "./events/events.module";
import { HealthModule } from "./health/health.module";
import { LoggingModule } from "./logging/logging.module";
import {
  bootstrapFeaturePlugins,
  parseEnabledFeatures,
  resolveEnabledPlugins,
} from "./plugins/feature-loader";
import { PluginRegistry } from "./plugins/plugin.registry";
import { PluginsModule } from "./plugins/plugins.module";
import { QueueModule } from "./queue/queue.module";
import { QueueService } from "./queue/queue.service";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    AppConfigModule,
    CommonModule,
    DatabaseModule,
    LoggingModule,
    PluginsModule,
    EventsModule,
    AuditModule,
    QueueModule,
    AuthModule,
    UsersModule,
    DepartmentsModule,
    AgentsModule,
    HealthModule,
  ],
})
export class CoreModule implements NestModule, OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private readonly pluginRegistry: PluginRegistry,
    private readonly queueService: QueueService,
  ) {}

  onModuleInit() {
    const enabledFeatures = parseEnabledFeatures(
      this.configService.get<string>("enabledFeatures"),
    );

    const plugins = resolveEnabledPlugins(enabledFeatures);

    bootstrapFeaturePlugins(plugins, (plugin) => {
      this.pluginRegistry.register(plugin);
      plugin.registerWorkerProcessors?.(this.queueService);
    });
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes("*");
  }
}
