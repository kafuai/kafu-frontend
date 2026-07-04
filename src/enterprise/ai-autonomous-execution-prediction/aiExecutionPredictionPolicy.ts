import { AIExecutionPredictionScenario } from "./aiExecutionPredictionScenario";
import {
  AIExecutionPredictionConstraint,
  AIExecutionPredictionRiskLevel,
} from "./aiExecutionPredictionTypes";

export interface AIExecutionPredictionPolicy {
  minimumConfidence: number;
  minimumSuccessProbability: number;
  maximumRiskLevel: AIExecutionPredictionRiskLevel;
}

export interface AIExecutionPredictionPolicyEvaluation {
  accepted: AIExecutionPredictionScenario[];
  rejected: AIExecutionPredictionScenario[];
}

export function applyAIExecutionPredictionPolicy(
  scenarios: AIExecutionPredictionScenario[],
  policy: AIExecutionPredictionPolicy,
): AIExecutionPredictionPolicyEvaluation {
  const accepted: AIExecutionPredictionScenario[] = [];
  const rejected: AIExecutionPredictionScenario[] = [];

  for (const scenario of scenarios) {
    const constraints = [
      ...scenario.constraints,
      ...evaluateAIExecutionPredictionPolicyConstraints(
        scenario,
        policy,
      ),
    ];

    const blocked = constraints.some((constraint) => constraint.blocking);

    const evaluated: AIExecutionPredictionScenario = {
      ...scenario,
      constraints,
      status: blocked ? "rejected" : "eligible",
    };

    if (blocked) {
      rejected.push(evaluated);
    } else {
      accepted.push(evaluated);
    }
  }

  return { accepted, rejected };
}

export function evaluateAIExecutionPredictionPolicyConstraints(
  scenario: AIExecutionPredictionScenario,
  policy: AIExecutionPredictionPolicy,
): AIExecutionPredictionConstraint[] {
  const constraints: AIExecutionPredictionConstraint[] = [];

  if (scenario.confidence < policy.minimumConfidence) {
    constraints.push({
      id: `${scenario.id}:confidence`,
      description: "Confidence below policy.",
      blocking: true,
      severity: "high",
    });
  }

  if (scenario.successProbability < policy.minimumSuccessProbability) {
    constraints.push({
      id: `${scenario.id}:success`,
      description: "Success probability below policy.",
      blocking: true,
      severity: "high",
    });
  }

  if (
    getAIExecutionPredictionRiskRank(scenario.riskLevel) >
    getAIExecutionPredictionRiskRank(policy.maximumRiskLevel)
  ) {
    constraints.push({
      id: `${scenario.id}:risk`,
      description: "Risk exceeds policy.",
      blocking: true,
      severity: scenario.riskLevel,
    });
  }

  return constraints;
}

export function getAIExecutionPredictionRiskRank(
  level: AIExecutionPredictionRiskLevel,
): number {
  switch (level) {
    case "low":
      return 1;
    case "medium":
      return 2;
    case "high":
      return 3;
    case "critical":
      return 4;
  }
}