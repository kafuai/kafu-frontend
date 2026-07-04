import { AIExecutionAdaptationDecision } from "./aiExecutionAdaptationDecision";
import { AIExecutionAdaptationEvaluation } from "./aiExecutionAdaptationEvaluator";
import { AIExecutionAdaptationReport } from "./aiExecutionAdaptationReporter";

export interface AIExecutionAdaptationAuditRecord {
  executionId: string;
  auditedAt: Date;
  action: string;
  confidence: string;
  score: number;
  passed: boolean;
  notes: string[];
}

export function createAIExecutionAdaptationAuditRecord(
  decision: AIExecutionAdaptationDecision,
  evaluation: AIExecutionAdaptationEvaluation,
  report: AIExecutionAdaptationReport,
): AIExecutionAdaptationAuditRecord {
  const notes: string[] = [
    `Action: ${decision.action}`,
    `Confidence: ${decision.confidence}`,
    report.summary,
  ];

  return {
    executionId: decision.executionId,
    auditedAt: new Date(),
    action: decision.action,
    confidence: decision.confidence,
    score: evaluation.adaptationScore,
    passed: evaluation.readyForExecution,
    notes,
  };
}