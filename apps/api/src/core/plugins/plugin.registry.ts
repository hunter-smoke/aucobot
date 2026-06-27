import { Injectable, Logger } from "@nestjs/common";
import type { FeaturePlugin, McpToolDefinition } from "./feature-plugin.interface";

@Injectable()
export class PluginRegistry {
  private readonly logger = new Logger(PluginRegistry.name);
  private readonly plugins = new Map<string, FeaturePlugin>();
  private readonly mcpTools = new Map<string, McpToolDefinition>();

  register(plugin: FeaturePlugin): void {
    this.plugins.set(plugin.id, plugin);

    for (const tool of plugin.mcpTools ?? []) {
      this.mcpTools.set(tool.name, tool);
    }

    this.logger.log(`Feature plugin registered: ${plugin.id}`);
  }

  getPlugin(id: string): FeaturePlugin | undefined {
    return this.plugins.get(id);
  }

  listPlugins(): FeaturePlugin[] {
    return [...this.plugins.values()];
  }

  listMcpTools(): McpToolDefinition[] {
    return [...this.mcpTools.values()];
  }
}
