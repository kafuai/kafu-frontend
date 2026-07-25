import type {
  CommunicationChannel,
} from "../communicationTypes";

import type {
  OmnichannelCapability,
  OmnichannelProvider,
  OmnichannelProviderDescriptor,
  OmnichannelProviderStatus,
} from "./omnichannelModels";

export interface OmnichannelProviderQuery {
  readonly channel?: CommunicationChannel;
  readonly status?: OmnichannelProviderStatus;
  readonly requiredCapabilities?: readonly OmnichannelCapability[];
  readonly tenantId?: string;
  readonly organizationId?: string;
  readonly region?: string;
}

export class OmnichannelProviderRegistry {
  private readonly providers =
    new Map<string, OmnichannelProvider>();

  register(
    provider: OmnichannelProvider,
  ): void {
    this.validateDescriptor(provider.descriptor);

    if (
      provider.adapter.channel !==
      provider.descriptor.channel
    ) {
      throw new Error(
        `Provider "${provider.descriptor.id}" adapter channel does not match its descriptor.`,
      );
    }

    this.providers.set(
      provider.descriptor.id,
      provider,
    );
  }

  unregister(
    providerId: string,
  ): void {
    this.providers.delete(providerId);
  }

  get(
    providerId: string,
  ): OmnichannelProvider {
    const provider =
      this.providers.get(providerId);

    if (!provider) {
      throw new Error(
        `Omnichannel provider was not found: ${providerId}`,
      );
    }

    return provider;
  }

  has(
    providerId: string,
  ): boolean {
    return this.providers.has(providerId);
  }

  updateStatus(
    providerId: string,
    status: OmnichannelProviderStatus,
  ): void {
    const provider = this.get(providerId);

    this.providers.set(providerId, {
      ...provider,
      descriptor: {
        ...provider.descriptor,
        status,
      },
    });
  }

  list(
    query: OmnichannelProviderQuery = {},
  ): readonly OmnichannelProvider[] {
    return [...this.providers.values()]
      .filter((provider) =>
        this.matchesQuery(provider, query),
      )
      .sort(
        (left, right) =>
          left.descriptor.priority -
          right.descriptor.priority,
      );
  }

  private matchesQuery(
    provider: OmnichannelProvider,
    query: OmnichannelProviderQuery,
  ): boolean {
    const descriptor = provider.descriptor;

    if (
      query.channel &&
      descriptor.channel !== query.channel
    ) {
      return false;
    }

    if (
      query.status &&
      descriptor.status !== query.status
    ) {
      return false;
    }

    if (
      query.requiredCapabilities &&
      !query.requiredCapabilities.every(
        (capability) =>
          descriptor.capabilities.includes(capability),
      )
    ) {
      return false;
    }

    if (
      query.tenantId &&
      descriptor.tenantIds?.length &&
      !descriptor.tenantIds.includes(query.tenantId)
    ) {
      return false;
    }

    if (
      query.organizationId &&
      descriptor.organizationIds?.length &&
      !descriptor.organizationIds.includes(
        query.organizationId,
      )
    ) {
      return false;
    }

    if (
      query.region &&
      descriptor.regions?.length &&
      !descriptor.regions.includes(query.region)
    ) {
      return false;
    }

    return true;
  }

  private validateDescriptor(
    descriptor: OmnichannelProviderDescriptor,
  ): void {
    if (!descriptor.id.trim()) {
      throw new Error(
        "Omnichannel provider id is required.",
      );
    }

    if (!descriptor.displayName.trim()) {
      throw new Error(
        "Omnichannel provider display name is required.",
      );
    }

    if (
      !Number.isInteger(descriptor.priority) ||
      descriptor.priority < 1
    ) {
      throw new Error(
        "Omnichannel provider priority must be a positive integer.",
      );
    }

    if (descriptor.capabilities.length === 0) {
      throw new Error(
        `Omnichannel provider "${descriptor.id}" requires at least one capability.`,
      );
    }
  }
}
