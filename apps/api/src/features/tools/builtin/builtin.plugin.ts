import type { FeaturePlugin } from "../../../core/plugins/feature-plugin.interface";
import { BuiltinToolsModule } from "./builtin.module";
import { BUILTIN_TOOLS } from "./definitions";

export const builtinPlugin: FeaturePlugin = {
  id: "builtin",
  mcpTools: [...BUILTIN_TOOLS],
  registerModule: () => BuiltinToolsModule,
};
