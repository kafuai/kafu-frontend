import {
  createCommunicationAuditEntry,
  type CommunicationAuditWriter,
} from "./communicationAudit";
import type {
  CommunicationInboundService,
} from "./communicationInboundService";
import {
  CommunicationWebhookError,
  validateCommunicationWebhook,
  type CommunicationWebhookParser,
  type CommunicationWebhookRequest,
  type CommunicationWebhookVerifier,
} from "./communicationWebhook";

export interface ProcessCommunicationWebhookInput {
  readonly eventId: string;
  readonly request: CommunicationWebhookRequest;
}

export interface CommunicationWebhookProcessingResult {
  readonly eventId: string;
  readonly kind:
    | "incoming_message"
    | "delivery_update";
  readonly companyId: string;
  readonly conversationId: string;
  readonly messageId: string;
  readonly processedAt: string;
}

export class CommunicationWebhookProcessor {
  constructor(
    private readonly verifier: CommunicationWebhookVerifier,
    private readonly parser: CommunicationWebhookParser,
    private readonly inboundService: CommunicationInboundService,
    private readonly auditWriter: CommunicationAuditWriter,
  ) {}

  async process(
    input: ProcessCommunicationWebhookInput,
  ): Promise<CommunicationWebhookProcessingResult> {
    try {
      await validateCommunicationWebhook(
        this.verifier,
        input.request,
      );

      const webhook = await this.parser.parse(
        input.request,
      );

      await this.auditWriter.write(
        createCommunicationAuditEntry({
          id: `${input.eventId}:received`,
          companyId: webhook.companyId,
          action: "webhook_received",
          channel: webhook.channel,
          actorId: "communication-provider",
          source: "communication-webhook",
          details: {
            kind: webhook.kind,
          },
        }),
      );

      if (webhook.kind === "incoming_message") {
        const message =
          await this.inboundService.receiveMessage({
            eventId: input.eventId,
            companyId: webhook.companyId,
            channel: webhook.channel,
            payload: webhook.payload,
          });

        return {
          eventId: input.eventId,
          kind: webhook.kind,
          companyId: webhook.companyId,
          conversationId: message.conversationId,
          messageId: message.id,
          processedAt: new Date().toISOString(),
        };
      }

      const messageId =
        webhook.payload.metadata?.messageId;

      if (!messageId) {
        throw new CommunicationWebhookError(
          "Delivery webhook does not contain an internal message ID.",
          "INVALID_PAYLOAD",
        );
      }

      const message =
        await this.inboundService.updateDelivery({
          eventId: input.eventId,
          companyId: webhook.companyId,
          messageId,
          channel: webhook.channel,
          payload: webhook.payload,
        });

      return {
        eventId: input.eventId,
        kind: webhook.kind,
        companyId: webhook.companyId,
        conversationId: message.conversationId,
        messageId: message.id,
        processedAt: new Date().toISOString(),
      };
    } catch (error) {
      const webhookError =
        error instanceof CommunicationWebhookError
          ? error
          : new CommunicationWebhookError(
              error instanceof Error
                ? error.message
                : "Unknown webhook processing error.",
              "INVALID_PAYLOAD",
            );

      await this.auditWriter.write(
        createCommunicationAuditEntry({
          id: `${input.eventId}:rejected`,
          companyId: "unknown",
          action: "webhook_rejected",
          actorId: "communication-provider",
          source: "communication-webhook",
          details: {
            code: webhookError.code,
            message: webhookError.message,
          },
        }),
      );

      throw webhookError;
    }
  }
}
