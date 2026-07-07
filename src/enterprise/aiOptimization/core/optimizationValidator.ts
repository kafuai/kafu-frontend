import { OptimizationOpportunity } from "./optimizationOpportunity";
import { OptimizationPolicyDecision } from "./optimizationPolicy";

export interface OptimizationValidationResult {
  valid: boolean;
  messages: string[];
}

export function validateOptimizationExecution(
  opportunity: OptimizationOpportunity,
  policyDecision: OptimizationPolicyDecision,
): OptimizationValidationResult {
  const messages: string[] = [];

  if (!policyDecision.approved) {
    messages.push("Optimization policy rejected the opportunity.");
  }

  if (opportunity.confidence < 0.5) {
    messages.push("Confidence score is below the execution threshold.");
  }

  return {
    valid: messages.length === 0,
    messages,
  };
}