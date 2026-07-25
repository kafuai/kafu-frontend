import type {
  CommunicationChannelAdapter,
} from "../communicationChannelAdapter";

import type {
  OmnichannelCapability,
  OmnichannelProvider,
  OmnichannelProviderDescriptor,
} from "./omnichannelModels";

export interface CreateOmnichannelProviderInput {
  readonly id: string;
  readonly displayName: string;
  readonly adapter: CommunicationChannelAdapter;
  readonly capabilities:
    readonly OmnichannelCapability[];
  readonly priority?: number;
  readonly regions?: readonly string[];
  readonly tenantIds?: readonly string[];
  readonly organizationIds?: readonly string[];
  readonly metadata?:
    Readonly<Record<string, unknown>>;
}

export function createOmnichannelProvider(
  input: CreateOmnichannelProviderInput,
): OmnichannelProvider {
  const descriptor:
    OmnichannelProviderDescriptor = {
      id: input.id,
      channel: input.adapter.channel,
      displayName: input.displayName,
      capabilities: input.capabilities,
      priority: input.priority ?? 100,
      status: "healthy",
      regions: input.regions,
      tenantIds: input.tenantIds,
      organizationIds:
        input.organizationIds,
      metadata: input.metadata,
    };

  return {
    descriptor,
    adapter: input.adapter,
  };
}
