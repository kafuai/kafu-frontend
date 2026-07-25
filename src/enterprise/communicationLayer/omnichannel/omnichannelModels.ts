import type {
  CommunicationChannel,
  CommunicationConversation,
  CommunicationMessage,
} from "../communicationTypes";

import type {
  CommunicationChannelAdapter,
  CommunicationSendContext,
  CommunicationSendResult,
} from "../communicationChannelAdapter";

export type OmnichannelCapability =
  | "text"
  | "html"
  | "attachments"
  | "audio"
  | "images"
  | "documents"
  | "templates"
  | "interactive"
  | "delivery_receipts"
  | "read_receipts"
  | "typing_indicators"
  | "reactions"
  | "threading"
  | "inbound"
  | "outbound"
  | "ai_generated";

export type OmnichannelProviderStatus =
  | "healthy"
  | "degraded"
  | "unavailable"
  | "disabled";

export type OmnichannelDeliveryPriority =
  | "low"
  | "normal"
  | "high"
  | "urgent"
  | "critical";

export type OmnichannelDeliveryMode =
  | "primary"
  | "fallback"
  | "broadcast";

export interface OmnichannelRetryPolicy {
  readonly maximumAttempts: number;
  readonly initialDelayMs: number;
  readonly maximumDelayMs: number;
  readonly backoffMultiplier: number;
  readonly retryableErrorCodes?: readonly string[];
}

export interface OmnichannelProviderDescriptor {
  readonly id: string;
  readonly channel: CommunicationChannel;
  readonly displayName: string;
  readonly capabilities: readonly OmnichannelCapability[];
  readonly priority: number;
  readonly status: OmnichannelProviderStatus;
  readonly regions?: readonly string[];
  readonly tenantIds?: readonly string[];
  readonly organizationIds?: readonly string[];
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface OmnichannelProvider {
  readonly descriptor: OmnichannelProviderDescriptor;
  readonly adapter: CommunicationChannelAdapter;
}

export interface OmnichannelRouteContext {
  readonly companyId: string;
  readonly tenantId: string;
  readonly organizationId: string;
  readonly conversation: CommunicationConversation;
  readonly message: CommunicationMessage;
  readonly sendContext: CommunicationSendContext;
  readonly requiredCapabilities?: readonly OmnichannelCapability[];
  readonly preferredProviderId?: string;
  readonly excludedProviderIds?: readonly string[];
  readonly priority?: OmnichannelDeliveryPriority;
  readonly mode?: OmnichannelDeliveryMode;
  readonly region?: string;
}

export interface OmnichannelProviderSelection {
  readonly provider: OmnichannelProvider;
  readonly score: number;
  readonly reasons: readonly string[];
}

export interface OmnichannelRoutePlan {
  readonly id: string;
  readonly channel: CommunicationChannel;
  readonly mode: OmnichannelDeliveryMode;
  readonly priority: OmnichannelDeliveryPriority;
  readonly providers: readonly OmnichannelProviderSelection[];
  readonly retryPolicy: OmnichannelRetryPolicy;
  readonly createdAt: string;
}

export interface OmnichannelDeliveryAttempt {
  readonly attempt: number;
  readonly providerId: string;
  readonly startedAt: string;
  readonly completedAt: string;
  readonly result?: CommunicationSendResult;
  readonly error?: string;
}

export interface OmnichannelDeliveryResult {
  readonly routePlan: OmnichannelRoutePlan;
  readonly providerId: string;
  readonly result: CommunicationSendResult;
  readonly attempts: readonly OmnichannelDeliveryAttempt[];
}

export function createDefaultOmnichannelRetryPolicy():
  OmnichannelRetryPolicy {
  return {
    maximumAttempts: 3,
    initialDelayMs: 500,
    maximumDelayMs: 15_000,
    backoffMultiplier: 2,
  };
}

export function validateOmnichannelRetryPolicy(
  policy: OmnichannelRetryPolicy,
): void {
  if (
    !Number.isInteger(policy.maximumAttempts) ||
    policy.maximumAttempts < 1
  ) {
    throw new Error(
      "Omnichannel maximum attempts must be a positive integer.",
    );
  }

  if (
    !Number.isFinite(policy.initialDelayMs) ||
    policy.initialDelayMs < 0
  ) {
    throw new Error(
      "Omnichannel initial retry delay must be non-negative.",
    );
  }

  if (
    !Number.isFinite(policy.maximumDelayMs) ||
    policy.maximumDelayMs < policy.initialDelayMs
  ) {
    throw new Error(
      "Omnichannel maximum retry delay must not be lower than the initial delay.",
    );
  }

  if (
    !Number.isFinite(policy.backoffMultiplier) ||
    policy.backoffMultiplier < 1
  ) {
    throw new Error(
      "Omnichannel retry backoff multiplier must be at least one.",
    );
  }
}
