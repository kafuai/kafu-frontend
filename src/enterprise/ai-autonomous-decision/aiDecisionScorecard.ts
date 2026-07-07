import { AIDecisionCriterion } from "./aiDecisionCriteria";
import { AIDecisionOption } from "./aiDecisionOption";
import { AIDecisionCriterionScoreValue } from "./aiAutonomousDecisionTypes";

export interface AIDecisionCriterionScore {
  criterionId: string;
  criterionName: string;
  weight: number;
  score: AIDecisionCriterionScoreValue;
  weightedScore: number;
}

export interface AIDecisionScorecard {
  optionId: string;
  totalScore: number;
  criteriaScores: AIDecisionCriterionScore[];
  evaluatedAt: Date;
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function scoreByCriterion(
  option: AIDecisionOption,
  criterion: AIDecisionCriterion,
): AIDecisionCriterionScoreValue {
  switch (criterion.type) {
    case "impact":
    case "business_value":
      return {
        value: clampScore(option.expectedValue ?? option.expectedImpact),
        reason: "Expected enterprise value and impact were evaluated.",
      };

    case "confidence":
      return {
        value: clampScore(option.confidence),
        reason: "Confidence score reflects evidence strength.",
      };

    case "cost":
      return {
        value: clampScore(1 - option.estimatedCost),
        reason: "Lower estimated cost improves the decision score.",
      };

    case "speed":
      return {
        value: clampScore(1 - option.timeToValueDays / 365),
        reason: "Faster time to value improves the decision score.",
      };

    case "feasibility":
    case "operational_feasibility":
      return {
        value: clampScore(option.feasibility),
        reason: "Feasibility score reflects implementation likelihood.",
      };

    case "urgency":
      return {
        value: clampScore(option.urgency),
        reason: "Urgency score reflects time sensitivity.",
      };

    case "risk":
      return {
        value:
          option.riskLevel === "low"
            ? 1
            : option.riskLevel === "medium"
              ? 0.65
              : option.riskLevel === "high"
                ? 0.35
                : 0.1,
        reason: "Risk score penalizes higher risk levels.",
      };

    case "strategic_alignment":
      return {
        value: clampScore((option.expectedValue + option.feasibility) / 2),
        reason: "Strategic alignment inferred from value and feasibility.",
      };

    case "customer_impact":
      return {
        value: clampScore((option.expectedValue + option.urgency) / 2),
        reason: "Customer impact inferred from value and urgency.",
      };

    case "operational_impact":
      return {
        value: clampScore((option.feasibility + (1 - option.estimatedCost)) / 2),
        reason: "Operational impact inferred from feasibility and cost efficiency.",
      };

    case "compliance":
      return {
        value:
          option.riskLevel === "severe" || option.riskLevel === "critical" ? 0.2 : 0.8,
        reason: "Compliance score is reduced for critical or severe risk decisions.",
      };
  }
}

export function createAIDecisionScorecard(
  option: AIDecisionOption,
  criteria: AIDecisionCriterion[],
): AIDecisionScorecard {
  const criteriaScores = criteria.map((criterion) => {
    const score = scoreByCriterion(option, criterion);

    return {
      criterionId: criterion.id,
      criterionName: criterion.name,
      weight: criterion.weight,
      score,
      weightedScore: score.value * criterion.weight,
    };
  });

  return {
    optionId: option.id,
    totalScore: criteriaScores.reduce((sum, item) => sum + item.weightedScore, 0),
    criteriaScores,
    evaluatedAt: new Date(),
  };
}