import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { LoggingService } from "../../logging/logging.service";
import { buildVerificationEmail } from "../templates/verification-email.template";

interface ResendEmailResponse {
  id?: string;
  message?: string;
}

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly loggingService: LoggingService,
  ) {}

  async sendVerificationEmail(params: {
    to: string;
    name: string | null;
    verifyUrl: string;
  }): Promise<void> {
    const expiresHours = this.configService.getOrThrow<number>(
      "emailVerificationExpiresHours",
    );
    const content = buildVerificationEmail({
      name: params.name,
      verifyUrl: params.verifyUrl,
      expiresHours,
    });

    const apiKey = this.configService.get<string>("resendApiKey");

    if (!apiKey) {
      this.loggingService.warn(
        `RESEND_API_KEY missing — verification link for ${params.to}: ${params.verifyUrl}`,
        "EmailService",
      );
      return;
    }

    const from = this.configService.getOrThrow<string>("emailFrom");

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [params.to],
        subject: content.subject,
        html: content.html,
        text: content.text,
      }),
    });

    if (!response.ok) {
      const body = (await response
        .json()
        .catch(() => null)) as ResendEmailResponse | null;
      const detail = body?.message ?? response.statusText;
      this.loggingService.error(
        `Failed to send verification email to ${params.to}: ${detail}`,
        undefined,
        "EmailService",
      );
      throw new Error(`Failed to send verification email: ${detail}`);
    }
  }
}
