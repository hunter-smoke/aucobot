import type { Response } from "express";

export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";

const cookieBase = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

export interface AuthCookieMaxAge {
  accessMaxAgeMs: number;
  refreshMaxAgeMs: number;
}

export function setAccessCookie(res: Response, token: string, maxAgeMs: number): void {
  res.cookie(ACCESS_TOKEN_COOKIE, token, {
    ...cookieBase,
    maxAge: maxAgeMs,
  });
}

export function setRefreshCookie(res: Response, token: string, maxAgeMs: number): void {
  res.cookie(REFRESH_TOKEN_COOKIE, token, {
    ...cookieBase,
    maxAge: maxAgeMs,
    path: "/api/auth",
  });
}

export function setAuthCookies(
  res: Response,
  tokens: { accessToken: string; refreshToken: string },
  maxAge: AuthCookieMaxAge,
): void {
  setAccessCookie(res, tokens.accessToken, maxAge.accessMaxAgeMs);
  setRefreshCookie(res, tokens.refreshToken, maxAge.refreshMaxAgeMs);
}

export function clearAuthCookies(res: Response): void {
  res.clearCookie(ACCESS_TOKEN_COOKIE, cookieBase);
  res.clearCookie(REFRESH_TOKEN_COOKIE, { ...cookieBase, path: "/api/auth" });
}

export function readCookieValue(cookies: unknown, name: string): string | undefined {
  if (!cookies || typeof cookies !== "object") {
    return undefined;
  }

  const raw = (cookies as Record<string, unknown>)[name];
  return typeof raw === "string" ? raw : undefined;
}
