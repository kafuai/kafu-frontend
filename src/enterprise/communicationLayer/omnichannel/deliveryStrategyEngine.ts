import type {
  OmnichannelProvider,
  OmnichannelProviderSelection,
  OmnichannelRouteContext,
} from "./omnichannelModels";

import type {
  OmnichannelProviderRegistry,
} from "./omnichannelProviderRegistry";

export interface OmnichannelDeliveryStrategy {
  select(
    context: OmnichannelRouteContext,
  ): readonly OmnichannelProviderSelection[];
}

export class DefaultOmnichannelDeliveryStrategy
  implements OmnichannelDeliveryStrategy
{
  constructor(
    private readonly registry:
      OmnichannelProviderRegistry,
  ) {}

  select(
    context: OmnichannelRouteContext,
  ): readonly OmnichannelProviderSelection[] {
    const excluded = new Set(
      context.excludedProviderIds ?? [],
    );

    const providers = this.registry.list({
      channel: context.conversation.channel,
      requiredCapabilities:
        context.requiredCapabilities,
      tenantId: context.tenantId,
      organizationId:
        context.organizationId,
      region: context.region,
    });

    const selections = providers
      .filter(
        (provider) =>
          !excluded.has(provider.descriptor.id) &&
          provider.descriptor.status !== "disabled" &&
          provider.descriptor.status !== "unavailable",
      )
      .map((provider) =>
        this.scoreProvider(provider, context),
      )
      .sort(
        (left, right) =>
          right.score - left.score,
      );

    if (selections.length === 0) {
      throw new Error(
        `No eligible omnichannel provider is available for channel "${context.conversation.channel}".`,
      );
    }

    return selections;
  }

  private scoreProvider(
    provider: OmnichannelProvider,
    context: OmnichannelRouteContext,
  ): OmnichannelProviderSelection {
    let score =
      Math.max(
        0,
        1_000 - provider.descriptor.priority * 10,
      );

    const reasons: string[] = [
      `provider-priority:${provider.descriptor.priority}`,
    ];

    if (
      context.preferredProviderId ===
      provider.descriptor.id
    ) {
      score += 10_000;
      reasons.push("preferred-provider");
    }

    if (
      provider.descriptor.status === "healthy"
    ) {
      score += 500;
      reasons.push("healthy");
    }

    if (
      provider.descriptor.status === "degraded"
    ) {
      score -= 250;
      reasons.push("degraded");
    }

    if (
      context.region &&
      provider.descriptor.regions?.includes(
        context.region,
      )
    ) {
      score += 100;
      reasons.push("regional-match");
    }

    if (
      context.requiredCapabilities?.length
    ) {
      score +=
        context.requiredCapabilities.length * 25;
      reasons.push("capability-match");
    }

    return {
      provider,
      score,
      reasons,
    };
  }
}
