import { SlaPolicy } from "./slaPolicy";

export interface SlaEvaluationResult {
  compliant: boolean;
  breached: boolean;
}

export function evaluateSla(
  policy: SlaPolicy,
  elapsedMinutes: number,
): SlaEvaluationResult {
  return {
    compliant: elapsedMinutes <= policy.resolutionTimeMinutes,
    breached: elapsedMinutes > policy.resolutionTimeMinutes,
  };
}
