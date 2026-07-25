import {
  SalesCommunicationOrchestrator,
} from "../salesCommunicationOrchestrator";

import {
  createDiscoveryCommunicationReference,
} from "./discoveryCommunicationReference";

import type {
  DispatchDiscoveryMessageInput,
  EnsuredDiscoveryConversation,
  EnsureDiscoveryConversationInput,
  DiscoveryMessageResult,
  QueueDiscoveryMessageInput,
} from "./discoveryCommunicationTypes";

function assertConversationCompany(
  companyId: string,
  conversationCompanyId: string,
): void {
  if (companyId !== conversationCompanyId) {
    throw new Error(
      "Discovery and communication conversation must belong to the same company.",
    );
  }
}

function assertMessageCompany(
  companyId: string,
  messageCompanyId: string,
): void {
  if (companyId !== messageCompanyId) {
    throw new Error(
      "Discovery and communication message must belong to the same company.",
    );
  }
}

export class DiscoveryCommunicationWorkflow {
  constructor(
    private readonly orchestrator:
      SalesCommunicationOrchestrator,
  ) {}

  async ensureConversation(
    input: EnsureDiscoveryConversationInput,
  ): Promise<EnsuredDiscoveryConversation> {
    const entity =
      createDiscoveryCommunicationReference(input);

    assertConversationCompany(
      entity.companyId,
      input.conversation.companyId,
    );

    return this.orchestrator.ensureConversation({
      entity,
      conversation: {
        ...input.conversation,
        companyId: entity.companyId,
        externalReferenceId:
          entity.externalReferenceId,
      },
      authorization: input.authorization,
    });
  }

  async queueMessage(
    input: QueueDiscoveryMessageInput,
  ): Promise<DiscoveryMessageResult> {
    const entity =
      createDiscoveryCommunicationReference(input);

    assertConversationCompany(
      entity.companyId,
      input.conversation.companyId,
    );

    assertMessageCompany(
      entity.companyId,
      input.message.companyId,
    );

    return this.orchestrator.queueMessage({
      entity,
      conversation: {
        ...input.conversation,
        companyId: entity.companyId,
        externalReferenceId:
          entity.externalReferenceId,
      },
      message: {
        ...input.message,
        companyId: entity.companyId,
      },
      authorization: input.authorization,
    });
  }

  async dispatchMessage(
    input: DispatchDiscoveryMessageInput,
  ): Promise<DiscoveryMessageResult> {
    const entity =
      createDiscoveryCommunicationReference(input);

    assertConversationCompany(
      entity.companyId,
      input.conversation.companyId,
    );

    assertMessageCompany(
      entity.companyId,
      input.message.companyId,
    );

    return this.orchestrator.dispatchMessage({
      entity,
      conversation: {
        ...input.conversation,
        companyId: entity.companyId,
        externalReferenceId:
          entity.externalReferenceId,
      },
      message: {
        ...input.message,
        companyId: entity.companyId,
      },
      adapter: input.adapter,
      authorization: input.authorization,
    });
  }
}
