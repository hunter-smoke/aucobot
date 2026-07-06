import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";

import { LoggingService } from "../../logging/logging.service";

import type { Request } from "express";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggingService: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { requestId?: string }>();
    const startedAt = Date.now();

    return next.handle().pipe(
      tap(() => {
        const durationMs = Date.now() - startedAt;
        this.loggingService.log(
          `${request.method} ${request.url}`,
          LoggingInterceptor.name,
          {
            requestId: request.requestId ?? "n/a",
            durationMs,
          },
        );
      }),
    );
  }
}
