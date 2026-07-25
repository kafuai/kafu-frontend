import "server-only";

import {
  extractMetaWhatsAppInboundItems,
  extractMetaWhatsAppStatusItems,
  type MetaWhatsAppWebhookPayload,
} from "./metaWhatsAppWebhookTypes";

import {
  SupabaseMetaWhatsAppWebhookRepository,
} from "./supabaseMetaWhatsAppWebhookRepository";

export interface MetaWhatsAppWebhookProcessResult {
  readonly statusEvents: number;
  readonly inboundEvents: number;
  readonly processed: number;
  readonly ignored: number;
  readonly duplicates: number;
  readonly failed: number;
}

export class MetaWhatsAppWebhookProcessor {
  constructor(
    private readonly repository:
      SupabaseMetaWhatsAppWebhookRepository,
  ) {}

  async process(
    payload:
      MetaWhatsAppWebhookPayload,
  ): Promise<
    MetaWhatsAppWebhookProcessResult
  > {
    if (
      payload.object !==
      "whatsapp_business_account"
    ) {
      throw new Error(
        "Unsupported Meta webhook object.",
      );
    }

    const statusItems =
      extractMetaWhatsAppStatusItems(
        payload,
      );

    const inboundItems =
      extractMetaWhatsAppInboundItems(
        payload,
      );

    let processed = 0;
    let ignored = 0;
    let duplicates = 0;
    let failed = 0;

    for (const item of statusItems) {
      const claimed =
        await this.repository
          .claimStatusEvent(item);

      if (!claimed) {
        duplicates += 1;
        continue;
      }

      try {
        const target =
          await this.repository
            .findMessageByExternalId(
              item.externalMessageId,
            );

        if (!target) {
          ignored += 1;

          await this.repository
            .completeEvent(
              item.eventKey,
              "ignored",
              {
                errorMessage:
                  "No KAFU AI message matches the Meta external message id.",
              },
            );

          continue;
        }

        if (
          !this.repository
            .shouldApplyDeliveryStatus(
              target,
              item.status,
              item.providerTimestamp,
            )
        ) {
          ignored += 1;

          await this.repository
            .completeEvent(
              item.eventKey,
              "ignored",
              {
                target,
                errorMessage:
                  "Delivery update was stale or would regress the current status.",
              },
            );

          continue;
        }

        await this.repository
          .updateDeliveryStatus(
            target,
            item,
          );

        await this.repository
          .writeAudit({
            action:
              "delivery_updated",
            target,
            deliveryStatus:
              item.status,
            details: {
              provider:
                "meta_whatsapp",
              externalMessageId:
                item.externalMessageId,
              providerTimestamp:
                item.providerTimestamp,
              errorMessage:
                item.errorMessage,
            },
          });

        await this.repository
          .completeEvent(
            item.eventKey,
            "processed",
            {
              target,
            },
          );

        processed += 1;
      } catch (error) {
        failed += 1;

        const message =
          error instanceof Error
            ? error.message
            : "Unknown webhook processing failure.";

        await this.repository
          .completeEvent(
            item.eventKey,
            "failed",
            {
              errorMessage:
                message,
            },
          );
      }
    }

    /*
     * Inbound events are persisted idempotently now.
     * Tenant/conversation routing requires an explicit
     * phone-number-to-workspace mapping and is therefore
     * not guessed from the provider payload.
     */
    for (const item of inboundItems) {
      const claimed =
        await this.repository
          .claimInboundEvent(item);

      if (!claimed) {
        duplicates += 1;
        continue;
      }

      await this.repository
        .completeEvent(
          item.eventKey,
          "ignored",
          {
            errorMessage:
              "Inbound message retained pending explicit WhatsApp workspace routing.",
          },
        );

      ignored += 1;
    }

    return {
      statusEvents:
        statusItems.length,
      inboundEvents:
        inboundItems.length,
      processed,
      ignored,
      duplicates,
      failed,
    };
  }
}
