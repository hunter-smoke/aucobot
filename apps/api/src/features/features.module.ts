import { DynamicModule, Module } from "@nestjs/common";
import {
  loadFeatureModules,
  parseEnabledFeatures,
} from "../core/plugins/feature-loader";

@Module({})
export class FeaturesModule {
  static register(): DynamicModule {
    const enabledFeatures = parseEnabledFeatures(process.env.ENABLED_FEATURES);
    const imports = loadFeatureModules(enabledFeatures);

    return {
      module: FeaturesModule,
      imports,
    };
  }
}
