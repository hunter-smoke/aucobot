import { cookies } from "next/headers";

import { userResponseSchema } from "@/schemas/auth.schema";

import { serverFetch } from "./server-api";

import type { UserResponse } from "@aucobot/shared";

const AUTH_COOKIE_NAMES = new Set(["access_token", "refresh_token"]);

function buildAuthCookieHeader(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
): string | null {
  const authCookies = cookieStore
    .getAll()
    .filter((cookie) => AUTH_COOKIE_NAMES.has(cookie.name));

  if (authCookies.length === 0) {
    return null;
  }

  return authCookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");
}

export async function getServerUser(): Promise<UserResponse | null> {
  const cookieStore = await cookies();
  const cookieHeader = buildAuthCookieHeader(cookieStore);

  if (!cookieHeader) {
    return null;
  }

  try {
    const res = await serverFetch("/api/auth/me", {
      headers: { Cookie: cookieHeader },
    });

    if (res.status === 401 || !res.ok) {
      return null;
    }

    return userResponseSchema.parse(await res.json());
  } catch {
    // API unreachable (ECONNREFUSED) or other network error — treat as logged out.
    return null;
  }
}
