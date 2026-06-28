import type { FeaturePlugin } from "../../../core/plugins/feature-plugin.interface";
import { WEB_SEARCH_TOOLS } from "./definitions";
import { WebSearchModule } from "./web-search.module";

export const webSearchPlugin: FeaturePlugin = {
  id: "web-search",
  mcpTools: [...WEB_SEARCH_TOOLS],
  registerModule: () => WebSearchModule,
};
