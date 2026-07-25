import type {
  CommunicationConversation,
  CommunicationMessage,
} from "../../../communicationLayer/communicationTypes";

import type {
  CommunicationChannelAdapter,
} from "../../../communicationLayer/communicationChannelAdapter";

import type {
  CommunicationAuthorization,
  CommunicationCreateConversationInput,
  CommunicationCreateMessageInput,
  SalesCommunicationConversationLink,
  SalesCommunicationResult,
} from "../salesCommunicationTypes";

export interface OpportunityCommunicationIdentity {
  readonly companyId: string;
  readonly opportunityId: string;
}

export interface EnsureOpportunityConversationInput
  extends OpportunityCommunicationIdentity {
  readonly conversation:
    CommunicationCreateConversationInput;
  readonly authorization:
    CommunicationAuthorization;
}

export interface QueueOpportunityMessageInput
  extends EnsureOpportunityConversationInput {
  readonly message:
    CommunicationCreateMessageInput;
}

export interface DispatchOpportunityMessageInput
  extends QueueOpportunityMessageInput {
  readonly adapter:
    CommunicationChannelAdapter;
}

export interface EnsuredOpportunityConversation {
  readonly conversation:
    CommunicationConversation;
  readonly link:
    SalesCommunicationConversationLink;
  readonly created: boolean;
}

export type OpportunityMessageResult =
  SalesCommunicationResult<CommunicationMessage>;
