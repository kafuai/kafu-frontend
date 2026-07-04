import { AIExecutionReasoningPlan } from "./aiExecutionReasoningPlanner";

export interface AIExecutionReasoningReport {
  inputId: string;
  outcome: string;
  summary: string;
  nextActions: string[];
  generatedAt: Date;
}

export function createAIExecutionReasoningReport(
  plan: AIExecutionReasoningPlan,
): AIExecutionReasoningReport {
  return {
    inputId: plan.inputId,
    outcome: plan.decision.outcome,
    summary: [
      plan.evaluation.summary,
      `Decision: ${plan.decision.outcome}`,
      `Reason: ${plan.decision.reason}`,
    ].join(" | "),
    nextActions: plan.nextActions,
    generatedAt: new Date(),
  };
}

export function formatAIExecutionReasoningReport(
  report: AIExecutionReasoningReport,
): string {
  return [
    `AI Execution Reasoning Report`,
    `Input: ${report.inputId}`,
    `Outcome: ${report.outcome}`,
    `Summary: ${report.summary}`,
    `Next Actions: ${report.nextActions.join("; ")}`,
  ].join("\n");
}