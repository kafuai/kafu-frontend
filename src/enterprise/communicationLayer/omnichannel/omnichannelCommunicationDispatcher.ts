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
  CommunicationMessage,
} from "../communicationTypes";

import type {
  OmnichannelCapability,
  OmnichannelDeliveryPriority,
} from "./omnichannelModels";

import type {
  OmnichannelRuntime,
} from "./omnichannelRuntime";

export interface DispatchOmnichannelMessageInput {
  readonly message:
    SendCommunicationMessageInput;
  readonly tenantId?: string;
  readonly organizationId?: string;
  readonly requiredCapabilities?:
    readonly OmnichannelCapability[];
  readonly preferredProviderId?: string;
  readonly priority?:
    OmnichannelDeliveryPriority;
  readonly region?: string;
}

export class OmnichannelCommunicationDispatcher {
  constructor(
    private readonly repository:
      CommunicationRepository,
    private readonly runtime:
      OmnichannelRuntime,
  ) {}

  async dispatch(
    input: DispatchOmnichannelMessageInput,
  ): Promise<{
    readonly message:
      CommunicationMessage;
    readonly providerId: string;
    readonly result:
      CommunicationSendResult;
  }> {
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
          content:
            input.message.content.trim(),
          deliveryStatus: "queued",
          createdAt:
            new Date().toISOString(),
          updatedAt:
            new Date().toISOString(),
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

    await this.repository.updateMessageDeliveryStatus(
      input.message.companyId,
      message.id,
      "sending",
    );

    try {
      const attachments =
        await this.repository.listAttachments(
          input.message.companyId,
          message.id,
        );

      const delivery =
        await this.runtime.send({
          companyId:
            input.message.companyId,
          tenantId:
            input.tenantId,
          organizationId:
            input.organizationId,
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
          priority:
            input.priority,
          region:
            input.region,
        });

      const updatedMessage =
        await this.repository.updateMessageDeliveryStatus(
          input.message.companyId,
          message.id,
          delivery.result.deliveredAt
            ? "delivered"
            : "sent",
        );

      return {
        message: updatedMessage,
        providerId:
          delivery.providerId,
        result:
          delivery.result,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unknown omnichannel dispatch error.";

      await this.repository.updateMessageDeliveryStatus(
        input.message.companyId,
        message.id,
        "failed",
        errorMessage,
      );

      throw error;
    }
  }
}
