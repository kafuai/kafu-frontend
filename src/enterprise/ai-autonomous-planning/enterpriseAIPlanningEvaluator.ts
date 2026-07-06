import { EnterpriseAIPlan } from "./enterpriseAIPlanningEngineTypes";

export interface EnterprisePlanningEvaluationResult {
  readyForExecution: boolean;
  score: number;
  findings: string[];
}

export function evaluateEnterpriseAIPlan(
  plan: EnterpriseAIPlan
): EnterprisePlanningEvaluationResult {
  const findings: string[] = [];

  if (plan.steps.length === 0) {
    findings.push("No execution steps defined.");
  }

  if (plan.confidenceScore < 0.6) {
    findings.push("Planning confidence is below the recommended threshold.");
  }

  if (plan.risks.length > 5) {
    findings.push("Large number of planning risks detected.");
  }

  const score = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        plan.confidenceScore * 100 -
          Math.max(0, plan.risks.length - 2) * 5
      )
    )
  );

  return {
    readyForExecution: findings.length === 0,
    score,
    findings,
  };
}