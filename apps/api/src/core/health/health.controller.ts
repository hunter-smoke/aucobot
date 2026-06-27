import { Controller, Get } from "@nestjs/common";
import type { HealthResponse } from "@aucobot/shared";
import { HealthService } from "./health.service";

@Controller("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  getHealth(): Promise<HealthResponse> {
    return this.healthService.check();
  }
}
