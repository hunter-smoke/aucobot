export interface JoinWaitlistResult {
  ok: boolean;
  error?: string;
}

/** Client → route handler nội bộ /api/waitlist. */
export async function joinWaitlist(email: string): Promise<JoinWaitlistResult> {
  const res = await fetch("/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const data: unknown = await res.json().catch(() => null);
    const error =
      data && typeof data === "object" && "error" in data
        ? String(data.error)
        : "Không gửi được, thử lại sau";

    return { ok: false, error };
  }

  return { ok: true };
}

/** Ném khi thiếu env WAITLIST_SHEET_WEBHOOK_URL → route trả 503. */
export class WaitlistNotConfiguredError extends Error {
  constructor() {
    super("WAITLIST_SHEET_WEBHOOK_URL is not set");
    this.name = "WaitlistNotConfiguredError";
  }
}

/** Server → Google Apps Script Web App (append vào Google Sheet). */
export async function forwardWaitlistToSheet(email: string): Promise<void> {
  const webhookUrl = process.env.WAITLIST_SHEET_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new WaitlistNotConfiguredError();
  }

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      source: "landing",
      at: new Date().toISOString(),
    }),
  });

  if (!res.ok) {
    throw new Error(`Sheet webhook responded ${res.status}`);
  }
}
