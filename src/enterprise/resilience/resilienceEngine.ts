import {
  ResilienceExecutionContext,
  ResilienceExecutionResult,
  ResiliencePolicy,
} from "./resilienceTypes";
import { executeWithRetry, RetryOperation } from "./resilienceRetry";
import {
  FailoverTarget,
  selectFailoverTarget,
  createFailoverContext,
} from "./resilienceFailover";
import {
  SelfHealingAction,
  executeSelfHealing,
} from "./resilienceSelfHealing";

export type ResilienceEngineOptions<T> = {
  policy: ResiliencePolicy;
  context: Omit<ResilienceExecutionContext, "attempt">;
  operation: RetryOperation<T>;
  failoverTargets?: FailoverTarget[];
  selfHealingActions?: SelfHealingAction[];
};

export async function executeResilientOperation<T>(
  options: ResilienceEngineOptions<T>,
): Promise<ResilienceExecutionResult<T>> {
  let result = await executeWithRetry(
    options.policy,
    options.context,
    options.operation,
  );

  if (result.success) {
    return result;
  }

  const failoverTarget = selectFailoverTarget(options.failoverTargets ?? []);

  if (failoverTarget) {
    const failoverContext = createFailoverContext(
      {
        ...options.context,
        attempt: result.attempts + 1,
      },
      failoverTarget,
    );

    result = await executeWithRetry(
      options.policy,
      failoverContext,
      options.operation,
    );

    if (result.success) {
      return {
        ...result,
        recovered: true,
        status: "recovering",
      };
    }
  }

  if (options.selfHealingActions?.length) {
    await executeSelfHealing(
      {
        ...options.context,
        attempt: result.attempts,
      },
      options.selfHealingActions,
    );
  }

  return result;
}