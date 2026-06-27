import { Injectable, Logger } from "@nestjs/common";

export type DomainEventHandler<T = unknown> = (payload: T) => void | Promise<void>;

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);
  private readonly handlers = new Map<string, Set<DomainEventHandler>>();

  on<T = unknown>(eventName: string, handler: DomainEventHandler<T>): void {
    const handlers = this.handlers.get(eventName) ?? new Set();
    handlers.add(handler as DomainEventHandler);
    this.handlers.set(eventName, handlers);
  }

  async emit<T = unknown>(eventName: string, payload: T): Promise<void> {
    const handlers = this.handlers.get(eventName);

    if (!handlers?.size) {
      this.logger.debug(`No handlers for event: ${eventName}`);
      return;
    }

    await Promise.all([...handlers].map((handler) => handler(payload)));
  }
}
