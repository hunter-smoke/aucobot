import { z } from "zod";

export const emailOtpPurposeSchema = z.enum(["login", "register"]);

export type EmailOtpPurpose = z.infer<typeof emailOtpPurposeSchema>;

export const sendEmailCodeSchema = z.object({
  email: z.string().email(),
  purpose: emailOtpPurposeSchema,
});

export type SendEmailCodeInput = z.infer<typeof sendEmailCodeSchema>;

export const verifyEmailCodeSchema = z.object({
  email: z.string().email(),
  code: z.string().regex(/^\d{6}$/, "Code must be 6 digits"),
  purpose: emailOtpPurposeSchema,
});

export type VerifyEmailCodeInput = z.infer<typeof verifyEmailCodeSchema>;

export const resendEmailCodeSchema = sendEmailCodeSchema;

export type ResendEmailCodeInput = z.infer<typeof resendEmailCodeSchema>;

export interface SendEmailCodeResponse {
  ok: true;
  expiresInSeconds: number;
}
