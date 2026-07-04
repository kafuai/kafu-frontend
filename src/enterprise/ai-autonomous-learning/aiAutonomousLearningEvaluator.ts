import { AIAutonomousLearningFeedback } from "./aiAutonomousLearningFeedback";
import { AIAutonomousLearningObjective } from "./aiAutonomousLearningObjective";
import { AIAutonomousLearningSignal } from "./aiAutonomousLearningSignal";

export interface AIAutonomousLearningEvaluationResult {
  organizationId: string;
  score: number;
  signalCount: number;
  feedbackCount: number;
  objectiveCount: number;
  negativeSignalCount: number;
  actionableFeedbackCount: number;
  completedObjectiveCount: number;
  recommendations: string[];
  evaluatedAt: Date;
}

export function evaluateAIAutonomousLearningState(
  organizationId: string,
  signals: AIAutonomousLearningSignal[],
  feedback: AIAutonomousLearningFeedback[],
  objectives: AIAutonomousLearningObjective[],
): AIAutonomousLearningEvaluationResult {
  const negativeSignalCount = signals.filter((signal) => signal.impact === "negative").length;
  const actionableFeedbackCount = feedback.filter((item) => Boolean(item.recommendedAction)).length;
  const completedObjectiveCount = objectives.filter((objective) => objective.status === "completed").length;

  const signalPenalty = negativeSignalCount * 10;
  const feedbackBoost = actionableFeedbackCount * 5;
  const objectiveBoost = completedObjectiveCount * 15;

  const score = Math.max(0, Math.min(100, 70 - signalPenalty + feedbackBoost + objectiveBoost));

  const recommendations: string[] = [];

  if (negativeSignalCount > 0) {
    recommendations.push("Prioritize negative learning signals for review.");
  }

  if (actionableFeedbackCount === 0) {
    recommendations.push("Capture more actionable feedback before adapting behavior.");
  }

  if (completedObjectiveCount === 0 && objectives.length > 0) {
    recommendations.push("Track objective progress and close measurable learning goals.");
  }

  return {
    organizationId,
    score,
    signalCount: signals.length,
    feedbackCount: feedback.length,
    objectiveCount: objectives.length,
    negativeSignalCount,
    actionableFeedbackCount,
    completedObjectiveCount,
    recommendations,
    evaluatedAt: new Date(),
  };
}