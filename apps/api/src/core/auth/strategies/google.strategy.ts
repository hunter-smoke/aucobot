import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, type Profile } from "passport-google-oauth20";

import { API_DEFAULT_PORT } from "@aucobot/shared";

import { AuthService, type AuthUser } from "../service/auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>("googleClientId", ""),
      clientSecret: configService.get<string>("googleClientSecret", ""),
      callbackURL: configService.get<string>(
        "googleCallbackUrl",
        `http://localhost:${API_DEFAULT_PORT}/api/auth/google/callback`,
      ),
      scope: ["email", "profile"],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): Promise<AuthUser> {
    const email = profile.emails?.[0]?.value;
    const googleId = profile.id;

    if (!email || !googleId) {
      throw new UnauthorizedException("Google profile incomplete");
    }

    return this.authService.validateGoogleProfile({
      googleId,
      email,
      name: profile.displayName ?? null,
      avatarUrl: profile.photos?.[0]?.value ?? null,
    });
  }
}
