import type { FeaturePlugin } from "../../../core/plugins/feature-plugin.interface";
import { PublishingModule } from "./publishing.module";

export const publishingPlugin: FeaturePlugin = {
  id: "publishing",
  registerModule: () => PublishingModule,
  registerWorkerProcessors: (queueService) => {
    queueService.registerProcessor("publish-post", async (job) => {
      void job.data;
      // BullMQ processor stub — implement publish flow next
    });
  },
};
