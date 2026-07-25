import {
  createDefaultOmnichannelRetryPolicy,
  type OmnichannelRouteContext,
  type OmnichannelRoutePlan,
} from "./omnichannelModels";

import type {
  OmnichannelDeliveryStrategy,
} from "./deliveryStrategyEngine";

import type {
  OmnichannelRetryPolicyResolver,
} from "./retryPolicyEngine";

export class OmnichannelRouter {
  constructor(
    private readonly strategy:
      OmnichannelDeliveryStrategy,
    private readonly retryPolicies:
      OmnichannelRetryPolicyResolver,
  ) {}

  createRoutePlan(
    context: OmnichannelRouteContext,
  ): OmnichannelRoutePlan {
    const providers =
      this.strategy.select(context);

    const primaryProvider =
      providers[0]?.provider;

    if (!primaryProvider) {
      throw new Error(
        "Omnichannel route plan requires at least one provider.",
      );
    }

    const retryPolicy =
      this.retryPolicies.resolve(
        primaryProvider.descriptor.id,
      ) ??
      createDefaultOmnichannelRetryPolicy();

    return {
      id: this.createRouteId(),
      channel: context.conversation.channel,
      mode: context.mode ?? "fallback",
      priority: context.priority ?? "normal",
      providers:
        context.mode === "primary"
          ? providers.slice(0, 1)
          : providers,
      retryPolicy,
      createdAt: new Date().toISOString(),
    };
  }

  private createRouteId(): string {
    return (
      globalThis.crypto?.randomUUID?.() ??
      `route-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`
    );
  }
}
