export interface AIOrchestrationHealthState {
  readonly executionId: string;
  readonly healthy: boolean;
  readonly issues: string[];
  readonly checkedAt: Date;
}

export function evaluateAIOrchestrationHealth(
  executionId: string,
  issues: string[],
): AIOrchestrationHealthState {
  return {
    executionId,
    healthy: issues.length === 0,
    issues,
    checkedAt: new Date(),
  };
}