import type {
  CommunicationChannelAdapter,
  CommunicationSendContext,
} from "../communicationChannelAdapter";

import type {
  CommunicationChannel,
} from "../communicationTypes";

import {
  createDefaultChannelCapabilityRegistry,
  type ChannelCapabilityRegistry,
} from "./channelCapabilityRegistry";

import {
  DefaultOmnichannelDeliveryStrategy,
} from "./deliveryStrategyEngine";

import {
  InMemoryOmnichannelDeliveryAnalyticsRepository,
  type OmnichannelDeliveryAnalyticsRepository,
  type OmnichannelDeliveryAnalyticsSummary,
} from "./deliveryAnalytics";

import {
  OmnichannelDeliveryExecutor,
} from "./omnichannelDeliveryExecutor";

import {
  createOmnichannelProvider,
} from "./omnichannelProviderFactory";

import {
  OmnichannelProviderRegistry,
} from "./omnichannelProviderRegistry";

import {
  createOmnichannelResilienceComponents,
  type OmnichannelResilienceComponents,
  type OmnichannelResilienceOptions,
} from "./omnichannelResilienceFactory";

import {
  OmnichannelRouter,
} from "./omnichannelRouter";

import {
  DefaultOmnichannelRetryPolicyResolver,
  OmnichannelRetryPolicyEngine,
} from "./retryPolicyEngine";

import type {
  OmnichannelCapability,
  OmnichannelDeliveryPriority,
  OmnichannelDeliveryResult,
  OmnichannelProviderStatus,
  OmnichannelRetryPolicy,
  OmnichannelRouteContext,
} from "./omnichannelModels";

export interface RegisterOmnichannelProviderInput {
  readonly id: string;
  readonly displayName: string;
  readonly adapter: CommunicationChannelAdapter;
  readonly capabilities?:
    readonly OmnichannelCapability[];
  readonly priority?: number;
  readonly regions?: readonly string[];
  readonly tenantIds?: readonly string[];
  readonly organizationIds?: readonly string[];
  readonly metadata?:
    Readonly<Record<string, unknown>>;
}

export interface SendOmnichannelMessageInput {
  readonly companyId: string;
  readonly tenantId?: string;
  readonly organizationId?: string;
  readonly sendContext:
    CommunicationSendContext;
  readonly requiredCapabilities?:
    readonly OmnichannelCapability[];
  readonly preferredProviderId?: string;
  readonly excludedProviderIds?:
    readonly string[];
  readonly priority?:
    OmnichannelDeliveryPriority;
  readonly region?: string;
}

export interface OmnichannelRuntimeOptions {
  readonly capabilityRegistry?:
    ChannelCapabilityRegistry;
  readonly providerRegistry?:
    OmnichannelProviderRegistry;
  readonly retryPolicy?:
    OmnichannelRetryPolicy;
  readonly providerRetryPolicies?:
    Readonly<
      Record<
        string,
        OmnichannelRetryPolicy
      >
    >;
  readonly resilience?:
    OmnichannelResilienceOptions;
  readonly analyticsRepository?:
    OmnichannelDeliveryAnalyticsRepository;
}

export class OmnichannelRuntime {
  readonly capabilities:
    ChannelCapabilityRegistry;

  readonly providers:
    OmnichannelProviderRegistry;

  readonly resilience:
    OmnichannelResilienceComponents;

  readonly analytics:
    OmnichannelDeliveryAnalyticsRepository;

  private readonly executor:
    OmnichannelDeliveryExecutor;

  constructor(
    options: OmnichannelRuntimeOptions = {},
  ) {
    this.capabilities =
      options.capabilityRegistry ??
      createDefaultChannelCapabilityRegistry();

    this.providers =
      options.providerRegistry ??
      new OmnichannelProviderRegistry();

    this.resilience =
      createOmnichannelResilienceComponents(
        options.resilience,
      );

    this.analytics =
      options.analyticsRepository ??
      new InMemoryOmnichannelDeliveryAnalyticsRepository();

    const strategy =
      new DefaultOmnichannelDeliveryStrategy(
        this.providers,
      );

    const retryResolver =
      new DefaultOmnichannelRetryPolicyResolver(
        options.retryPolicy,
        options.providerRetryPolicies,
      );

    const router =
      new OmnichannelRouter(
        strategy,
        retryResolver,
      );

    this.executor =
      new OmnichannelDeliveryExecutor({
        router,
        retryEngine:
          new OmnichannelRetryPolicyEngine(),
        circuitBreaker:
          this.resilience.circuitBreaker,
        rateLimiter:
          this.resilience.rateLimiter,
        healthMonitor:
          this.resilience.healthMonitor,
        deadLetterRepository:
          this.resilience.deadLetterRepository,
      });
  }

  registerProvider(
    input: RegisterOmnichannelProviderInput,
  ): void {
    const capabilities =
      input.capabilities ??
      this.capabilities.get(
        input.adapter.channel,
      );

    if (capabilities.length === 0) {
      throw new Error(
        `No capabilities are registered for channel "${input.adapter.channel}".`,
      );
    }

    this.providers.register(
      createOmnichannelProvider({
        ...input,
        capabilities,
      }),
    );
  }

  unregisterProvider(
    providerId: string,
  ): void {
    this.providers.unregister(providerId);
  }

  supportsChannel(
    channel: CommunicationChannel,
  ): boolean {
    return (
      this.providers.list({
        channel,
      }).length > 0
    );
  }

  setProviderStatus(
    providerId: string,
    status: OmnichannelProviderStatus,
  ): void {
    this.providers.updateStatus(
      providerId,
      status,
    );

    this.resilience.healthMonitor.setStatus(
      providerId,
      status,
    );
  }

  async send(
    input: SendOmnichannelMessageInput,
  ): Promise<OmnichannelDeliveryResult> {
    const startedAt = Date.now();

    const context:
      OmnichannelRouteContext = {
        companyId: input.companyId,
        tenantId:
          input.tenantId ??
          input.companyId,
        organizationId:
          input.organizationId ??
          input.companyId,
        conversation:
          input.sendContext.conversation,
        message:
          input.sendContext.message,
        sendContext:
          input.sendContext,
        requiredCapabilities:
          input.requiredCapabilities,
        preferredProviderId:
          input.preferredProviderId,
        excludedProviderIds:
          input.excludedProviderIds,
        priority:
          input.priority ?? "normal",
        mode: "fallback",
        region: input.region,
      };

    try {
      const result =
        await this.executor.execute(
          context,
        );

      await this.analytics.record({
        id: this.createId("analytics"),
        companyId: context.companyId,
        tenantId: context.tenantId,
        organizationId:
          context.organizationId,
        conversationId:
          context.conversation.id,
        messageId: context.message.id,
        channel:
          context.conversation.channel,
        providerId: result.providerId,
        priority:
          context.priority ?? "normal",
        outcome: "succeeded",
        attempts: result.attempts,
        durationMs:
          Date.now() - startedAt,
        recordedAt:
          new Date().toISOString(),
      });

      return result;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown omnichannel runtime error.";

      await this.analytics.record({
        id: this.createId("analytics"),
        companyId: context.companyId,
        tenantId: context.tenantId,
        organizationId:
          context.organizationId,
        conversationId:
          context.conversation.id,
        messageId: context.message.id,
        channel:
          context.conversation.channel,
        priority:
          context.priority ?? "normal",
        outcome: "failed",
        attempts: [],
        durationMs:
          Date.now() - startedAt,
        recordedAt:
          new Date().toISOString(),
        error: message,
      });

      throw error;
    }
  }

  async getAnalyticsSummary():
    Promise<OmnichannelDeliveryAnalyticsSummary> {
    return this.analytics.summarize();
  }

  private createId(
    prefix: string,
  ): string {
    return (
      globalThis.crypto?.randomUUID?.() ??
      `${prefix}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`
    );
  }
}

export function createOmnichannelRuntime(
  options: OmnichannelRuntimeOptions = {},
): OmnichannelRuntime {
  return new OmnichannelRuntime(options);
}

export const omnichannelRuntime =
  createOmnichannelRuntime();
