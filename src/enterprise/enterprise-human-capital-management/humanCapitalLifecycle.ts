export interface HumanCapitalLifecycle {
  organizationId: string;
  stages: string[];
  currentStage: string;
}

export function isLifecycleConfigured(
  lifecycle: HumanCapitalLifecycle
): boolean {
  return lifecycle.stages.length > 0;
}

export function moveLifecycleStage(
  lifecycle: HumanCapitalLifecycle,
  stage: string
): HumanCapitalLifecycle {
  return {
    ...lifecycle,
    currentStage: stage,
  };
}
