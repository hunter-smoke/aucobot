import { Module } from "@nestjs/common";

import { CoreModule } from "./core/core.module";
import { loadEnabledFeatures } from "./core/features/feature-loader";

@Module({
  imports: [CoreModule, ...loadEnabledFeatures()],
})
export class AppModule {}
