import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import type { Request } from "express";

export interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request): string | null => {
          if (!request.cookies || typeof request.cookies !== "object") {
            return null;
          }

          const raw = (request.cookies as Record<string, unknown>)["access_token"];
          return typeof raw === "string" ? raw : null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        "jwtSecret",
        "dev-jwt-secret-change-me-in-production",
      ),
    });
  }

  validate(payload: JwtPayload) {
    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException();
    }

    return { userId: payload.sub, email: payload.email };
  }
}
