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

import { clearAuthCookie, setAuthCookie } from "./auth-cookie.util";
import { AuthService, type AuthUser } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

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
  @ApiOkResponse({ description: "User created; JWT cookie set" })
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, user } = await this.authService.register(dto);
    setAuthCookie(res, accessToken, this.getCookieMaxAgeMs());

    return { user };
  }

  @ApiPublic()
  @Post("login")
  @ApiOperation({ summary: "Login with email and password" })
  @ApiOkResponse({ description: "JWT cookie set" })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, user } = await this.authService.loginWithPassword(
      dto.email,
      dto.password,
    );
    setAuthCookie(res, accessToken, this.getCookieMaxAgeMs());

    return { user };
  }

  @ApiPublic()
  @Post("logout")
  @ApiOperation({ summary: "Clear session cookie" })
  @ApiOkResponse({ description: "Cookie cleared" })
  logout(@Res({ passthrough: true }) res: Response) {
    clearAuthCookie(res);

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
  @ApiFoundResponse({ description: "Sets JWT cookie and redirects to WEB_ORIGIN/" })
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as AuthUser | undefined;

    if (!user) {
      throw new UnauthorizedException("Google sign-in failed");
    }

    const { accessToken } = await this.authService.issueSession(user);
    setAuthCookie(res, accessToken, this.getCookieMaxAgeMs());

    const webOrigin = this.configService.get<string>(
      "webOrigin",
      `http://localhost:${WEB_DEFAULT_PORT}`,
    );
    res.redirect(`${webOrigin}/`);
  }

  private getCookieMaxAgeMs(): number {
    return this.configService.get<number>("authCookieMaxAgeMs", 604_800_000);
  }
}
