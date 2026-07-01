import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { DatabaseModule } from "../database/database.module";
import { EmailModule } from "../email/email.module";

import { AuthController } from "./auth.controller";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { AuthService } from "./service/auth/auth.service";
import { OtpRateLimitService } from "./service/otp-rate-limit/otp-rate-limit.service";
import { GoogleStrategy } from "./strategies/google.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  imports: [
    DatabaseModule,
    EmailModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>("jwtSecret"),
        signOptions: {
          expiresIn: configService.getOrThrow<string>(
            "jwtAccessExpiresIn",
          ) as `${number}${"s" | "m" | "h" | "d"}`,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    OtpRateLimitService,
    JwtStrategy,
    GoogleStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
