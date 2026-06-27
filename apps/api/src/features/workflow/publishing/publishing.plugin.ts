import type { FeaturePlugin } from "../../../core/plugins/feature-plugin.interface";
import { PublishingModule } from "./publishing.module";

export const publishingPlugin: FeaturePlugin = {
  id: "publishing",
  registerModule: () => PublishingModule,
  registerWorkerProcessors: (queueService) => {
    queueService.registerProcessor("publish-post", async () => {
      // BullMQ processor sẽ implement ở bước tiếp theo
    });
  },
};
