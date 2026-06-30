import { getApiBaseUrl } from "@/lib/http/api-base-url";

export async function serverFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const url = path.startsWith("http") ? path : `${getApiBaseUrl()}${path}`;

  return fetch(url, {
    cache: "no-store",
    ...init,
  });
}
