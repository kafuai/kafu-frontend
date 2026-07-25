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

export interface DiscoveryCommunicationIdentity {
  readonly companyId: string;
  readonly discoveryId: string;
}

export interface EnsureDiscoveryConversationInput
  extends DiscoveryCommunicationIdentity {
  readonly conversation:
    CommunicationCreateConversationInput;
  readonly authorization:
    CommunicationAuthorization;
}

export interface QueueDiscoveryMessageInput
  extends EnsureDiscoveryConversationInput {
  readonly message:
    CommunicationCreateMessageInput;
}

export interface DispatchDiscoveryMessageInput
  extends QueueDiscoveryMessageInput {
  readonly adapter:
    CommunicationChannelAdapter;
}

export interface EnsuredDiscoveryConversation {
  readonly conversation:
    CommunicationConversation;
  readonly link:
    SalesCommunicationConversationLink;
  readonly created: boolean;
}

export type DiscoveryMessageResult =
  SalesCommunicationResult<CommunicationMessage>;
