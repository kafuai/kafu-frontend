export type MetaWhatsAppDeliveryStatus =
  | "sent"
  | "delivered"
  | "read"
  | "failed";

export interface MetaWhatsAppWebhookError {
  readonly code?: number;
  readonly title?: string;
  readonly message?: string;
  readonly error_data?: {
    readonly details?: string;
  };
}

export interface MetaWhatsAppStatusEvent {
  readonly id?: string;
  readonly status?: string;
  readonly timestamp?: string;
  readonly recipient_id?: string;
  readonly conversation?: {
    readonly id?: string;
    readonly expiration_timestamp?: string;
    readonly origin?: {
      readonly type?: string;
    };
  };
  readonly pricing?: {
    readonly billable?: boolean;
    readonly pricing_model?: string;
    readonly category?: string;
  };
  readonly errors?:
    readonly MetaWhatsAppWebhookError[];
}

export interface MetaWhatsAppInboundMessage {
  readonly from?: string;
  readonly id?: string;
  readonly timestamp?: string;
  readonly type?: string;
  readonly text?: {
    readonly body?: string;
  };
  readonly context?: {
    readonly from?: string;
    readonly id?: string;
  };
}

export interface MetaWhatsAppWebhookValue {
  readonly messaging_product?: string;
  readonly metadata?: {
    readonly display_phone_number?: string;
    readonly phone_number_id?: string;
  };
  readonly contacts?: readonly {
    readonly profile?: {
      readonly name?: string;
    };
    readonly wa_id?: string;
  }[];
  readonly messages?:
    readonly MetaWhatsAppInboundMessage[];
  readonly statuses?:
    readonly MetaWhatsAppStatusEvent[];
}

export interface MetaWhatsAppWebhookChange {
  readonly field?: string;
  readonly value?: MetaWhatsAppWebhookValue;
}

export interface MetaWhatsAppWebhookEntry {
  readonly id?: string;
  readonly changes?:
    readonly MetaWhatsAppWebhookChange[];
}

export interface MetaWhatsAppWebhookPayload {
  readonly object?: string;
  readonly entry?:
    readonly MetaWhatsAppWebhookEntry[];
}

export interface MetaWhatsAppStatusWorkItem {
  readonly eventKey: string;
  readonly externalMessageId: string;
  readonly status:
    MetaWhatsAppDeliveryStatus;
  readonly providerTimestamp: string;
  readonly errorMessage?: string;
  readonly payload: MetaWhatsAppStatusEvent;
}

export interface MetaWhatsAppInboundWorkItem {
  readonly eventKey: string;
  readonly externalMessageId: string;
  readonly senderPhone: string;
  readonly providerTimestamp: string;
  readonly messageType: string;
  readonly text?: string;
  readonly phoneNumberId?: string;
  readonly payload: MetaWhatsAppInboundMessage;
}

function parseProviderTimestamp(
  value: string | undefined,
): string {
  const seconds = Number(value);

  if (
    !Number.isFinite(seconds) ||
    seconds <= 0
  ) {
    return new Date().toISOString();
  }

  return new Date(seconds * 1_000)
    .toISOString();
}

function normalizeDeliveryStatus(
  value: string | undefined,
): MetaWhatsAppDeliveryStatus | null {
  switch (value) {
    case "sent":
    case "delivered":
    case "read":
    case "failed":
      return value;

    default:
      return null;
  }
}

function createStatusErrorMessage(
  errors:
    readonly MetaWhatsAppWebhookError[] |
    undefined,
): string | undefined {
  if (!errors?.length) {
    return undefined;
  }

  return errors
    .map((error) => {
      const components = [
        error.title,
        error.message,
        error.error_data?.details,
        error.code !== undefined
          ? `Code: ${error.code}`
          : undefined,
      ].filter(
        (component):
          component is string =>
          Boolean(component?.trim()),
      );

      return components.join(" — ");
    })
    .filter(Boolean)
    .join(" | ");
}

export function extractMetaWhatsAppStatusItems(
  payload: MetaWhatsAppWebhookPayload,
): readonly MetaWhatsAppStatusWorkItem[] {
  const workItems:
    MetaWhatsAppStatusWorkItem[] = [];

  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field !== "messages") {
        continue;
      }

      for (
        const statusEvent of
        change.value?.statuses ?? []
      ) {
        const externalMessageId =
          statusEvent.id?.trim();

        const status =
          normalizeDeliveryStatus(
            statusEvent.status,
          );

        if (!externalMessageId || !status) {
          continue;
        }

        const providerTimestamp =
          parseProviderTimestamp(
            statusEvent.timestamp,
          );

        workItems.push({
          eventKey: [
            "meta_whatsapp",
            "status",
            externalMessageId,
            status,
            statusEvent.timestamp ?? "unknown",
          ].join(":"),
          externalMessageId,
          status,
          providerTimestamp,
          errorMessage:
            createStatusErrorMessage(
              statusEvent.errors,
            ),
          payload: statusEvent,
        });
      }
    }
  }

  return workItems;
}

export function extractMetaWhatsAppInboundItems(
  payload: MetaWhatsAppWebhookPayload,
): readonly MetaWhatsAppInboundWorkItem[] {
  const workItems:
    MetaWhatsAppInboundWorkItem[] = [];

  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field !== "messages") {
        continue;
      }

      const phoneNumberId =
        change.value?.metadata
          ?.phone_number_id?.trim();

      for (
        const message of
        change.value?.messages ?? []
      ) {
        const externalMessageId =
          message.id?.trim();

        const senderPhone =
          message.from?.trim();

        if (
          !externalMessageId ||
          !senderPhone
        ) {
          continue;
        }

        workItems.push({
          eventKey: [
            "meta_whatsapp",
            "inbound",
            externalMessageId,
          ].join(":"),
          externalMessageId,
          senderPhone,
          providerTimestamp:
            parseProviderTimestamp(
              message.timestamp,
            ),
          messageType:
            message.type?.trim() ||
            "unknown",
          text:
            message.text?.body?.trim() ||
            undefined,
          phoneNumberId,
          payload: message,
        });
      }
    }
  }

  return workItems;
}
