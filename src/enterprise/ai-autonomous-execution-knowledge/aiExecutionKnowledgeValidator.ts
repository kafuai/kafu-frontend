import { AIExecutionKnowledgeRecord } from "./aiExecutionKnowledgeRecord";

export interface AIExecutionKnowledgeValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

function isScore(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= 1;
}

export function validateAIExecutionKnowledgeRecord(
  record: AIExecutionKnowledgeRecord,
): AIExecutionKnowledgeValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!record.id.trim()) {
    errors.push("Knowledge record id is required.");
  }

  if (!record.title.trim()) {
    errors.push("Knowledge record title is required.");
  }

  if (!record.summary.trim()) {
    errors.push("Knowledge record summary is required.");
  }

  if (!record.createdBy.trim()) {
    errors.push("Knowledge record creator is required.");
  }

  Object.entries(record.metrics).forEach(([metricName, value]) => {
    if (!isScore(value)) {
      errors.push(`Knowledge metric ${metricName} must be between 0 and 1.`);
    }
  });

  record.evidence.forEach((evidence) => {
    if (!evidence.id.trim()) {
      errors.push("Knowledge evidence id is required.");
    }

    if (!evidence.referenceId.trim()) {
      errors.push(`Knowledge evidence ${evidence.id} reference id is required.`);
    }

    if (!evidence.summary.trim()) {
      warnings.push(`Knowledge evidence ${evidence.id} summary is empty.`);
    }

    if (!isScore(evidence.confidence)) {
      errors.push(`Knowledge evidence ${evidence.id} confidence must be between 0 and 1.`);
    }
  });

  record.recommendations.forEach((recommendation) => {
    if (!recommendation.id.trim()) {
      errors.push("Knowledge recommendation id is required.");
    }

    if (!recommendation.title.trim()) {
      errors.push(`Knowledge recommendation ${recommendation.id} title is required.`);
    }

    if (!recommendation.action.trim()) {
      errors.push(`Knowledge recommendation ${recommendation.id} action is required.`);
    }

    if (!isScore(recommendation.confidence)) {
      errors.push(`Knowledge recommendation ${recommendation.id} confidence must be between 0 and 1.`);
    }
  });

  if (record.evidence.length === 0 && record.reliability !== "experimental") {
    warnings.push("Non-experimental knowledge should include evidence.");
  }

  if (record.status === "active" && record.metrics.confidence < 0.4) {
    warnings.push("Active knowledge has low confidence.");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}