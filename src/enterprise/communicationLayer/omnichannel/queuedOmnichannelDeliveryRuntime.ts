import type {
  CommunicationAuditWriter,
} from "../communicationAudit";

import {
  createCommunicationAuditEntry,
} from "../communicationAudit";

import type {
  CommunicationRepository,
} from "../communicationRepository";

import type {
  CommunicationSendResult,
} from "../communicationChannelAdapter";

import type {
  SendCommunicationMessageInput,
} from "../communicationService";

import type {
  CommunicationDeliveryStatus,
  CommunicationMessage,
} from "../communicationTypes";

import {
  OmnichannelDeliveryQueue,
  type OmnichannelDeliveryQueueItem,
} from "./deliveryQueue";

import type {
  OmnichannelCapability,
  OmnichannelDeliveryPriority,
  OmnichannelRouteContext,
} from "./omnichannelModels";

import type {
  OmnichannelRuntime,
} from "./omnichannelRuntime";

export interface QueueOmnichannelMessageInput {
  readonly message: SendCommunicationMessageInput;
  readonly tenantId?: string;
  readonly organizationId?: string;
  readonly requiredCapabilities?:
    readonly OmnichannelCapability[];
  readonly preferredProviderId?: string;
  readonly excludedProviderIds?: readonly string[];
  readonly priority?: OmnichannelDeliveryPriority;
  readonly region?: string;
  readonly availableAt?: string;
  readonly auditSource?: string;
}

export interface ProcessedOmnichannelDelivery {
  readonly queueItemId: string;
  readonly message: CommunicationMessage;
  readonly providerId: string;
  readonly result: CommunicationSendResult;
}

export interface QueuedOmnichannelDeliveryRuntimeOptions {
  readonly repository: CommunicationRepository;
  readonly runtime: OmnichannelRuntime;
  readonly auditWriter: CommunicationAuditWriter;
  readonly queue?: OmnichannelDeliveryQueue;
  readonly auditSource?: string;
}

export class QueuedOmnichannelDeliveryRuntime {
  private readonly repository: CommunicationRepository;
  private readonly runtime: OmnichannelRuntime;
  private readonly auditWriter: CommunicationAuditWriter;
  private readonly queue: OmnichannelDeliveryQueue;
  private readonly auditSource: string;

  constructor(
    options: QueuedOmnichannelDeliveryRuntimeOptions,
  ) {
    this.repository = options.repository;
    this.runtime = options.runtime;
    this.auditWriter = options.auditWriter;
    this.queue =
      options.queue ??
      new OmnichannelDeliveryQueue();
    this.auditSource =
      options.auditSource ??
      "queued_omnichannel_delivery_runtime";
  }

  async enqueue(
    input: QueueOmnichannelMessageInput,
  ): Promise<{
    readonly queueItemId: string;
    readonly message: CommunicationMessage;
  }> {
    const now = new Date().toISOString();

    const conversation =
      await this.repository.findConversationById(
        input.message.companyId,
        input.message.conversationId,
      );

    if (!conversation) {
      throw new Error(
        `Communication conversation was not found: ${input.message.conversationId}`,
      );
    }

    const content = input.message.content.trim();

    if (
      content.length === 0 &&
      (input.message.attachments?.length ?? 0) === 0
    ) {
      throw new Error(
        "A communication message requires content or at least one attachment.",
      );
    }

    const message =
      await this.repository.createMessage(
        input.message.companyId,
        {
          id: input.message.id,
          conversationId:
            input.message.conversationId,
          senderId:
            input.message.senderId,
          channel:
            conversation.channel,
          direction:
            input.message.direction ??
            "outbound",
          type:
            input.message.type ??
            "text",
          content,
          deliveryStatus:
            "queued",
          createdAt:
            now,
          updatedAt:
            now,
          replyToMessageId:
            input.message.replyToMessageId,
        },
      );

    for (
      const attachment of
      input.message.attachments ?? []
    ) {
      await this.repository.createAttachment(
        attachment,
      );
    }

    const attachments =
      await this.repository.listAttachments(
        input.message.companyId,
        message.id,
      );

    const context: OmnichannelRouteContext = {
      companyId:
        input.message.companyId,
      tenantId:
        input.tenantId ??
        input.message.companyId,
      organizationId:
        input.organizationId ??
        input.message.companyId,
      conversation,
      message,
      sendContext: {
        companyId:
          input.message.companyId,
        conversation,
        message,
        attachments,
      },
      requiredCapabilities:
        input.requiredCapabilities,
      preferredProviderId:
        input.preferredProviderId,
      excludedProviderIds:
        input.excludedProviderIds,
      priority:
        input.priority ??
        "normal",
      mode:
        "fallback",
      region:
        input.region,
    };

    const queueItemId =
      this.createId("delivery");

    const queueItem:
      OmnichannelDeliveryQueueItem = {
        id: queueItemId,
        context,
        priority:
          input.priority ??
          "normal",
        enqueuedAt:
          now,
        availableAt:
          input.availableAt ??
          now,
      };

    this.queue.enqueue(queueItem);

    await this.writeAudit({
      companyId:
        input.message.companyId,
      conversationId:
        conversation.id,
      messageId:
        message.id,
      action:
        "message_created",
      channel:
        conversation.channel,
      deliveryStatus:
        "queued",
      actorId:
        input.message.senderId,
      source:
        input.auditSource ??
        this.auditSource,
      details: {
        queueItemId,
        priority:
          queueItem.priority,
        availableAt:
          queueItem.availableAt,
        attachmentCount:
          attachments.length,
      },
    });

    return {
      queueItemId,
      message,
    };
  }

  async processNext():
    Promise<ProcessedOmnichannelDelivery | null> {
    const item = this.queue.dequeue();

    if (!item) {
      return null;
    }

    const {
      companyId,
      conversation,
      message,
    } = item.context;

    await this.updateDeliveryStatus(
      companyId,
      message.id,
      "sending",
    );

    await this.writeAudit({
      companyId,
      conversationId:
        conversation.id,
      messageId:
        message.id,
      action:
        "message_dispatched",
      channel:
        conversation.channel,
      deliveryStatus:
        "sending",
      actorId:
        message.senderId,
      source:
        this.auditSource,
      details: {
        queueItemId:
          item.id,
        priority:
          item.priority,
      },
    });

    try {
      const delivery =
        await this.runtime.send({
          companyId:
            item.context.companyId,
          tenantId:
            item.context.tenantId,
          organizationId:
            item.context.organizationId,
          sendContext:
            item.context.sendContext,
          requiredCapabilities:
            item.context.requiredCapabilities,
          preferredProviderId:
            item.context.preferredProviderId,
          excludedProviderIds:
            item.context.excludedProviderIds,
          priority:
            item.context.priority,
          region:
            item.context.region,
        });

      const status:
        CommunicationDeliveryStatus =
          delivery.result.deliveredAt
            ? "delivered"
            : "sent";

      const updatedMessage =
        await this.updateDeliveryStatus(
          companyId,
          message.id,
          status,
        );

      await this.writeAudit({
        companyId,
        conversationId:
          conversation.id,
        messageId:
          message.id,
        action:
          "delivery_updated",
        channel:
          conversation.channel,
        deliveryStatus:
          status,
        actorId:
          message.senderId,
        source:
          this.auditSource,
        details: {
          queueItemId:
            item.id,
          providerId:
            delivery.providerId,
          externalMessageId:
            delivery.result.externalMessageId,
          deliveredAt:
            delivery.result.deliveredAt,
          attemptCount:
            delivery.attempts.length,
        },
      });

      return {
        queueItemId:
          item.id,
        message:
          updatedMessage,
        providerId:
          delivery.providerId,
        result:
          delivery.result,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unknown queued omnichannel delivery error.";

      await this.repository.updateMessageDeliveryStatus(
        companyId,
        message.id,
        "failed",
        errorMessage,
      );

      await this.writeAudit({
        companyId,
        conversationId:
          conversation.id,
        messageId:
          message.id,
        action:
          "delivery_updated",
        channel:
          conversation.channel,
        deliveryStatus:
          "failed",
        actorId:
          message.senderId,
        source:
          this.auditSource,
        details: {
          queueItemId:
            item.id,
          error:
            errorMessage,
          deadLetterHandledByRuntime:
            true,
        },
      });

      throw error;
    }
  }

  async processAvailable(
    maximumItems = 25,
  ): Promise<
    readonly ProcessedOmnichannelDelivery[]
  > {
    if (
      !Number.isInteger(maximumItems) ||
      maximumItems < 1
    ) {
      throw new Error(
        "Maximum delivery items must be a positive integer.",
      );
    }

    const processed:
      ProcessedOmnichannelDelivery[] = [];

    while (
      processed.length < maximumItems
    ) {
      const result =
        await this.processNext();

      if (!result) {
        break;
      }

      processed.push(result);
    }

    return processed;
  }

  getQueueSize(): number {
    return this.queue.size();
  }

  listQueuedItems():
    readonly OmnichannelDeliveryQueueItem[] {
    return this.queue.list();
  }

  private async updateDeliveryStatus(
    companyId: string,
    messageId: string,
    status: CommunicationDeliveryStatus,
  ): Promise<CommunicationMessage> {
    return this.repository.updateMessageDeliveryStatus(
      companyId,
      messageId,
      status,
    );
  }

  private async writeAudit(
    input: {
      readonly companyId: string;
      readonly conversationId: string;
      readonly messageId: string;
      readonly action:
        | "message_created"
        | "message_dispatched"
        | "delivery_updated";
      readonly channel:
        OmnichannelRouteContext["conversation"]["channel"];
      readonly deliveryStatus:
        CommunicationDeliveryStatus;
      readonly actorId: string;
      readonly source: string;
      readonly details:
        Readonly<Record<string, unknown>>;
    },
  ): Promise<void> {
    await this.auditWriter.write(
      createCommunicationAuditEntry({
        id:
          this.createId("audit"),
        companyId:
          input.companyId,
        conversationId:
          input.conversationId,
        messageId:
          input.messageId,
        action:
          input.action,
        channel:
          input.channel,
        deliveryStatus:
          input.deliveryStatus,
        actorId:
          input.actorId,
        source:
          input.source,
        details:
          input.details,
      }),
    );
  }

  private createId(
    prefix: string,
  ): string {
    return (
      globalThis.crypto?.randomUUID?.() ??
      `${prefix}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`
    );
  }
}

