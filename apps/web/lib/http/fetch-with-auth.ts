import { getApiBaseUrl } from "@/lib/http/api-base-url";
import {
  authSessionMetaSchema,
  authSuccessResponseSchema,
} from "@/schemas/auth.schema";

/** Refresh access token when less than 2 minutes remain. */
const PROACTIVE_REFRESH_THRESHOLD_MS = 2 * 60 * 1000;

let accessExpiresAtMs: number | null = null;
let refreshInFlight: Promise<boolean> | null = null;

export function setAuthSession(accessExpiresAt: string): void {
  accessExpiresAtMs = new Date(accessExpiresAt).getTime();
}

export function clearAuthSession(): void {
  accessExpiresAtMs = null;
  refreshInFlight = null;
}

function shouldSkipRefresh(url: string): boolean {
  return (
    url.includes("/api/auth/refresh") ||
    url.includes("/api/auth/email/send-code") ||
    url.includes("/api/auth/email/verify-code") ||
    url.includes("/api/auth/email/resend-code") ||
    url.includes("/api/auth/logout") ||
    url.includes("/api/auth/session")
  );
}

function shouldRefreshProactively(): boolean {
  if (accessExpiresAtMs === null) {
    return false;
  }

  return Date.now() >= accessExpiresAtMs - PROACTIVE_REFRESH_THRESHOLD_MS;
}

async function syncSessionExpiry(): Promise<void> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/api/auth/session`, {
      credentials: "include",
    });

    if (!res.ok) {
      return;
    }

    const data = authSessionMetaSchema.parse(await res.json());

    if (data.accessExpiresAt) {
      accessExpiresAtMs = new Date(data.accessExpiresAt).getTime();
    }
  } catch {
    // Keep existing expiry; reactive 401 refresh remains the fallback.
  }
}

async function refreshAccessTokens(): Promise<boolean> {
  if (refreshInFlight) {
    return refreshInFlight;
  }

  refreshInFlight = (async () => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        accessExpiresAtMs = null;
        return false;
      }

      const data = authSuccessResponseSchema.parse(await res.json());

      if (data.accessExpiresAt) {
        accessExpiresAtMs = new Date(data.accessExpiresAt).getTime();
      }

      return true;
    } catch {
      return false;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

async function ensureAccessTokenFresh(): Promise<void> {
  if (accessExpiresAtMs === null) {
    await syncSessionExpiry();
  }

  if (shouldRefreshProactively()) {
    await refreshAccessTokens();
  }
}

export async function fetchWithAuth(input: string, init?: RequestInit): Promise<Response> {
  await ensureAccessTokenFresh();

  const request = (override?: RequestInit) =>
    fetch(input, {
      ...init,
      ...override,
      credentials: "include",
      headers: {
        ...init?.headers,
        ...override?.headers,
      },
    });

  const response = await request();

  if (response.status !== 401 || shouldSkipRefresh(input)) {
    return response;
  }

  const refreshed = await refreshAccessTokens();

  if (!refreshed) {
    return response;
  }

  return request();
}
