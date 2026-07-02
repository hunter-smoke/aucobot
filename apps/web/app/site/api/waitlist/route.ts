import { NextResponse } from "next/server";
import { z } from "zod";

import { forwardWaitlistToSheet, WaitlistNotConfiguredError } from "@/lib/api/waitlist";

const bodySchema = z.object({
  email: z.string().trim().email(),
});

/** Nhận email waitlist → forward sang Google Sheet (qua Apps Script Web App). */
export async function POST(request: Request): Promise<Response> {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Email không hợp lệ" }, { status: 400 });
  }

  try {
    await forwardWaitlistToSheet(parsed.data.email);
  } catch (error) {
    if (error instanceof WaitlistNotConfiguredError) {
      return NextResponse.json(
        { error: "Waitlist chưa được cấu hình" },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: "Không lưu được, vui lòng thử lại" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
