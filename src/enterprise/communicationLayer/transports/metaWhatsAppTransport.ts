import "server-only";

import type {
  WhatsAppTransport,
} from "../adapters/whatsAppAdapter";

export interface MetaWhatsAppTransportOptions {
  readonly accessToken: string;
  readonly phoneNumberId: string;
  readonly graphApiVersion: string;
  readonly baseUrl?: string;
}

interface MetaWhatsAppMessageResponse {
  readonly messaging_product?: string;
  readonly contacts?: readonly {
    readonly input?: string;
    readonly wa_id?: string;
  }[];
  readonly messages?: readonly {
    readonly id?: string;
  }[];
  readonly error?: {
    readonly message?: string;
    readonly type?: string;
    readonly code?: number;
    readonly error_subcode?: number;
    readonly fbtrace_id?: string;
  };
}

interface MetaWhatsAppDeliveryResult {
  readonly recipient: string;
  readonly externalMessageId: string;
}

function requireConfigurationValue(
  name: string,
  value: string | undefined,
): string {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    throw new Error(
      `Missing required WhatsApp configuration: ${name}`,
    );
  }

  return normalizedValue;
}

function normalizeGraphApiVersion(
  value: string,
): string {
  const normalizedValue = value
    .trim()
    .replace(/^\/+|\/+$/g, "");

  if (!/^v\d+\.\d+$/.test(normalizedValue)) {
    throw new Error(
      "META_WHATSAPP_GRAPH_API_VERSION must use the format vXX.X.",
    );
  }

  return normalizedValue;
}

function normalizePhoneNumber(
  value: string,
): string {
  const normalizedValue = value
    .trim()
    .replace(/[^\d]/g, "");

  if (!normalizedValue) {
    throw new Error(
      "WhatsApp recipient phone number is invalid.",
    );
  }

  if (
    normalizedValue.length < 8 ||
    normalizedValue.length > 15
  ) {
    throw new Error(
      `WhatsApp recipient must use international format: ${value}`,
    );
  }

  return normalizedValue;
}

function normalizeRecipients(
  recipients: readonly string[],
): readonly string[] {
  return [
    ...new Set(
      recipients.map(normalizePhoneNumber),
    ),
  ];
}

function buildMetaErrorMessage(
  status: number,
  payload: MetaWhatsAppMessageResponse,
): string {
  const providerError = payload.error;

  const parts = [
    `Meta WhatsApp delivery failed with HTTP ${status}.`,
  ];

  if (providerError?.message) {
    parts.push(providerError.message);
  }

  if (providerError?.type) {
    parts.push(`Type: ${providerError.type}.`);
  }

  if (providerError?.code !== undefined) {
    parts.push(`Code: ${providerError.code}.`);
  }

  if (providerError?.error_subcode !== undefined) {
    parts.push(
      `Subcode: ${providerError.error_subcode}.`,
    );
  }

  if (providerError?.fbtrace_id) {
    parts.push(
      `Trace: ${providerError.fbtrace_id}.`,
    );
  }

  return parts.join(" ");
}

export class MetaWhatsAppTransport
  implements WhatsAppTransport
{
  private readonly accessToken: string;
  private readonly phoneNumberId: string;
  private readonly graphApiVersion: string;
  private readonly baseUrl: string;

  constructor(
    options: MetaWhatsAppTransportOptions,
  ) {
    this.accessToken = requireConfigurationValue(
      "META_WHATSAPP_ACCESS_TOKEN",
      options.accessToken,
    );

    this.phoneNumberId = requireConfigurationValue(
      "META_WHATSAPP_PHONE_NUMBER_ID",
      options.phoneNumberId,
    );

    this.graphApiVersion = normalizeGraphApiVersion(
      requireConfigurationValue(
        "META_WHATSAPP_GRAPH_API_VERSION",
        options.graphApiVersion,
      ),
    );

    this.baseUrl =
      options.baseUrl?.trim().replace(/\/+$/g, "") ||
      "https://graph.facebook.com";
  }

  async send(input: {
    readonly companyId: string;
    readonly conversationId: string;
    readonly messageId: string;
    readonly content: string;
    readonly recipients: readonly string[];
  }): Promise<{
    readonly externalMessageId: string;
    readonly externalMessageIds?: readonly string[];
    readonly acceptedAt?: string;
  }> {
    const recipients = normalizeRecipients(
      input.recipients,
    );

    if (recipients.length === 0) {
      throw new Error(
        "Meta WhatsApp delivery requires at least one recipient.",
      );
    }

    const content = input.content.trim();

    if (!content) {
      throw new Error(
        "Meta WhatsApp delivery requires non-empty content.",
      );
    }

    const deliveryResults: MetaWhatsAppDeliveryResult[] =
      [];

    for (const recipient of recipients) {
      deliveryResults.push(
        await this.sendToRecipient(
          recipient,
          content,
        ),
      );
    }

    const externalMessageIds =
      deliveryResults.map(
        (result) => result.externalMessageId,
      );

    return {
      externalMessageId: externalMessageIds[0],
      externalMessageIds,
      acceptedAt: new Date().toISOString(),
    };
  }

  private async sendToRecipient(
    recipient: string,
    content: string,
  ): Promise<MetaWhatsAppDeliveryResult> {
    const endpoint =
      `${this.baseUrl}/${this.graphApiVersion}` +
      `/${this.phoneNumberId}/messages`;

    let response: Response;

    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization:
            `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: recipient,
          type: "text",
          text: {
            preview_url: false,
            body: content,
          },
        }),
        cache: "no-store",
      });
    }
    catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown network failure.";

      throw new Error(
        `Meta WhatsApp network request failed: ${message}`,
      );
    }

    let payload: MetaWhatsAppMessageResponse;

    try {
      payload =
        await response.json() as
          MetaWhatsAppMessageResponse;
    }
    catch {
      throw new Error(
        `Meta WhatsApp returned a non-JSON response with HTTP ${response.status}.`,
      );
    }

    if (!response.ok || payload.error) {
      throw new Error(
        buildMetaErrorMessage(
          response.status,
          payload,
        ),
      );
    }

    const externalMessageId =
      payload.messages?.[0]?.id?.trim();

    if (!externalMessageId) {
      throw new Error(
        "Meta WhatsApp accepted the request without returning a message identifier.",
      );
    }

    return {
      recipient,
      externalMessageId,
    };
  }
}

export function createMetaWhatsAppTransportFromEnvironment():
  MetaWhatsAppTransport {
  return new MetaWhatsAppTransport({
    accessToken: requireConfigurationValue(
      "META_WHATSAPP_ACCESS_TOKEN",
      process.env.META_WHATSAPP_ACCESS_TOKEN,
    ),
    phoneNumberId: requireConfigurationValue(
      "META_WHATSAPP_PHONE_NUMBER_ID",
      process.env.META_WHATSAPP_PHONE_NUMBER_ID,
    ),
    graphApiVersion: requireConfigurationValue(
      "META_WHATSAPP_GRAPH_API_VERSION",
      process.env.META_WHATSAPP_GRAPH_API_VERSION,
    ),
    baseUrl:
      process.env.META_WHATSAPP_GRAPH_API_BASE_URL,
  });
}
