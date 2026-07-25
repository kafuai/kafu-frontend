import {
  SalesCommunicationOrchestrator,
} from "../salesCommunicationOrchestrator";

import {
  createLeadCommunicationReference,
} from "./leadCommunicationReference";

import type {
  DispatchLeadMessageInput,
  EnsuredLeadConversation,
  EnsureLeadConversationInput,
  LeadMessageResult,
  QueueLeadMessageInput,
} from "./leadCommunicationTypes";

function assertConversationCompany(
  companyId: string,
  conversationCompanyId: string,
): void {
  if (companyId !== conversationCompanyId) {
    throw new Error(
      "Lead and communication conversation must belong to the same company.",
    );
  }
}

function assertMessageCompany(
  companyId: string,
  messageCompanyId: string,
): void {
  if (companyId !== messageCompanyId) {
    throw new Error(
      "Lead and communication message must belong to the same company.",
    );
  }
}

export class LeadCommunicationWorkflow {
  constructor(
    private readonly orchestrator:
      SalesCommunicationOrchestrator,
  ) {}

  async ensureConversation(
    input: EnsureLeadConversationInput,
  ): Promise<EnsuredLeadConversation> {
    const entity =
      createLeadCommunicationReference(input);

    assertConversationCompany(
      entity.companyId,
      input.conversation.companyId,
    );

    const ensured =
      await this.orchestrator.ensureConversation({
        entity,
        conversation: {
          ...input.conversation,
          companyId: entity.companyId,
          externalReferenceId:
            entity.externalReferenceId,
        },
        authorization: input.authorization,
      });

    return ensured;
  }

  async queueMessage(
    input: QueueLeadMessageInput,
  ): Promise<LeadMessageResult> {
    const entity =
      createLeadCommunicationReference(input);

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
    input: DispatchLeadMessageInput,
  ): Promise<LeadMessageResult> {
    const entity =
      createLeadCommunicationReference(input);

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
