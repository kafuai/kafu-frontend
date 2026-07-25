import "server-only";

import type {
  SupabaseClient,
} from "@supabase/supabase-js";

import type {
  MetaWhatsAppDeliveryStatus,
  MetaWhatsAppInboundWorkItem,
  MetaWhatsAppStatusWorkItem,
} from "./metaWhatsAppWebhookTypes";

export type WebhookProcessingStatus =
  | "received"
  | "processed"
  | "ignored"
  | "failed";

interface CommunicationMessageRow {
  readonly id: string;
  readonly company_id: string;
  readonly conversation_id: string;
  readonly delivery_status: string;
  readonly external_message_id: string | null;
  readonly last_delivery_event_at: string | null;
}

export interface MetaWhatsAppWebhookMessageTarget {
  readonly id: string;
  readonly companyId: string;
  readonly conversationId: string;
  readonly deliveryStatus: string;
  readonly externalMessageId: string;
  readonly lastDeliveryEventAt?: string;
}

const deliveryRank:
  Readonly<Record<string, number>> = {
    draft: 0,
    queued: 10,
    sending: 20,
    sent: 30,
    delivered: 40,
    read: 50,
    failed: 60,
  };

function mapMessageTarget(
  row: CommunicationMessageRow,
): MetaWhatsAppWebhookMessageTarget {
  return {
    id: row.id,
    companyId: row.company_id,
    conversationId:
      row.conversation_id,
    deliveryStatus:
      row.delivery_status,
    externalMessageId:
      row.external_message_id ?? "",
    lastDeliveryEventAt:
      row.last_delivery_event_at ??
      undefined,
  };
}

export class SupabaseMetaWhatsAppWebhookRepository {
  constructor(
    private readonly client:
      SupabaseClient,
  ) {}

  async claimStatusEvent(
    item: MetaWhatsAppStatusWorkItem,
  ): Promise<boolean> {
    return this.claimEvent({
      eventKey: item.eventKey,
      eventType:
        `delivery.${item.status}`,
      externalMessageId:
        item.externalMessageId,
      providerTimestamp:
        item.providerTimestamp,
      payload: item.payload,
    });
  }

  async claimInboundEvent(
    item: MetaWhatsAppInboundWorkItem,
  ): Promise<boolean> {
    return this.claimEvent({
      eventKey: item.eventKey,
      eventType:
        `message.${item.messageType}`,
      externalMessageId:
        item.externalMessageId,
      providerTimestamp:
        item.providerTimestamp,
      payload: item.payload,
    });
  }

  async findMessageByExternalId(
    externalMessageId: string,
  ): Promise<
    MetaWhatsAppWebhookMessageTarget |
    null
  > {
    const {
      data,
      error,
    } = await this.client
      .from("communication_messages")
      .select(
        [
          "id",
          "company_id",
          "conversation_id",
          "delivery_status",
          "external_message_id",
          "last_delivery_event_at",
        ].join(","),
      )
      .eq(
        "external_message_id",
        externalMessageId,
      )
      .maybeSingle<CommunicationMessageRow>();

    if (error) {
      throw new Error(
        `Failed to find WhatsApp message by external id: ${error.message}`,
      );
    }

    return data
      ? mapMessageTarget(data)
      : null;
  }

  shouldApplyDeliveryStatus(
    target:
      MetaWhatsAppWebhookMessageTarget,
    status:
      MetaWhatsAppDeliveryStatus,
    providerTimestamp: string,
  ): boolean {
    const incomingTimestamp =
      new Date(
        providerTimestamp,
      ).getTime();

    const currentTimestamp =
      target.lastDeliveryEventAt
        ? new Date(
            target.lastDeliveryEventAt,
          ).getTime()
        : 0;

    if (
      Number.isFinite(currentTimestamp) &&
      incomingTimestamp <
        currentTimestamp
    ) {
      return false;
    }

    const currentRank =
      deliveryRank[
        target.deliveryStatus
      ] ?? -1;

    const incomingRank =
      deliveryRank[status] ?? -1;

    if (status === "failed") {
      return (
        target.deliveryStatus !==
          "read" &&
        incomingTimestamp >=
          currentTimestamp
      );
    }

    return incomingRank >= currentRank;
  }

  async updateDeliveryStatus(
    target:
      MetaWhatsAppWebhookMessageTarget,
    item: MetaWhatsAppStatusWorkItem,
  ): Promise<void> {
    const {
      error,
    } = await this.client
      .from("communication_messages")
      .update({
        delivery_status: item.status,
        error_message:
          item.status === "failed"
            ? item.errorMessage ??
              "Meta WhatsApp delivery failed."
            : null,
        last_delivery_event_at:
          item.providerTimestamp,
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", target.id)
      .eq(
        "company_id",
        target.companyId,
      );

    if (error) {
      throw new Error(
        `Failed to update WhatsApp delivery status: ${error.message}`,
      );
    }
  }

  async completeEvent(
    eventKey: string,
    status:
      WebhookProcessingStatus,
    options: {
      readonly target?:
        MetaWhatsAppWebhookMessageTarget;
      readonly errorMessage?: string;
    } = {},
  ): Promise<void> {
    const {
      error,
    } = await this.client
      .from(
        "communication_webhook_events",
      )
      .update({
        company_id:
          options.target?.companyId ??
          null,
        conversation_id:
          options.target
            ?.conversationId ?? null,
        message_id:
          options.target?.id ?? null,
        processing_status: status,
        error_message:
          options.errorMessage ?? null,
        processed_at:
          new Date().toISOString(),
      })
      .eq("event_key", eventKey);

    if (error) {
      throw new Error(
        `Failed to complete WhatsApp webhook event: ${error.message}`,
      );
    }
  }

  async writeAudit(input: {
    readonly action:
      | "webhook_received"
      | "webhook_rejected"
      | "delivery_updated";
    readonly target?:
      MetaWhatsAppWebhookMessageTarget;
    readonly deliveryStatus?: string;
    readonly details:
      Readonly<Record<string, unknown>>;
  }): Promise<void> {
    const {
      error,
    } = await this.client
      .from(
        "communication_audit_log",
      )
      .insert({
        id:
          globalThis.crypto
            ?.randomUUID?.() ??
          `audit-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`,
        company_id:
          input.target?.companyId ??
          "system",
        conversation_id:
          input.target
            ?.conversationId ?? null,
        message_id:
          input.target?.id ?? null,
        action: input.action,
        channel: "whatsapp",
        delivery_status:
          input.deliveryStatus ??
          null,
        actor_id:
          "meta-whatsapp-webhook",
        source:
          "meta_whatsapp",
        details: input.details,
        created_at:
          new Date().toISOString(),
      });

    if (error) {
      throw new Error(
        `Failed to write WhatsApp webhook audit: ${error.message}`,
      );
    }
  }

  private async claimEvent(input: {
    readonly eventKey: string;
    readonly eventType: string;
    readonly externalMessageId: string;
    readonly providerTimestamp: string;
    readonly payload: unknown;
  }): Promise<boolean> {
    const {
      error,
    } = await this.client
      .from(
        "communication_webhook_events",
      )
      .insert({
        event_key: input.eventKey,
        provider:
          "meta_whatsapp",
        event_type:
          input.eventType,
        external_message_id:
          input.externalMessageId,
        provider_timestamp:
          input.providerTimestamp,
        processing_status:
          "received",
        payload: input.payload,
        received_at:
          new Date().toISOString(),
      });

    if (!error) {
      return true;
    }

    if (
      error.code === "23505"
    ) {
      return false;
    }

    throw new Error(
      `Failed to claim WhatsApp webhook event: ${error.message}`,
    );
  }
}
