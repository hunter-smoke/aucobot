
import { healthResponseSchema } from "@/schemas/health.schema";

import { serverFetch } from "./server-api";
import type { HealthResponse } from "@aucobot/shared";

export async function getServerHealth(): Promise<HealthResponse | null> {
  try {
    const res = await serverFetch("/api/health");

    if (!res.ok) {
      return null;
    }

    return healthResponseSchema.parse(await res.json());
  } catch {
    return null;
  }
}
