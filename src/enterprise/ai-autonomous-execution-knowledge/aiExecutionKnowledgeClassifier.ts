import { AIExecutionKnowledgeRecord } from "./aiExecutionKnowledgeRecord";
import {
  AIExecutionKnowledgeReliability,
  AIExecutionKnowledgeType,
} from "./aiAutonomousExecutionKnowledgeTypes";

export interface AIExecutionKnowledgeClassification {
  type: AIExecutionKnowledgeType;
  reliability: AIExecutionKnowledgeReliability;
  reasons: string[];
}

export function classifyAIExecutionKnowledge(
  record: AIExecutionKnowledgeRecord,
): AIExecutionKnowledgeClassification {
  const reasons: string[] = [];

  let reliability: AIExecutionKnowledgeReliability = record.reliability;

  if (record.evidence.length >= 5 && record.metrics.confidence >= 0.9) {
    reliability = "trusted";
    reasons.push("High confidence supported by extensive evidence.");
  } else if (record.evidence.length >= 3 && record.metrics.confidence >= 0.75) {
    reliability = "validated";
    reasons.push("Validated by multiple evidence sources.");
  } else if (record.evidence.length > 0) {
    reliability = "observed";
    reasons.push("Observed during execution.");
  } else {
    reliability = "experimental";
    reasons.push("No supporting evidence yet.");
  }

  let type = record.type;

  if (record.tags.includes("failure")) {
    type = "failure-pattern";
  } else if (record.tags.includes("recovery")) {
    type = "recovery-pattern";
  } else if (record.tags.includes("optimization")) {
    type = "optimization-pattern";
  } else if (record.tags.includes("adaptation")) {
    type = "adaptation-pattern";
  }

  return {
    type,
    reliability,
    reasons,
  };
}