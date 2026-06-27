import { Injectable } from "@nestjs/common";
import { LoggingService } from "../logging/logging.service";

export interface AuditLogEntry {
  action: string;
  actorId?: string;
  departmentId?: string;
  agentId?: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class AuditService {
  constructor(private readonly loggingService: LoggingService) {}

  log(entry: AuditLogEntry): void {
    this.loggingService.log(
      JSON.stringify({
        type: "audit",
        ...entry,
        timestamp: new Date().toISOString(),
      }),
      AuditService.name,
    );
  }
}
