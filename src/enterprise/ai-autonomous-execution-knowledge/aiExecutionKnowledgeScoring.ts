import { AIExecutionKnowledgeRecord } from "./aiExecutionKnowledgeRecord";

export interface AIExecutionKnowledgeScore {
  overall: number;
  confidence: number;
  reusability: number;
  strategicValue: number;
  operationalImpact: number;
  riskReduction: number;
}

function clamp(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function scoreAIExecutionKnowledge(
  record: AIExecutionKnowledgeRecord,
): AIExecutionKnowledgeScore {
  const metrics = record.metrics;

  const overall =
    metrics.confidence * 0.30 +
    metrics.reusability * 0.20 +
    metrics.strategicValue * 0.20 +
    metrics.operationalImpact * 0.20 +
    metrics.riskReduction * 0.10;

  return {
    overall: clamp(overall),
    confidence: clamp(metrics.confidence),
    reusability: clamp(metrics.reusability),
    strategicValue: clamp(metrics.strategicValue),
    operationalImpact: clamp(metrics.operationalImpact),
    riskReduction: clamp(metrics.riskReduction),
  };
}