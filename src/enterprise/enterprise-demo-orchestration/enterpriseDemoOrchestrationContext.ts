import {
  EnterpriseDemoOrchestrationInput,
  EnterpriseDemoOrchestrationPlan,
  EnterpriseDemoOrchestrationStatus,
} from "./enterpriseDemoOrchestrationTypes";

export interface EnterpriseDemoOrchestrationContext {
  orchestrationId: string;
  input: EnterpriseDemoOrchestrationInput;
  plan: EnterpriseDemoOrchestrationPlan;
  status: EnterpriseDemoOrchestrationStatus;
  startedAt?: string | null;
  completedAt?: string | null;
  failureReason?: string | null;
}

export function createEnterpriseDemoOrchestrationContext(
  input: EnterpriseDemoOrchestrationInput,
  plan: EnterpriseDemoOrchestrationPlan,
): EnterpriseDemoOrchestrationContext {
  return {
    orchestrationId: plan.id,
    input,
    plan,
    status: plan.status,
    startedAt: null,
    completedAt: null,
    failureReason: null,
  };
}
