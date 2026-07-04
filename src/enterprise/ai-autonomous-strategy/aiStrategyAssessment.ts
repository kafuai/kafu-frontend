import {
  AIAutonomousStrategyImpact,
  AIAutonomousStrategyRecommendation,
  AIAutonomousStrategyRisk,
  AIAutonomousStrategyScore,
} from "./aiAutonomousStrategyTypes";
import { AIStrategyObjective } from "./aiStrategyObjective";
import { AIStrategySignal } from "./aiStrategySignal";

export interface AIStrategyAssessment {
  id: string;
  organizationId: string;

  signalId: string;
  objectiveIds: string[];

  impact: AIAutonomousStrategyImpact;
  risk: AIAutonomousStrategyRisk;
  feasibility: AIAutonomousStrategyScore;
  strategicFit: AIAutonomousStrategyScore;

  recommendation: AIAutonomousStrategyRecommendation;

  assessedAt: Date;
}

export interface CreateAIStrategyAssessmentInput {
  id: string;
  signal: AIStrategySignal;
  objectives: AIStrategyObjective[];
  impact: AIAutonomousStrategyImpact;
  risk: AIAutonomousStrategyRisk;
  feasibility: AIAutonomousStrategyScore;
  strategicFit?: AIAutonomousStrategyScore;
  recommendation?: AIAutonomousStrategyRecommendation;
  assessedAt?: Date;
}

function calculateStrategicFit(
  signal: AIStrategySignal,
  objectives: AIStrategyObjective[],
): AIAutonomousStrategyScore {
  if (objectives.length === 0) {
    return {
      value: 0,
      confidence: signal.confidence,
    };
  }

  const relatedObjectives = objectives.filter((objective) =>
    signal.relatedObjectiveIds.includes(objective.id),
  );

  const value = relatedObjectives.length / objectives.length;

  return {
    value,
    confidence: signal.confidence,
  };
}

export function createAIStrategyAssessment(
  input: CreateAIStrategyAssessmentInput,
): AIStrategyAssessment {
  const strategicFit =
    input.strategicFit ?? calculateStrategicFit(input.signal, input.objectives);

  return {
    id: input.id,
    organizationId: input.signal.organizationId,

    signalId: input.signal.id,
    objectiveIds: input.objectives.map((objective) => objective.id),

    impact: input.impact,
    risk: input.risk,
    feasibility: input.feasibility,
    strategicFit,

    recommendation:
      input.recommendation ??
      {
        summary: "Review strategic signal for enterprise planning.",
        justification: "Assessment created from autonomous strategy inputs.",
      },

    assessedAt: input.assessedAt ?? new Date(),
  };
}