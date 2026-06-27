import type { DynamicModule, Type } from "@nestjs/common";
import { FEATURE_MANIFEST } from "../../features";
import type { FeaturePlugin } from "./feature-plugin.interface";

export function parseEnabledFeatures(raw: string | undefined): string[] {
  if (!raw?.trim()) {
    return [];
  }

  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function resolveEnabledPlugins(enabledIds: string[]): FeaturePlugin[] {
  if (enabledIds.length === 0) {
    return [];
  }

  const enabled = new Set(enabledIds);

  return FEATURE_MANIFEST.filter((plugin) => enabled.has(plugin.id));
}

export function loadFeatureModules(
  enabledIds: string[],
): Array<Type | DynamicModule> {
  return resolveEnabledPlugins(enabledIds).map((plugin) => plugin.registerModule());
}

export function bootstrapFeaturePlugins(
  plugins: FeaturePlugin[],
  register: (plugin: FeaturePlugin) => void,
): void {
  for (const plugin of plugins) {
    register(plugin);
  }
}
