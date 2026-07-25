import {
  OmnichannelCircuitBreaker,
  type OmnichannelCircuitBreakerPolicy,
} from "./circuitBreaker";

import {
  InMemoryOmnichannelDeadLetterRepository,
  type OmnichannelDeadLetterRepository,
} from "./deadLetterQueue";

import {
  OmnichannelProviderHealthMonitor,
  type OmnichannelProviderHealthPolicy,
} from "./providerHealthMonitor";

import {
  OmnichannelRateLimiter,
  type OmnichannelRateLimitPolicy,
} from "./rateLimiter";

export interface OmnichannelResilienceOptions {
  readonly circuitBreakerPolicy?:
    OmnichannelCircuitBreakerPolicy;
  readonly providerHealthPolicy?:
    OmnichannelProviderHealthPolicy;
  readonly defaultRateLimitPolicy?:
    OmnichannelRateLimitPolicy;
  readonly providerRateLimitPolicies?:
    Readonly<Record<string, OmnichannelRateLimitPolicy>>;
  readonly deadLetterRepository?:
    OmnichannelDeadLetterRepository;
}

export interface OmnichannelResilienceComponents {
  readonly circuitBreaker:
    OmnichannelCircuitBreaker;
  readonly healthMonitor:
    OmnichannelProviderHealthMonitor;
  readonly rateLimiter:
    OmnichannelRateLimiter;
  readonly deadLetterRepository:
    OmnichannelDeadLetterRepository;
}

export function createOmnichannelResilienceComponents(
  options: OmnichannelResilienceOptions = {},
): OmnichannelResilienceComponents {
  return {
    circuitBreaker:
      new OmnichannelCircuitBreaker(
        options.circuitBreakerPolicy,
      ),
    healthMonitor:
      new OmnichannelProviderHealthMonitor(
        options.providerHealthPolicy,
      ),
    rateLimiter:
      new OmnichannelRateLimiter(
        options.defaultRateLimitPolicy,
        options.providerRateLimitPolicies,
      ),
    deadLetterRepository:
      options.deadLetterRepository ??
      new InMemoryOmnichannelDeadLetterRepository(),
  };
}
