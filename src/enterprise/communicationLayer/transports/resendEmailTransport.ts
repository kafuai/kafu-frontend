import "server-only";

import { Resend } from "resend";

import type {
  EmailTransport,
} from "../adapters/emailAdapter";

export interface ResendEmailTransportOptions {
  readonly apiKey: string;
  readonly from: string;
  readonly replyTo?: string;
}

function requireConfigurationValue(
  name: string,
  value: string | undefined,
): string {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    throw new Error(
      `Missing required email configuration: ${name}`,
    );
  }

  return normalizedValue;
}

function normalizeRecipients(
  recipients: readonly string[],
): string[] {
  return [
    ...new Set(
      recipients
        .map((recipient) => recipient.trim().toLowerCase())
        .filter(Boolean),
    ),
  ];
}

function createIdempotencyKey(
  companyId: string,
  messageId: string,
): string {
  return `communication/${companyId}/${messageId}`.slice(
    0,
    256,
  );
}

export class ResendEmailTransport
  implements EmailTransport
{
  private readonly client: Resend;
  private readonly from: string;
  private readonly replyTo?: string;

  constructor(
    options: ResendEmailTransportOptions,
  ) {
    this.client = new Resend(
      requireConfigurationValue(
        "RESEND_API_KEY",
        options.apiKey,
      ),
    );

    this.from = requireConfigurationValue(
      "EMAIL_FROM",
      options.from,
    );

    this.replyTo = options.replyTo?.trim() || undefined;
  }

  async send(input: {
    readonly companyId: string;
    readonly conversationId: string;
    readonly messageId: string;
    readonly subject?: string;
    readonly content: string;
    readonly recipients: readonly string[];
  }): Promise<{
    readonly externalMessageId: string;
    readonly acceptedAt?: string;
  }> {
    const recipients = normalizeRecipients(
      input.recipients,
    );

    if (recipients.length === 0) {
      throw new Error(
        "Resend email delivery requires at least one recipient.",
      );
    }

    const content = input.content.trim();

    if (!content) {
      throw new Error(
        "Resend email delivery requires non-empty content.",
      );
    }

    const subject =
      input.subject?.trim() ||
      "KAFU AI Communication";

    const { data, error } =
      await this.client.emails.send(
        {
          from: this.from,
          to: recipients,
          subject,
          text: content,
          replyTo: this.replyTo,
          headers: {
            "X-KAFU-Company-ID": input.companyId,
            "X-KAFU-Conversation-ID":
              input.conversationId,
            "X-KAFU-Message-ID": input.messageId,
          },
        },
        {
          idempotencyKey:
            createIdempotencyKey(
              input.companyId,
              input.messageId,
            ),
        },
      );

    if (error) {
      throw new Error(
        `Resend email delivery failed: ${error.message}`,
      );
    }

    if (!data?.id) {
      throw new Error(
        "Resend accepted the request without returning an email identifier.",
      );
    }

    return {
      externalMessageId: data.id,
      acceptedAt: new Date().toISOString(),
    };
  }
}

export function createResendEmailTransportFromEnvironment():
  ResendEmailTransport {
  return new ResendEmailTransport({
    apiKey: requireConfigurationValue(
      "RESEND_API_KEY",
      process.env.RESEND_API_KEY,
    ),
    from: requireConfigurationValue(
      "EMAIL_FROM",
      process.env.EMAIL_FROM,
    ),
    replyTo:
      process.env.EMAIL_REPLY_TO,
  });
}
