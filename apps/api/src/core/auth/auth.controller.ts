import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";
import {
  ApiCookieAuth,
  ApiFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";

import { WEB_DEFAULT_PORT } from "@aucobot/shared";

import { CurrentUser } from "../common/decorators/current-user.decorator";
import { ApiPublic } from "../swagger/decorators/api-public.decorator";

import {
  ACCESS_TOKEN_COOKIE,
  clearAuthCookies,
  readCookieValue,
  REFRESH_TOKEN_COOKIE,
  setAuthCookies,
  type AuthCookieMaxAge,
} from "./auth-cookie.util";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { AuthService, type AuthUser } from "./service/auth.service";

import type { AuthenticatedUser } from "../common/decorators/current-user.decorator";
import type { Request, Response } from "express";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @ApiPublic()
  @Post("register")
  @ApiOperation({ summary: "Register with email and password" })
  @ApiOkResponse({ description: "Access + refresh cookies set" })
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.register(dto);
    setAuthCookies(res, tokens, this.getCookieMaxAge());

    return { user: tokens.user, accessExpiresAt: tokens.accessExpiresAt };
  }

  @ApiPublic()
  @Post("login")
  @ApiOperation({ summary: "Login with email and password" })
  @ApiOkResponse({ description: "Access + refresh cookies set" })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.loginWithPassword(dto.email, dto.password);
    setAuthCookies(res, tokens, this.getCookieMaxAge());

    return { user: tokens.user, accessExpiresAt: tokens.accessExpiresAt };
  }

  @ApiPublic()
  @Post("refresh")
  @ApiOperation({ summary: "Rotate refresh token and issue new access token" })
  @ApiOkResponse({ description: "New access + refresh cookies set" })
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = this.readRefreshToken(req);

    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token missing");
    }

    const tokens = await this.authService.refreshSession(refreshToken);
    setAuthCookies(res, tokens, this.getCookieMaxAge());

    return { ok: true, user: tokens.user, accessExpiresAt: tokens.accessExpiresAt };
  }

  @ApiPublic()
  @Get("session")
  @ApiOperation({
    summary: "Access token expiry from cookie (for proactive client refresh)",
  })
  @ApiOkResponse({ description: "accessExpiresAt ISO string or null" })
  getSession(@Req() req: Request) {
    const accessToken = readCookieValue(req.cookies, ACCESS_TOKEN_COOKIE);

    return {
      accessExpiresAt: this.authService.decodeAccessExpiresAt(accessToken),
    };
  }

  @ApiPublic()
  @Post("logout")
  @ApiOperation({ summary: "Revoke refresh token and clear cookies" })
  @ApiOkResponse({ description: "Cookies cleared" })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.authService.revokeRefreshToken(this.readRefreshToken(req));
    clearAuthCookies(res);

    return { ok: true };
  }

  @Get("me")
  @ApiCookieAuth("access_token")
  @ApiOperation({ summary: "Current authenticated user" })
  @ApiOkResponse({ description: "User profile from JWT" })
  getMe(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.getMe(user.userId);
  }

  @ApiPublic()
  @Get("google")
  @UseGuards(AuthGuard("google"))
  @ApiOperation({ summary: "Redirect to Google OAuth consent" })
  @ApiFoundResponse({ description: "302 redirect to Google" })
  googleAuth() {
    // Passport redirects to Google.
  }

  @ApiPublic()
  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  @ApiOperation({ summary: "Google OAuth callback" })
  @ApiFoundResponse({ description: "Sets auth cookies and redirects to WEB_ORIGIN/" })
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as AuthUser | undefined;

    if (!user) {
      throw new UnauthorizedException("Google sign-in failed");
    }

    const tokens = await this.authService.issueTokenPair(user);
    setAuthCookies(res, tokens, this.getCookieMaxAge());

    const webOrigin = this.configService.get<string>(
      "webOrigin",
      `http://localhost:${WEB_DEFAULT_PORT}`,
    );
    res.redirect(`${webOrigin}/`);
  }

  private getCookieMaxAge(): AuthCookieMaxAge {
    return {
      accessMaxAgeMs: this.configService.get<number>(
        "authAccessCookieMaxAgeMs",
        900_000,
      ),
      refreshMaxAgeMs: this.configService.get<number>(
        "authRefreshCookieMaxAgeMs",
        2_592_000_000,
      ),
    };
  }

  private readRefreshToken(req: Request): string | undefined {
    return readCookieValue(req.cookies, REFRESH_TOKEN_COOKIE);
  }
}
