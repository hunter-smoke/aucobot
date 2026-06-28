import { Injectable, LoggerService } from "@nestjs/common";

@Injectable()
export class LoggingService implements LoggerService {
  private format(level: string, message: string, context?: string): string {
    const prefix = context ? `[${context}] ` : "";
    return `${prefix}${message}`;
  }

  log(message: string, context?: string): void {
    // Do not use Nest Logger here — app.useLogger(this) would recurse infinitely.
    console.log(`[LOG] ${this.format("", message, context)}`);
  }

  error(message: string, trace?: string, context?: string): void {
    console.error(`[ERROR] ${this.format("", message, context)}`);
    if (trace) {
      console.error(trace);
    }
  }

  warn(message: string, context?: string): void {
    console.warn(`[WARN] ${this.format("", message, context)}`);
  }

  debug(message: string, context?: string): void {
    console.debug(`[DEBUG] ${this.format("", message, context)}`);
  }

  verbose(message: string, context?: string): void {
    console.log(`[VERBOSE] ${this.format("", message, context)}`);
  }
}
