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

export interface LeadCommunicationIdentity {
  readonly companyId: string;
  readonly leadId: string;
}

export interface EnsureLeadConversationInput
  extends LeadCommunicationIdentity {
  readonly conversation:
    CommunicationCreateConversationInput;
  readonly authorization:
    CommunicationAuthorization;
}

export interface QueueLeadMessageInput
  extends EnsureLeadConversationInput {
  readonly message:
    CommunicationCreateMessageInput;
}

export interface DispatchLeadMessageInput
  extends QueueLeadMessageInput {
  readonly adapter:
    CommunicationChannelAdapter;
}

export interface EnsuredLeadConversation {
  readonly conversation:
    CommunicationConversation;
  readonly link:
    SalesCommunicationConversationLink;
  readonly created: boolean;
}

export type LeadMessageResult =
  SalesCommunicationResult<CommunicationMessage>;
