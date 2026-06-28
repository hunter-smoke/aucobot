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
        (request: Request) => request.cookies?.access_token ?? null,
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
