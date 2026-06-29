export interface VerificationEmailContent {
  subject: string;
  html: string;
  text: string;
}

export function buildVerificationEmail(params: {
  name: string | null;
  verifyUrl: string;
  expiresHours: number;
}): VerificationEmailContent {
  const greeting = params.name ? `Hi ${params.name},` : "Hi,";

  const text = [
    greeting,
    "",
    "Thanks for signing up for Aucobot.",
    `Click the link below to verify your email address. This link expires in ${params.expiresHours} hours.`,
    "",
    params.verifyUrl,
    "",
    "If you didn't create an account, you can ignore this email.",
  ].join("\n");

  const html = `
    <p>${greeting}</p>
    <p>Thanks for signing up for Aucobot.</p>
    <p>Click the button below to verify your email address. This link expires in ${params.expiresHours} hours.</p>
    <p><a href="${params.verifyUrl}" style="display:inline-block;padding:12px 20px;background:#6366f1;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">Verify email</a></p>
    <p>Or copy this link into your browser:<br /><a href="${params.verifyUrl}">${params.verifyUrl}</a></p>
    <p>If you didn't create an account, you can ignore this email.</p>
  `.trim();

  return {
    subject: "Verify your Aucobot account",
    html,
    text,
  };
}
