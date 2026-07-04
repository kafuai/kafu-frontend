import { AIExecutionAdaptationDecision } from "./aiExecutionAdaptationDecision";
import { AIExecutionAdaptationEvaluation } from "./aiExecutionAdaptationEvaluator";
import { AIExecutionAdaptationPlan } from "./aiExecutionAdaptationPlanner";

export interface AIExecutionAdaptationReport {
  executionId: string;
  generatedAt: Date;
  action: string;
  confidence: string;
  adaptationScore: number;
  readyForExecution: boolean;
  summary: string;
  plannedSteps: number;
}

export function createAIExecutionAdaptationReport(
  decision: AIExecutionAdaptationDecision,
  plan: AIExecutionAdaptationPlan,
  evaluation: AIExecutionAdaptationEvaluation,
): AIExecutionAdaptationReport {
  return {
    executionId: decision.executionId,
    generatedAt: new Date(),
    action: decision.action,
    confidence: decision.confidence,
    adaptationScore: evaluation.adaptationScore,
    readyForExecution: evaluation.readyForExecution,
    summary: evaluation.summary,
    plannedSteps: plan.steps.length,
  };
}