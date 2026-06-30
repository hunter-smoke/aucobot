import type { EmailOtpPurpose } from "@aucobot/shared";

export interface OtpEmailContent {
  subject: string;
  html: string;
  text: string;
}

const SUBJECT_BY_PURPOSE: Record<EmailOtpPurpose, string> = {
  register: "Your Aucobot sign-up code",
  login: "Your Aucobot sign-in code",
};

export function buildOtpEmail(params: {
  code: string;
  purpose: EmailOtpPurpose;
  expiresMinutes: number;
}): OtpEmailContent {
  const action =
    params.purpose === "register" ? "sign up for Aucobot" : "sign in to Aucobot";

  const text = [
    `Your verification code to ${action} is: ${params.code}`,
    "",
    `This code expires in ${params.expiresMinutes} minutes.`,
    "",
    "If you didn't request this code, you can ignore this email.",
  ].join("\n");

  const html = `
    <p>Your verification code to ${action} is:</p>
    <p style="font-size:32px;font-weight:700;letter-spacing:0.25em;margin:24px 0;">${params.code}</p>
    <p>This code expires in ${params.expiresMinutes} minutes.</p>
    <p>If you didn't request this code, you can ignore this email.</p>
  `.trim();

  return {
    subject: SUBJECT_BY_PURPOSE[params.purpose],
    html,
    text,
  };
}
