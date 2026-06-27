import type { FeaturePlugin } from "../core/plugins/feature-plugin.interface";
import { facebookPlugin } from "./channels/facebook/facebook.plugin";
import { builtinPlugin } from "./tools/builtin/builtin.plugin";
import { publishingPlugin } from "./workflow/publishing/publishing.plugin";

export const FEATURE_MANIFEST: FeaturePlugin[] = [
  // App-native agent tools
  builtinPlugin,
  // Third-party APIs — platform API keys
  // integrations/web-search — planned
  // Social channels — per-user OAuth
  facebookPlugin,
  // Workflows — queue, schedule, approvals
  publishingPlugin,
];

export { builtinPlugin, facebookPlugin, publishingPlugin };
