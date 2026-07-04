import {
  AIExecutionValidationDecision,
} from "./aiAutonomousExecutionValidationTypes";
import { AIExecutionValidationResult } from "./aiExecutionValidator";

export function determineAIExecutionValidationDecision(
  result: AIExecutionValidationResult,
  score: number
): AIExecutionValidationDecision {
  const blocking = result.findings.some(
    (f) => f.severity === "blocking"
  );

  if (blocking) {
    return "rejected";
  }

  if (score >= 90) {
    return "approved";
  }

  if (score >= 75) {
    return "approved_with_warnings";
  }

  if (score >= 60) {
    return "manual_review_required";
  }

  return "rejected";
}