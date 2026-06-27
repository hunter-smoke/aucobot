import { Global, Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { HttpExceptionFilter } from "./filters/http-exception.filter";
import { LoggingInterceptor } from "./interceptors/logging.interceptor";
import { RequestIdMiddleware } from "./middleware/request-id.middleware";

@Global()
@Module({
  providers: [
    RequestIdMiddleware,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  exports: [RequestIdMiddleware],
})
export class CommonModule {}
