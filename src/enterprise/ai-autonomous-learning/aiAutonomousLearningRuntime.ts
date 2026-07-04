import { evaluateAIAutonomousLearningState, AIAutonomousLearningEvaluationResult } from "./aiAutonomousLearningEvaluator";
import { deriveAIAutonomousLearningInsightFromSignals, AIAutonomousLearningInsight } from "./aiAutonomousLearningInsight";
import { AIAutonomousLearningObjective } from "./aiAutonomousLearningObjective";
import { createAIAutonomousLearningPlanFromInsights, AIAutonomousLearningPlan } from "./aiAutonomousLearningPlan";
import { AIAutonomousLearningPolicy } from "./aiAutonomousLearningPolicy";
import { AIAutonomousLearningSignal } from "./aiAutonomousLearningSignal";
import { AIAutonomousLearningFeedback } from "./aiAutonomousLearningFeedback";

export interface AIAutonomousLearningRuntimeInput {
  organizationId: string;
  signals: AIAutonomousLearningSignal[];
  feedback: AIAutonomousLearningFeedback[];
  objectives: AIAutonomousLearningObjective[];
  policies: AIAutonomousLearningPolicy[];
  executionId: string;
  executedBy: string;
}

export interface AIAutonomousLearningRuntimeResult {
  organizationId: string;
  executionId: string;
  insights: AIAutonomousLearningInsight[];
  plan?: AIAutonomousLearningPlan;
  evaluation: AIAutonomousLearningEvaluationResult;
  executedAt: Date;
}

export function runAIAutonomousLearningRuntime(
  input: AIAutonomousLearningRuntimeInput,
): AIAutonomousLearningRuntimeResult {
  const eligibleSignals = input.signals.filter(
    (signal) =>
      signal.organizationId === input.organizationId &&
      (signal.confidence === "medium" || signal.confidence === "high"),
  );

  const insights =
    eligibleSignals.length > 0
      ? [
          deriveAIAutonomousLearningInsightFromSignals(
            `${input.executionId}-insight-1`,
            input.organizationId,
            "Autonomous Learning Pattern Detected",
            "Signals were analyzed and converted into an autonomous learning insight.",
            eligibleSignals,
            input.executedBy,
          ),
        ]
      : [];

  const plan =
    insights.length > 0
      ? createAIAutonomousLearningPlanFromInsights(
          `${input.executionId}-plan`,
          input.organizationId,
          insights,
          input.objectives,
          input.executedBy,
        )
      : undefined;

  const evaluation = evaluateAIAutonomousLearningState(
    input.organizationId,
    input.signals,
    input.feedback,
    input.objectives,
  );

  return {
    organizationId: input.organizationId,
    executionId: input.executionId,
    insights,
    plan,
    evaluation,
    executedAt: new Date(),
  };
}