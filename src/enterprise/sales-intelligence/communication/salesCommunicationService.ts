import type {
  CommunicationConversation,
  CommunicationMessage,
} from "../../communicationLayer/communicationTypes";

import type {
  CommunicationChannelAdapter,
} from "../../communicationLayer/communicationChannelAdapter";

import type {
  QueuedOmnichannelDeliveryRuntime,
} from "../../communicationLayer/omnichannel/queuedOmnichannelDeliveryRuntime";

import {
  CommunicationApplicationService,
} from "../../communicationLayer/application/communicationApplicationService";

import type {
  CommunicationAuthorization,
  CommunicationCreateConversationInput,
  CommunicationCreateMessageInput,
  SalesCommunicationEntityReference,
  SalesCommunicationResult,
} from "./salesCommunicationTypes";

export interface CreateSalesConversationRequest {
  readonly entity: SalesCommunicationEntityReference;
  readonly input: CommunicationCreateConversationInput;
  readonly authorization: CommunicationAuthorization;
}

export interface CreateSalesMessageRequest {
  readonly entity: SalesCommunicationEntityReference;
  readonly input: CommunicationCreateMessageInput;
  readonly authorization: CommunicationAuthorization;
}

export interface DispatchSalesMessageRequest
  extends CreateSalesMessageRequest {
  readonly adapter: CommunicationChannelAdapter;
}

function assertSameCompany(
  entity: SalesCommunicationEntityReference,
  input: {
    readonly companyId: string;
  },
): void {
  if (entity.companyId !== input.companyId) {
    throw new Error(
      "Sales communication entity and communication request must belong to the same company.",
    );
  }
}

function assertConversationReference(
  entity: SalesCommunicationEntityReference,
  conversation: CommunicationConversation,
): void {
  if (
    conversation.metadata.companyId !== entity.companyId
  ) {
    throw new Error(
      "Sales communication conversation belongs to a different company.",
    );
  }
}

export class SalesCommunicationService {
  constructor(
    private readonly communication:
      CommunicationApplicationService,
    private readonly queuedDeliveryRuntime?:
      QueuedOmnichannelDeliveryRuntime,
  ) {}

  async createConversation(
    request: CreateSalesConversationRequest,
  ): Promise<
    SalesCommunicationResult<CommunicationConversation>
  > {
    assertSameCompany(
      request.entity,
      request.input,
    );

    const conversation =
      await this.communication.createAuthorizedConversation(
        request.input,
        request.authorization,
      );

    assertConversationReference(
      request.entity,
      conversation,
    );

    return {
      operation: "conversation_created",
      entity: request.entity,
      value: conversation,
      conversationId: conversation.id,
    };
  }

  async createQueuedMessage(
    request: CreateSalesMessageRequest,
  ): Promise<
    SalesCommunicationResult<CommunicationMessage>
  > {
    assertSameCompany(
      request.entity,
      request.input,
    );

    let message: CommunicationMessage;

    if (this.queuedDeliveryRuntime) {
      this.communication.assertMessageCreateAuthorization(
        request.authorization,
      );

      const queued =
        await this.queuedDeliveryRuntime.enqueue({
          message: request.input,
          tenantId:
            request.authorization.permissionContext.tenantId,
          organizationId:
            request.authorization.permissionContext.organizationId,
          priority: "normal",
          auditSource:
            "sales-intelligence",
        });

      message = queued.message;

      await this.communication.publishMessageLifecycleEvents(
        request.input,
        message,
      );
    } else {
      message =
        await this.communication.createAuthorizedQueuedMessage(
          request.input,
          request.authorization,
        );
    }

    return {
      operation: "message_queued",
      entity: request.entity,
      value: message,
      conversationId: message.conversationId,
    };
  }

  async dispatchMessage(
    request: DispatchSalesMessageRequest,
  ): Promise<
    SalesCommunicationResult<CommunicationMessage>
  > {
    assertSameCompany(
      request.entity,
      request.input,
    );

    const message =
      await this.communication.dispatchAuthorizedMessage(
        request.input,
        request.adapter,
        request.authorization,
      );

    return {
      operation: "message_dispatched",
      entity: request.entity,
      value: message,
      conversationId: message.conversationId,
    };
  }

  async getConversation(
    entity: SalesCommunicationEntityReference,
    conversationId: string,
    authorization: CommunicationAuthorization,
  ): Promise<
    SalesCommunicationResult<CommunicationConversation>
  > {
    const conversation =
      await this.communication.getAuthorizedConversation(
        entity.companyId,
        conversationId,
        authorization,
      );

    assertConversationReference(
      entity,
      conversation,
    );

    return {
      operation: "conversation_loaded",
      entity,
      value: conversation,
      conversationId: conversation.id,
    };
  }
}
