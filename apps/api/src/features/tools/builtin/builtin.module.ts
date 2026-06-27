import { Module } from "@nestjs/common";
import { BuiltinToolsService } from "./builtin.service";

@Module({
  providers: [BuiltinToolsService],
  exports: [BuiltinToolsService],
})
export class BuiltinToolsModule {}
