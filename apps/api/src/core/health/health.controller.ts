import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { ApiPublic } from "../swagger/decorators/api-public.decorator";

import { HealthService } from "./health.service";

import type { HealthResponse } from "@aucobot/shared";

@ApiTags("Health")
@Controller("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @ApiPublic()
  @Get()
  @ApiOperation({ summary: "API and database health check" })
  @ApiOkResponse({ description: "Service status" })
  getHealth(): Promise<HealthResponse> {
    return this.healthService.check();
  }
}
