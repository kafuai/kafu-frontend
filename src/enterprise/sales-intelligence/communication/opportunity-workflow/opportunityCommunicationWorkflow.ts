import {
  SalesCommunicationOrchestrator,
} from "../salesCommunicationOrchestrator";

import {
  createOpportunityCommunicationReference,
} from "./opportunityCommunicationReference";

import type {
  DispatchOpportunityMessageInput,
  EnsuredOpportunityConversation,
  EnsureOpportunityConversationInput,
  OpportunityMessageResult,
  QueueOpportunityMessageInput,
} from "./opportunityCommunicationTypes";

function assertConversationCompany(
  companyId: string,
  conversationCompanyId: string,
): void {
  if (companyId !== conversationCompanyId) {
    throw new Error(
      "Opportunity and communication conversation must belong to the same company.",
    );
  }
}

function assertMessageCompany(
  companyId: string,
  messageCompanyId: string,
): void {
  if (companyId !== messageCompanyId) {
    throw new Error(
      "Opportunity and communication message must belong to the same company.",
    );
  }
}

export class OpportunityCommunicationWorkflow {
  constructor(
    private readonly orchestrator:
      SalesCommunicationOrchestrator,
  ) {}

  async ensureConversation(
    input: EnsureOpportunityConversationInput,
  ): Promise<EnsuredOpportunityConversation> {
    const entity =
      createOpportunityCommunicationReference(input);

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
    input: QueueOpportunityMessageInput,
  ): Promise<OpportunityMessageResult> {
    const entity =
      createOpportunityCommunicationReference(input);

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
    input: DispatchOpportunityMessageInput,
  ): Promise<OpportunityMessageResult> {
    const entity =
      createOpportunityCommunicationReference(input);

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
