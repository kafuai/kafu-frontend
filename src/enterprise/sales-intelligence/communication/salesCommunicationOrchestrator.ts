import type {
  CommunicationConversation,
  CommunicationMessage,
} from "../../communicationLayer/communicationTypes";

import type {
  CommunicationChannelAdapter,
} from "../../communicationLayer/communicationChannelAdapter";

import type {
  CommunicationAuthorization,
  CommunicationCreateConversationInput,
  CommunicationCreateMessageInput,
  SalesCommunicationConversationLink,
  SalesCommunicationEntityReference,
  SalesCommunicationResult,
} from "./salesCommunicationTypes";

import type {
  SalesCommunicationLinkRepository,
} from "./salesCommunicationLinkRepository";

import {
  SalesCommunicationFacade,
} from "./salesCommunicationFacade";

export interface EnsureSalesConversationInput {
  readonly entity: SalesCommunicationEntityReference;
  readonly conversation:
    CommunicationCreateConversationInput;
  readonly authorization:
    CommunicationAuthorization;
}

export interface QueueSalesEntityMessageInput {
  readonly entity: SalesCommunicationEntityReference;
  readonly conversation:
    CommunicationCreateConversationInput;
  readonly message:
    CommunicationCreateMessageInput;
  readonly authorization:
    CommunicationAuthorization;
}

export interface DispatchSalesEntityMessageInput
  extends QueueSalesEntityMessageInput {
  readonly adapter: CommunicationChannelAdapter;
}

export interface EnsuredSalesConversation {
  readonly conversation: CommunicationConversation;
  readonly link: SalesCommunicationConversationLink;
  readonly created: boolean;
}

function toConversationLink(
  entity: SalesCommunicationEntityReference,
  conversation: CommunicationConversation,
): SalesCommunicationConversationLink {
  return {
    companyId: entity.companyId,
    entityType: entity.entityType,
    entityId: entity.entityId,
    conversationId: conversation.id,
    externalReferenceId: entity.externalReferenceId,
    createdAt: conversation.metadata.createdAt,
  };
}

function assertConversationInputReference(
  entity: SalesCommunicationEntityReference,
  input: CommunicationCreateConversationInput,
): void {
  if (input.companyId !== entity.companyId) {
    throw new Error(
      "Sales entity and conversation must belong to the same company.",
    );
  }

  if (
    input.externalReferenceId !==
    entity.externalReferenceId
  ) {
    throw new Error(
      "Conversation external reference must match the sales entity reference.",
    );
  }
}

function assertMessageConversation(
  message: CommunicationCreateMessageInput,
  conversationId: string,
): void {
  if (message.conversationId !== conversationId) {
    throw new Error(
      "Sales communication message targets a different conversation.",
    );
  }
}

export class SalesCommunicationOrchestrator {
  constructor(
    private readonly facade:
      SalesCommunicationFacade,
    private readonly links:
      SalesCommunicationLinkRepository,
  ) {}

  async ensureConversation(
    input: EnsureSalesConversationInput,
  ): Promise<EnsuredSalesConversation> {
    assertConversationInputReference(
      input.entity,
      input.conversation,
    );

    const existing =
      await this.links.findConversation(input.entity);

    if (existing) {
      return {
        conversation: existing,
        link: toConversationLink(
          input.entity,
          existing,
        ),
        created: false,
      };
    }

    const result =
      await this.facade.openConversation({
        entity: input.entity,
        conversation: input.conversation,
        authorization: input.authorization,
      });

    return {
      conversation: result.value,
      link: toConversationLink(
        input.entity,
        result.value,
      ),
      created: true,
    };
  }

  async queueMessage(
    input: QueueSalesEntityMessageInput,
  ): Promise<
    SalesCommunicationResult<CommunicationMessage>
  > {
    const ensured =
      await this.ensureConversation(input);

    const message = {
      ...input.message,
      conversationId: ensured.conversation.id,
    };

    assertMessageConversation(
      message,
      ensured.conversation.id,
    );

    return this.facade.queueMessage({
      entity: input.entity,
      message,
      authorization: input.authorization,
    });
  }

  async dispatchMessage(
    input: DispatchSalesEntityMessageInput,
  ): Promise<
    SalesCommunicationResult<CommunicationMessage>
  > {
    const ensured =
      await this.ensureConversation(input);

    const message = {
      ...input.message,
      conversationId: ensured.conversation.id,
    };

    assertMessageConversation(
      message,
      ensured.conversation.id,
    );

    return this.facade.sendMessage({
      entity: input.entity,
      message,
      adapter: input.adapter,
      authorization: input.authorization,
    });
  }
}
