import { AIExecutionAdaptationDecision } from "./aiExecutionAdaptationDecision";
import { AIExecutionAdaptationPlan } from "./aiExecutionAdaptationPlanner";

export interface AIExecutionAdaptationEvaluation {
  executionId: string;
  adaptationScore: number;
  readyForExecution: boolean;
  summary: string;
}

export function evaluateAIExecutionAdaptationPlan(
  decision: AIExecutionAdaptationDecision,
  plan: AIExecutionAdaptationPlan,
): AIExecutionAdaptationEvaluation {
  const base =
    decision.confidence === "high"
      ? 100
      : decision.confidence === "medium"
        ? 80
        : 60;

  const score = Math.max(0, Math.min(100, base - Math.max(0, plan.steps.length - 1) * 5));

  return {
    executionId: decision.executionId,
    adaptationScore: score,
    readyForExecution: score >= 70,
    summary: `Adaptation plan contains ${plan.steps.length} step(s) with confidence "${decision.confidence}".`,
  };
}