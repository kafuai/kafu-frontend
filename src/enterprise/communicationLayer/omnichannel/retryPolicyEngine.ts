import {
  createDefaultOmnichannelRetryPolicy,
  validateOmnichannelRetryPolicy,
  type OmnichannelRetryPolicy,
} from "./omnichannelModels";

export interface OmnichannelRetryDecision {
  readonly retry: boolean;
  readonly delayMs: number;
  readonly nextAttempt: number;
  readonly reason: string;
}

export interface OmnichannelRetryPolicyResolver {
  resolve(
    providerId: string,
  ): OmnichannelRetryPolicy;
}

export class DefaultOmnichannelRetryPolicyResolver
  implements OmnichannelRetryPolicyResolver
{
  constructor(
    private readonly defaultPolicy:
      OmnichannelRetryPolicy =
        createDefaultOmnichannelRetryPolicy(),
    private readonly providerPolicies:
      Readonly<Record<string, OmnichannelRetryPolicy>> = {},
  ) {
    validateOmnichannelRetryPolicy(
      this.defaultPolicy,
    );

    for (
      const policy of
      Object.values(this.providerPolicies)
    ) {
      validateOmnichannelRetryPolicy(policy);
    }
  }

  resolve(
    providerId: string,
  ): OmnichannelRetryPolicy {
    return (
      this.providerPolicies[providerId] ??
      this.defaultPolicy
    );
  }
}

export class OmnichannelRetryPolicyEngine {
  decide(
    policy: OmnichannelRetryPolicy,
    completedAttempts: number,
    errorCode?: string,
  ): OmnichannelRetryDecision {
    validateOmnichannelRetryPolicy(policy);

    const nextAttempt =
      completedAttempts + 1;

    if (
      completedAttempts >=
      policy.maximumAttempts
    ) {
      return {
        retry: false,
        delayMs: 0,
        nextAttempt,
        reason: "maximum-attempts-reached",
      };
    }

    if (
      errorCode &&
      policy.retryableErrorCodes?.length &&
      !policy.retryableErrorCodes.includes(errorCode)
    ) {
      return {
        retry: false,
        delayMs: 0,
        nextAttempt,
        reason: "non-retryable-error",
      };
    }

    const exponent =
      Math.max(0, completedAttempts - 1);

    const delayMs =
      Math.min(
        policy.maximumDelayMs,
        Math.round(
          policy.initialDelayMs *
          Math.pow(
            policy.backoffMultiplier,
            exponent,
          ),
        ),
      );

    return {
      retry: true,
      delayMs,
      nextAttempt,
      reason: "retry-approved",
    };
  }
}
