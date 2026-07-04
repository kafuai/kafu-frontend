import {
  AIExecutionComplianceEvidence,
  AIExecutionComplianceControl,
} from "./aiAutonomousExecutionComplianceTypes";

export interface AIExecutionComplianceEvidenceInput {
  source: string;
  summary: string;
  confidence?: number;
}

export function createAIExecutionComplianceEvidence(
  control: AIExecutionComplianceControl,
  input: AIExecutionComplianceEvidenceInput
): AIExecutionComplianceEvidence {
  return {
    controlId: control.id,
    source: input.source,
    summary: input.summary,
    confidence: Math.min(Math.max(input.confidence ?? 0.75, 0), 1),
    collectedAt: new Date().toISOString(),
  };
}

export function hasSufficientComplianceEvidence(
  evidence: AIExecutionComplianceEvidence[],
  controlId: string,
  minimumConfidence = 0.65
): boolean {
  return evidence.some(
    (item) =>
      item.controlId === controlId && item.confidence >= minimumConfidence
  );
}

export function summarizeComplianceEvidence(
  evidence: AIExecutionComplianceEvidence[]
): Record<string, number> {
  return evidence.reduce<Record<string, number>>((summary, item) => {
    summary[item.controlId] = (summary[item.controlId] ?? 0) + 1;
    return summary;
  }, {});
}