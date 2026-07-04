import { AIExecutionDecisionOption } from "./aiExecutionDecisionOption";
import {
  AIExecutionDecisionConstraint,
  AIExecutionDecisionRiskLevel,
} from "./aiExecutionDecisionIntelligenceTypes";

export interface AIExecutionDecisionPolicy {
  minimumConfidence: number;
  minimumFeasibility: number;
  maximumRiskLevel: AIExecutionDecisionRiskLevel;
  requireNonEmptyDescription?: boolean;
}

export interface AIExecutionDecisionPolicyEvaluation {
  accepted: AIExecutionDecisionOption[];
  rejected: AIExecutionDecisionOption[];
}

export function applyAIExecutionDecisionPolicy(
  options: AIExecutionDecisionOption[],
  policy: AIExecutionDecisionPolicy,
): AIExecutionDecisionPolicyEvaluation {
  const accepted: AIExecutionDecisionOption[] = [];
  const rejected: AIExecutionDecisionOption[] = [];

  for (const option of options) {
    const constraints = [
      ...option.constraints,
      ...evaluateAIExecutionDecisionPolicyConstraints(option, policy),
    ];

    const blocked = constraints.some((constraint) => constraint.blocking);

    const evaluatedOption: AIExecutionDecisionOption = {
      ...option,
      constraints,
      status: blocked ? "rejected" : "eligible",
    };

    if (blocked) {
      rejected.push(evaluatedOption);
    } else {
      accepted.push(evaluatedOption);
    }
  }

  return {
    accepted,
    rejected,
  };
}

export function evaluateAIExecutionDecisionPolicyConstraints(
  option: AIExecutionDecisionOption,
  policy: AIExecutionDecisionPolicy,
): AIExecutionDecisionConstraint[] {
  const constraints: AIExecutionDecisionConstraint[] = [];

  if (option.confidence < policy.minimumConfidence) {
    constraints.push({
      id: `${option.id}:minimum-confidence`,
      description: `Confidence below ${policy.minimumConfidence}.`,
      blocking: true,
      severity: "high",
    });
  }

  if (option.feasibility < policy.minimumFeasibility) {
    constraints.push({
      id: `${option.id}:minimum-feasibility`,
      description: `Feasibility below ${policy.minimumFeasibility}.`,
      blocking: true,
      severity: "high",
    });
  }

  if (
    getAIExecutionDecisionRiskRank(option.riskLevel) >
    getAIExecutionDecisionRiskRank(policy.maximumRiskLevel)
  ) {
    constraints.push({
      id: `${option.id}:risk-level`,
      description: `Risk exceeds allowed policy.`,
      blocking: true,
      severity: option.riskLevel,
    });
  }

  if (
    policy.requireNonEmptyDescription &&
    option.description.trim().length === 0
  ) {
    constraints.push({
      id: `${option.id}:description`,
      description: "Description is required.",
      blocking: true,
      severity: "medium",
    });
  }

  return constraints;
}

export function getAIExecutionDecisionRiskRank(
  riskLevel: AIExecutionDecisionRiskLevel,
): number {
  switch (riskLevel) {
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