import type { FeaturePlugin } from "../core/plugins/feature-plugin.interface";
import { aiOrchestrationPlugin } from "./ai-orchestration/ai-orchestration.plugin";
import { facebookPlugin } from "./channels/facebook/facebook.plugin";
import { webSearchPlugin } from "./integrations/web-search/web-search.plugin";
import { builtinPlugin } from "./tools/builtin/builtin.plugin";
import { publishingPlugin } from "./workflow/publishing/publishing.plugin";

export const FEATURE_MANIFEST: FeaturePlugin[] = [
  // App-native agent tools
  builtinPlugin,
  // Third-party APIs — platform API keys
  webSearchPlugin,
  // AI orchestration
  aiOrchestrationPlugin,
  // Social channels — per-user OAuth
  facebookPlugin,
  // Workflows — queue, schedule, approvals
  publishingPlugin,
];

export {
  aiOrchestrationPlugin,
  builtinPlugin,
  facebookPlugin,
  publishingPlugin,
  webSearchPlugin,
};
