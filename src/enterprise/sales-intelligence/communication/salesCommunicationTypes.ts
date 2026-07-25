import type {
  CommunicationConversation,
  CommunicationMessage,
} from "../../communicationLayer/communicationTypes";

import type {
  AuthorizedCommunicationRequest,
  CommunicationApplicationService,
} from "../../communicationLayer/application/communicationApplicationService";

export type SalesCommunicationEntityType =
  | "lead"
  | "opportunity"
  | "account"
  | "contact"
  | "discovery"
  | "executive_summary";

export type SalesCommunicationOperation =
  | "conversation_created"
  | "message_queued"
  | "message_dispatched"
  | "conversation_loaded";

export interface SalesCommunicationEntityReference {
  readonly companyId: string;
  readonly entityType: SalesCommunicationEntityType;
  readonly entityId: string;
  readonly externalReferenceId: string;
}

export interface SalesCommunicationContext {
  readonly companyId: string;
  readonly actorId: string;
  readonly tenantId?: string;
  readonly organizationId?: string;
  readonly source: "sales-intelligence";
  readonly correlationId?: string;
}

export interface SalesCommunicationConversationLink {
  readonly companyId: string;
  readonly entityType: SalesCommunicationEntityType;
  readonly entityId: string;
  readonly conversationId: string;
  readonly externalReferenceId: string;
  readonly createdAt: string;
}

export interface SalesCommunicationResult<
  TValue extends CommunicationConversation | CommunicationMessage,
> {
  readonly operation: SalesCommunicationOperation;
  readonly entity: SalesCommunicationEntityReference;
  readonly value: TValue;
  readonly conversationId: string;
}

export type CommunicationCreateConversationInput =
  Parameters<
    CommunicationApplicationService["createAuthorizedConversation"]
  >[0];

export type CommunicationCreateMessageInput =
  Parameters<
    CommunicationApplicationService["createAuthorizedQueuedMessage"]
  >[0];

export type CommunicationAuthorization =
  AuthorizedCommunicationRequest;
