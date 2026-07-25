import type {
  CommunicationConversation,
} from "../../communicationLayer/communicationTypes";

import type {
  CommunicationRepository,
} from "../../communicationLayer/communicationRepository";

import type {
  SalesCommunicationConversationLink,
  SalesCommunicationEntityReference,
} from "./salesCommunicationTypes";

function readExternalReferenceId(
  conversation: CommunicationConversation,
): string | undefined {
  if (
    "externalReferenceId" in conversation &&
    typeof conversation.externalReferenceId === "string"
  ) {
    return conversation.externalReferenceId;
  }

  return undefined;
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
    externalReferenceId:
      entity.externalReferenceId,
    createdAt: conversation.metadata.createdAt,
  };
}

export interface SalesCommunicationLinkRepository {
  findConversation(
    entity: SalesCommunicationEntityReference,
  ): Promise<CommunicationConversation | null>;

  findLink(
    entity: SalesCommunicationEntityReference,
  ): Promise<SalesCommunicationConversationLink | null>;

  assertConversationAvailable(
    entity: SalesCommunicationEntityReference,
  ): Promise<void>;
}

export class RepositorySalesCommunicationLinkRepository
  implements SalesCommunicationLinkRepository
{
  constructor(
    private readonly communicationRepository:
      CommunicationRepository,
  ) {}

  async findConversation(
    entity: SalesCommunicationEntityReference,
  ): Promise<CommunicationConversation | null> {
    const conversations =
      await this.communicationRepository.listConversations({
        companyId: entity.companyId,
        limit: 200,
      });

    return (
      conversations.find(
        (conversation) =>
          readExternalReferenceId(conversation) ===
          entity.externalReferenceId,
      ) ?? null
    );
  }

  async findLink(
    entity: SalesCommunicationEntityReference,
  ): Promise<SalesCommunicationConversationLink | null> {
    const conversation =
      await this.findConversation(entity);

    return conversation
      ? toConversationLink(entity, conversation)
      : null;
  }

  async assertConversationAvailable(
    entity: SalesCommunicationEntityReference,
  ): Promise<void> {
    const existing =
      await this.findConversation(entity);

    if (existing) {
      throw new Error(
        `A communication conversation already exists for ${entity.entityType}:${entity.entityId}.`,
      );
    }
  }
}
