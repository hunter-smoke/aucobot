import { Injectable, LoggerService } from "@nestjs/common";
import { PinoLogger } from "nestjs-pino";

@Injectable()
export class LoggingService implements LoggerService {
  constructor(private readonly logger: PinoLogger) {}

  log(message: string, context?: string, meta?: Record<string, unknown>): void {
    this.write("info", message, context, meta);
  }

  error(
    message: string,
    trace?: string,
    context?: string,
    meta?: Record<string, unknown>,
  ): void {
    this.write("error", message, context, { ...meta, ...(trace ? { trace } : {}) });
  }

  warn(message: string, context?: string, meta?: Record<string, unknown>): void {
    this.write("warn", message, context, meta);
  }

  debug(message: string, context?: string, meta?: Record<string, unknown>): void {
    this.write("debug", message, context, meta);
  }

  verbose(message: string, context?: string, meta?: Record<string, unknown>): void {
    this.write("trace", message, context, meta);
  }

  private write(
    level: "info" | "warn" | "debug" | "trace" | "error",
    message: string,
    context?: string,
    meta?: Record<string, unknown>,
  ): void {
    const bindings = this.bindings(context, meta);
    this.logger[level](bindings, message);
  }

  private bindings(
    context?: string,
    extra?: Record<string, unknown>,
  ): Record<string, unknown> | undefined {
    const bindings = {
      ...(context ? { context } : {}),
      ...extra,
    };

    return Object.keys(bindings).length > 0 ? bindings : undefined;
  }
}
