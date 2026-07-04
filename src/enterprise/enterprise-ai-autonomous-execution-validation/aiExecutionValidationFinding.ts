import {
  AIExecutionValidationCategory,
  AIExecutionValidationEvidence,
  AIExecutionValidationSeverity,
} from "./aiAutonomousExecutionValidationTypes";

export interface AIExecutionValidationFinding {
  findingId: string;
  category: AIExecutionValidationCategory;
  severity: AIExecutionValidationSeverity;
  title: string;
  description: string;
  recommendation: string;
  evidence: AIExecutionValidationEvidence[];
  createdAt: string;
}

export function createAIExecutionValidationFinding(
  input: Omit<AIExecutionValidationFinding, "createdAt">
): AIExecutionValidationFinding {
  return {
    ...input,
    createdAt: new Date().toISOString(),
  };
}

export function isBlockingValidationFinding(
  finding: AIExecutionValidationFinding
): boolean {
  return finding.severity === "blocking";
}

export function isCriticalValidationFinding(
  finding: AIExecutionValidationFinding
): boolean {
  return finding.severity === "critical";
}