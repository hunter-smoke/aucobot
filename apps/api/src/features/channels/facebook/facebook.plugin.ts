import type { FeaturePlugin } from "../../../core/plugins/feature-plugin.interface";
import { FacebookModule } from "./facebook.module";

export const facebookPlugin: FeaturePlugin = {
  id: "facebook",
  mcpTools: [
    {
      name: "list_connected_accounts",
      description: "List connected Facebook pages for the current user",
    },
    {
      name: "publish_post",
      description: "Publish a post to a connected Facebook page",
    },
  ],
  registerModule: () => FacebookModule,
};
