import type {
  OmnichannelDeadLetterRepository,
} from "./deadLetterQueue";

import type {
  OmnichannelCircuitBreaker,
} from "./circuitBreaker";

import type {
  OmnichannelProviderHealthMonitor,
} from "./providerHealthMonitor";

import type {
  OmnichannelRateLimiter,
} from "./rateLimiter";

import type {
  OmnichannelRetryPolicyEngine,
} from "./retryPolicyEngine";

import type {
  OmnichannelRouter,
} from "./omnichannelRouter";

import type {
  OmnichannelDeliveryAttempt,
  OmnichannelDeliveryResult,
  OmnichannelRouteContext,
} from "./omnichannelModels";

export interface OmnichannelDeliveryExecutorDependencies {
  readonly router: OmnichannelRouter;
  readonly retryEngine:
    OmnichannelRetryPolicyEngine;
  readonly circuitBreaker:
    OmnichannelCircuitBreaker;
  readonly rateLimiter:
    OmnichannelRateLimiter;
  readonly healthMonitor:
    OmnichannelProviderHealthMonitor;
  readonly deadLetterRepository:
    OmnichannelDeadLetterRepository;
}

export class OmnichannelDeliveryExecutor {
  constructor(
    private readonly dependencies:
      OmnichannelDeliveryExecutorDependencies,
  ) {}

  async execute(
    context: OmnichannelRouteContext,
  ): Promise<OmnichannelDeliveryResult> {
    const routePlan =
      this.dependencies.router.createRoutePlan(
        context,
      );

    const attempts:
      OmnichannelDeliveryAttempt[] = [];

    for (
      const selection of routePlan.providers
    ) {
      const provider =
        selection.provider;
      const providerId =
        provider.descriptor.id;

      if (
        !this.dependencies.circuitBreaker.canExecute(
          providerId,
        )
      ) {
        continue;
      }

      const policy =
        routePlan.retryPolicy;

      let completedAttempts = 0;

      while (
        completedAttempts <
        policy.maximumAttempts
      ) {
        completedAttempts += 1;

        const startedAt =
          new Date().toISOString();

        try {
          this.dependencies.rateLimiter.consume(
            providerId,
          );

          provider.adapter.validateConversation(
            context.conversation,
          );

          const result =
            await provider.adapter.send(
              context.sendContext,
            );

          const completedAt =
            new Date().toISOString();

          attempts.push({
            attempt: completedAttempts,
            providerId,
            startedAt,
            completedAt,
            result,
          });

          this.dependencies.circuitBreaker.recordSuccess(
            providerId,
          );

          this.dependencies.healthMonitor.recordSuccess(
            providerId,
          );

          return {
            routePlan,
            providerId,
            result,
            attempts,
          };
        } catch (error) {
          const completedAt =
            new Date().toISOString();

          const message =
            error instanceof Error
              ? error.message
              : "Unknown omnichannel delivery error.";

          attempts.push({
            attempt: completedAttempts,
            providerId,
            startedAt,
            completedAt,
            error: message,
          });

          this.dependencies.circuitBreaker.recordFailure(
            providerId,
          );

          this.dependencies.healthMonitor.recordFailure(
            providerId,
          );

          const decision =
            this.dependencies.retryEngine.decide(
              policy,
              completedAttempts,
            );

          if (!decision.retry) {
            break;
          }

          await this.delay(
            decision.delayMs,
          );
        }
      }

      if (routePlan.mode === "primary") {
        break;
      }
    }

    const deadLetterId =
      globalThis.crypto?.randomUUID?.() ??
      `dead-letter-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`;

    await this.dependencies.deadLetterRepository.add({
      id: deadLetterId,
      context,
      routePlan,
      attempts,
      reason:
        "All omnichannel delivery providers failed.",
      failedAt: new Date().toISOString(),
    });

    throw new Error(
      `Omnichannel delivery failed and was moved to the dead letter queue: ${deadLetterId}`,
    );
  }

  private async delay(
    milliseconds: number,
  ): Promise<void> {
    if (milliseconds <= 0) {
      return;
    }

    await new Promise<void>((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }
}
