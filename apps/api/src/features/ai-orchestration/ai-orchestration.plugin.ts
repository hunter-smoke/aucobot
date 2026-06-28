import type { FeaturePlugin } from "../../core/plugins/feature-plugin.interface";
import { AiOrchestrationModule } from "./ai-orchestration.module";

export const aiOrchestrationPlugin: FeaturePlugin = {
  id: "ai-orchestration",
  registerModule: () => AiOrchestrationModule,
};
