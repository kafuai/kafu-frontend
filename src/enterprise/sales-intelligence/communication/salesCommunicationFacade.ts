import type {
  CommunicationChannelAdapter,
} from "../../communicationLayer/communicationChannelAdapter";

import type {
  CommunicationConversation,
  CommunicationMessage,
} from "../../communicationLayer/communicationTypes";

import type {
  CommunicationAuthorization,
  CommunicationCreateConversationInput,
  CommunicationCreateMessageInput,
  SalesCommunicationEntityReference,
  SalesCommunicationResult,
} from "./salesCommunicationTypes";

import {
  SalesCommunicationService,
} from "./salesCommunicationService";

export interface OpenSalesCommunicationInput {
  readonly entity: SalesCommunicationEntityReference;
  readonly conversation:
    CommunicationCreateConversationInput;
  readonly authorization:
    CommunicationAuthorization;
}

export interface QueueSalesCommunicationInput {
  readonly entity: SalesCommunicationEntityReference;
  readonly message: CommunicationCreateMessageInput;
  readonly authorization:
    CommunicationAuthorization;
}

export interface SendSalesCommunicationInput
  extends QueueSalesCommunicationInput {
  readonly adapter: CommunicationChannelAdapter;
}

export class SalesCommunicationFacade {
  constructor(
    private readonly service:
      SalesCommunicationService,
  ) {}

  openConversation(
    input: OpenSalesCommunicationInput,
  ): Promise<
    SalesCommunicationResult<CommunicationConversation>
  > {
    return this.service.createConversation({
      entity: input.entity,
      input: input.conversation,
      authorization: input.authorization,
    });
  }

  queueMessage(
    input: QueueSalesCommunicationInput,
  ): Promise<
    SalesCommunicationResult<CommunicationMessage>
  > {
    return this.service.createQueuedMessage({
      entity: input.entity,
      input: input.message,
      authorization: input.authorization,
    });
  }

  sendMessage(
    input: SendSalesCommunicationInput,
  ): Promise<
    SalesCommunicationResult<CommunicationMessage>
  > {
    return this.service.dispatchMessage({
      entity: input.entity,
      input: input.message,
      adapter: input.adapter,
      authorization: input.authorization,
    });
  }

  loadConversation(
    entity: SalesCommunicationEntityReference,
    conversationId: string,
    authorization: CommunicationAuthorization,
  ): Promise<
    SalesCommunicationResult<CommunicationConversation>
  > {
    return this.service.getConversation(
      entity,
      conversationId,
      authorization,
    );
  }
}
