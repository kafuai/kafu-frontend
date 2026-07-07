import { OptimizationPolicyDecision } from "./optimizationPolicy";
import { OptimizationValidationResult } from "./optimizationValidator";

export interface OptimizationGovernanceResult {
  approved: boolean;
  requiresReview: boolean;
  notes: string[];
  evaluatedAt: Date;
}

export function evaluateOptimizationGovernance(
  policyDecision: OptimizationPolicyDecision,
  validation: OptimizationValidationResult,
): OptimizationGovernanceResult {
  const notes: string[] = [];

  if (!policyDecision.approved) {
    notes.push("Rejected by optimization policy.");
  }

  if (!validation.valid) {
    notes.push(...validation.messages);
  }

  return {
    approved: policyDecision.approved && validation.valid,
    requiresReview:
      policyDecision.requiresHumanApproval || !validation.valid,
    notes,
    evaluatedAt: new Date(),
  };
}