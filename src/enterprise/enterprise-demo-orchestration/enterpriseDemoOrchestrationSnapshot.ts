import {
  EnterpriseDemoOrchestrationPlan,
  EnterpriseDemoOrchestrationStep,
} from "./enterpriseDemoOrchestrationTypes";

export interface EnterpriseDemoOrchestrationSnapshot {
  orchestrationId: string;
  organizationId: string;
  demoSessionId: string;
  scenarioId: string;
  status: EnterpriseDemoOrchestrationPlan["status"];
  currentStepId?: string | null;
  steps: EnterpriseDemoOrchestrationStep[];
  progressPercentage: number;
  capturedAt: string;
}

export function createEnterpriseDemoOrchestrationSnapshot(
  plan: EnterpriseDemoOrchestrationPlan,
  progressPercentage: number,
): EnterpriseDemoOrchestrationSnapshot {
  return {
    orchestrationId: plan.id,
    organizationId: plan.organizationId,
    demoSessionId: plan.demoSessionId,
    scenarioId: plan.scenarioId,
    status: plan.status,
    currentStepId: plan.currentStepId,
    steps: plan.steps.map((step) => ({ ...step })),
    progressPercentage,
    capturedAt: new Date().toISOString(),
  };
}
